import { z } from 'zod';
import { buildWeaponPrompt } from './weaponPrompt';
import type { GeneratedWeaponDraft } from './weaponAi.types';
import type { WeaponGenerationRequest } from '../rules/itemPower.types';

const generatedWeaponDraftSchema = z.object({
  name: z.string().min(1),
  rarity: z.string().min(1),
  weaponBase: z.string().min(1),
  requiresAttunement: z.boolean(),
  summary: z.string().min(1),
  rulesText: z.string().min(1),
  flavourText: z.string().min(1),
  visualDescription: z.string().min(1),
  curseText: z.string().optional(),
  estimatedGoldValue: z.number().nonnegative(),
  balanceNotes: z.string().min(1),
});

type OpenAiChatChoice = {
  message?: {
    content?: string | null;
  };
};

type OpenAiChatResponse = {
  choices?: OpenAiChatChoice[];
};

type OllamaChatResponse = {
  message?: {
    content?: string;
  };
};

type LlmErrorResponse = {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function getErrorMessage(response: Response): Promise<string> {
  const fallback = `LLM provider returned ${response.status}.`;
  const rawBody = await response.text();

  if (!rawBody) {
    return fallback;
  }

  try {
    const payload = JSON.parse(rawBody) as LlmErrorResponse;
    const message = payload.error?.message;
    const code = payload.error?.code;
    const type = payload.error?.type;
    const detail = [message, code, type].filter(Boolean).join(' ');

    return detail ? `LLM provider returned ${response.status}: ${detail}` : fallback;
  } catch {
    return `${fallback} ${rawBody}`;
  }
}

function getPromptWithJsonShape(prompt: string): string {
  return `${prompt}

JSON shape:
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

function getSystemPrompt(): string {
  return 'You generate balanced Dungeons & Dragons 5e-compatible magic weapons from frontend-selected parameters. Return only valid JSON.';
}

function parseJsonContent(content: string): unknown {
  const trimmed = content.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return JSON.parse(fencedMatch?.[1] ?? trimmed);
}

function parseDraft(value: unknown): GeneratedWeaponDraft {
  const possibleDraft =
    value && typeof value === 'object' && 'draft' in value
      ? (value as { draft: unknown }).draft
      : value;

  return generatedWeaponDraftSchema.parse(possibleDraft);
}

async function requestProxyDraft(
  endpoint: string,
  request: WeaponGenerationRequest,
  prompt: string,
): Promise<GeneratedWeaponDraft> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      request,
      prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI proxy returned ${response.status}.`);
  }

  return parseDraft(await response.json());
}

function getChatCompletionsUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/$/, '');

  if (trimmed.endsWith('/chat/completions')) {
    return trimmed;
  }

  return `${trimmed}/chat/completions`;
}

async function requestChatCompletionsDraft(
  options: {
    apiKey?: string;
    endpoint: string;
    model: string;
    providerName: string;
  },
  _request: WeaponGenerationRequest,
  prompt: string,
): Promise<GeneratedWeaponDraft> {
  const requestBody = JSON.stringify({
    model: options.model,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: getSystemPrompt(),
      },
      {
        role: 'user',
        content: getPromptWithJsonShape(prompt),
      },
    ],
    max_tokens: 800,
    temperature: 0.8,
  });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (options.apiKey) {
      headers.Authorization = `Bearer ${options.apiKey}`;
    }

    const response = await fetch(options.endpoint, {
      method: 'POST',
      headers,
      body: requestBody,
    });

    if (response.ok) {
      const payload = (await response.json()) as OpenAiChatResponse;
      const content = payload.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('OpenAI response did not include content.');
      }

      return parseDraft(parseJsonContent(content));
    }

    const message = await getErrorMessage(response);
    const isRetryableRateLimit =
      response.status === 429 &&
      !message.toLowerCase().includes('quota') &&
      !message.toLowerCase().includes('billing');

    if (!isRetryableRateLimit || attempt === 2) {
      throw new Error(`${options.providerName}: ${message}`);
    }

    await sleep(750 * 2 ** attempt);
  }

  throw new Error(`${options.providerName} request failed.`);
}

async function requestOllamaDraft(prompt: string): Promise<GeneratedWeaponDraft> {
  const baseUrl = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';
  const model = import.meta.env.VITE_LLM_MODEL || 'llama3.1';
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      stream: false,
      format: 'json',
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(),
        },
        {
          role: 'user',
          content: getPromptWithJsonShape(prompt),
        },
      ],
      options: {
        temperature: 0.8,
        num_predict: 800,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama: ${await getErrorMessage(response)}`);
  }

  const payload = (await response.json()) as OllamaChatResponse;
  const content = payload.message?.content;

  if (!content) {
    throw new Error('Ollama response did not include content.');
  }

  return parseDraft(parseJsonContent(content));
}

export function isAiGenerationConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_LLM_PROXY_URL ||
      import.meta.env.VITE_LLM_BASE_URL ||
      import.meta.env.VITE_OLLAMA_URL ||
      import.meta.env.VITE_OPENAI_API_KEY,
  );
}

export async function generateWeaponDraftWithAi(
  request: WeaponGenerationRequest,
): Promise<GeneratedWeaponDraft> {
  const prompt = buildWeaponPrompt(request);
  const provider = import.meta.env.VITE_LLM_PROVIDER || 'auto';
  const proxyEndpoint = import.meta.env.VITE_LLM_PROXY_URL;

  if (proxyEndpoint && (provider === 'auto' || provider === 'proxy')) {
    return requestProxyDraft(proxyEndpoint, request, prompt);
  }

  if (provider === 'ollama') {
    return requestOllamaDraft(prompt);
  }

  const genericBaseUrl = import.meta.env.VITE_LLM_BASE_URL;

  if (genericBaseUrl && (provider === 'auto' || provider === 'compatible')) {
    return requestChatCompletionsDraft(
      {
        apiKey: import.meta.env.VITE_LLM_API_KEY,
        endpoint: getChatCompletionsUrl(genericBaseUrl),
        model: import.meta.env.VITE_LLM_MODEL || 'llama3.1',
        providerName: 'OpenAI-compatible LLM',
      },
      request,
      prompt,
    );
  }

  const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (openAiKey && (provider === 'auto' || provider === 'openai')) {
    return requestChatCompletionsDraft(
      {
        apiKey: openAiKey,
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model:
          import.meta.env.VITE_LLM_MODEL ||
          import.meta.env.VITE_OPENAI_MODEL ||
          'gpt-4o-mini',
        providerName: 'OpenAI',
      },
      request,
      prompt,
    );
  }

  throw new Error('LLM generation is not configured.');
}
