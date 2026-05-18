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

async function requestOpenAiDraft(
  apiKey: string,
  _request: WeaponGenerationRequest,
  prompt: string,
): Promise<GeneratedWeaponDraft> {
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You generate balanced Dungeons & Dragons 5e magic weapons and return only valid JSON.',
        },
        {
          role: 'user',
          content: `${prompt}

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
}`,
        },
      ],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI returned ${response.status}.`);
  }

  const payload = (await response.json()) as OpenAiChatResponse;
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI response did not include content.');
  }

  return parseDraft(parseJsonContent(content));
}

export function isAiGenerationConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_LLM_PROXY_URL || import.meta.env.VITE_OPENAI_API_KEY,
  );
}

export async function generateWeaponDraftWithAi(
  request: WeaponGenerationRequest,
): Promise<GeneratedWeaponDraft> {
  const prompt = buildWeaponPrompt(request);
  const proxyEndpoint = import.meta.env.VITE_LLM_PROXY_URL;

  if (proxyEndpoint) {
    return requestProxyDraft(proxyEndpoint, request, prompt);
  }

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (apiKey) {
    return requestOpenAiDraft(apiKey, request, prompt);
  }

  throw new Error('AI generation is not configured.');
}
