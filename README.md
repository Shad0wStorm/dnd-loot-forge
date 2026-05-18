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

## AI generation

The frontend can use an LLM when either of these Vite env vars is present:

- `VITE_LLM_PROXY_URL`: recommended. Point this at your own backend/serverless proxy and return either a weapon draft JSON object or `{ "draft": ... }`.
- `VITE_OPENAI_API_KEY`: local development only. Browser-exposed keys are visible to users, so do not use this for a public deploy.

Optional:

- `VITE_OPENAI_MODEL`: defaults to `gpt-4o-mini` when using `VITE_OPENAI_API_KEY`.

Without AI config, the app keeps using the existing rules-based generator.

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
