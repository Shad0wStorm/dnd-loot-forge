# Initial folder structure

src/
├── ai/
│   ├── weaponAi.types.ts
│   └── weaponPrompt.ts
│
├── app/
│   ├── App.tsx
│   ├── main.tsx
│   └── styles/
│       ├── globals.css
│       └── variables.css
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── PageHeader.tsx
│   │   └── SectionCard.tsx
│   ├── form/
│   └── output/
│
├── features/
│   └── weapon-generator/
│       ├── data/
│       ├── logic/
│       ├── model/
│       └── utils/
│
├── generators/
│   └── buildFinalWeapon.ts
│
├── rules/
│   ├── balanceValidatr+or.ts
│   ├── itemPower.types.ts
│   └── rarityLimits.ts
│
└── shared/
    ├── constants/
    ├── lib/
    └── types/

# React + TypeScript + Vite

## LLM generation

The weapon generator uses an LLM when provider env vars are present. The
frontend sends the selected weapon parameters to the configured model and uses
its validated result as the generated weapon. Without LLM config, or if the LLM
result fails validation, the app falls back to the existing local rules-based
generator.

Copy `.env.example` to `.env.local`, then choose one setup.

### Local Ollama

This has no per-call API charge, but it runs on your machine and quality/speed
depends on your hardware and chosen model.

```env
VITE_LLM_PROVIDER=ollama
VITE_OLLAMA_URL=http://localhost:11434
VITE_LLM_MODEL=llama3.1
```

### OpenAI-compatible API

Use this for local model servers or providers that expose a
`/chat/completions` API.

```env
VITE_LLM_PROVIDER=compatible
VITE_LLM_BASE_URL=http://localhost:1234/v1
VITE_LLM_MODEL=your-model-name
VITE_LLM_API_KEY=optional-key-if-needed
```

### Custom proxy

Recommended for deployed builds because API keys stay server-side. Return either
a weapon draft JSON object or `{ "draft": ... }`.

```env
VITE_LLM_PROVIDER=proxy
VITE_LLM_PROXY_URL=https://your-api.example.com/generate-weapon
```

The repo includes a Cloudflare Workers AI proxy scaffold in
`cloudflare-worker/`. Use it as the hosted LLM endpoint for GitHub Pages.

Local Worker testing:

```powershell
npm.cmd run worker:dev
```

Then set the frontend to:

```env
VITE_LLM_PROVIDER=proxy
VITE_LLM_PROXY_URL=http://localhost:8787/generate-weapon
```

### OpenAI local testing

Direct browser OpenAI calls are for local development only. Browser-exposed keys
are visible to users, so do not use this for a public deploy.

```env
VITE_LLM_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-your-key-here
VITE_LLM_MODEL=gpt-4o-mini
```

After changing `.env.local`, restart the dev server:

```powershell
npm.cmd run dev -- --host 127.0.0.1
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
