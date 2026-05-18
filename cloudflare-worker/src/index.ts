export interface Env {
  AI: Ai;
  ALLOWED_ORIGIN?: string;
  WORKERS_AI_MODEL?: string;
}

type Ai = {
  run: (
    model: string,
    input: {
      messages: Array<{
        role: 'system' | 'user';
        content: string;
      }>;
      max_tokens?: number;
      temperature?: number;
    },
  ) => Promise<unknown>;
};

type WeaponDraft = {
  name: string;
  rarity: string;
  weaponBase: string;
  requiresAttunement: boolean;
  summary: string;
  rulesText: string;
  flavourText: string;
  visualDescription: string;
  curseText?: string;
  estimatedGoldValue: number;
  balanceNotes: string;
};

type GenerateWeaponPayload = {
  prompt?: string;
  request?: unknown;
};

const DEFAULT_MODEL = '@cf/meta/llama-3.1-8b-instruct';

function getCorsHeaders(request: Request, env: Env): HeadersInit {
  const requestOrigin = request.headers.get('Origin');
  const allowedOrigin = env.ALLOWED_ORIGIN || requestOrigin || '*';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function jsonResponse(
  request: Request,
  env: Env,
  body: unknown,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(request, env),
      'Content-Type': 'application/json',
    },
  });
}

function parseJsonFromText(text: string): unknown {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1] ?? trimmed;

  return JSON.parse(candidate);
}

function getTextFromAiResponse(response: unknown): string {
  if (typeof response === 'string') {
    return response;
  }

  if (!response || typeof response !== 'object') {
    return '';
  }

  const value = response as {
    response?: unknown;
    result?: {
      response?: unknown;
    };
  };

  if (typeof value.response === 'string') {
    return value.response;
  }

  if (typeof value.result?.response === 'string') {
    return value.result.response;
  }

  return JSON.stringify(response);
}

function isWeaponDraft(value: unknown): value is WeaponDraft {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const draft = value as Partial<WeaponDraft>;

  return (
    typeof draft.name === 'string' &&
    typeof draft.rarity === 'string' &&
    typeof draft.weaponBase === 'string' &&
    typeof draft.requiresAttunement === 'boolean' &&
    typeof draft.summary === 'string' &&
    typeof draft.rulesText === 'string' &&
    typeof draft.flavourText === 'string' &&
    typeof draft.visualDescription === 'string' &&
    typeof draft.estimatedGoldValue === 'number' &&
    typeof draft.balanceNotes === 'string'
  );
}

function getPromptWithJsonShape(prompt: string): string {
  return `${prompt}

Return exactly one JSON object with this shape and no markdown:
{
  "name": "string",
  "rarity": "string",
  "weaponBase": "string",
  "requiresAttunement": boolean,
  "summary": "string",
  "rulesText": "string",
  "flavourText": "string",
  "visualDescription": "string",
  "curseText": "optional string",
  "estimatedGoldValue": number,
  "balanceNotes": "string"
}`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request, env),
      });
    }

    const url = new URL(request.url);

    if (url.pathname !== '/generate-weapon') {
      return jsonResponse(request, env, { error: 'Not found.' }, 404);
    }

    if (request.method !== 'POST') {
      return jsonResponse(request, env, { error: 'Method not allowed.' }, 405);
    }

    let payload: GenerateWeaponPayload;

    try {
      payload = (await request.json()) as GenerateWeaponPayload;
    } catch {
      return jsonResponse(request, env, { error: 'Invalid JSON body.' }, 400);
    }

    if (!payload.prompt) {
      return jsonResponse(request, env, { error: 'Missing prompt.' }, 400);
    }

    const model = env.WORKERS_AI_MODEL || DEFAULT_MODEL;
    const aiResponse = await env.AI.run(model, {
      messages: [
        {
          role: 'system',
          content:
            'You generate balanced Dungeons & Dragons 5e-compatible magic weapons from frontend-selected parameters. Return only valid JSON.',
        },
        {
          role: 'user',
          content: getPromptWithJsonShape(payload.prompt),
        },
      ],
      max_tokens: 800,
      temperature: 0.8,
    });

    try {
      const parsed = parseJsonFromText(getTextFromAiResponse(aiResponse));
      const possibleDraft =
        parsed && typeof parsed === 'object' && 'draft' in parsed
          ? (parsed as { draft: unknown }).draft
          : parsed;

      if (!isWeaponDraft(possibleDraft)) {
        return jsonResponse(
          request,
          env,
          {
            error: 'Workers AI returned JSON, but it did not match the weapon draft shape.',
          },
          502,
        );
      }

      return jsonResponse(request, env, { draft: possibleDraft });
    } catch {
      return jsonResponse(
        request,
        env,
        {
          error: 'Workers AI did not return parseable weapon JSON.',
        },
        502,
      );
    }
  },
};
