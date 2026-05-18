# D&D Loot Forge Worker AI Proxy

This Cloudflare Worker receives the frontend weapon prompt, sends it to
Cloudflare Workers AI, and returns the validated JSON draft shape expected by
the React app.

## Setup

1. Copy `wrangler.toml.example` to `wrangler.toml`.
2. Replace `https://your-github-user.github.io` in `ALLOWED_ORIGIN` with the
   final GitHub Pages origin.
3. Run locally:

```powershell
npm.cmd run worker:dev
```

4. In the React app `.env.local`, point to the local Worker:

```env
VITE_LLM_PROVIDER=proxy
VITE_LLM_PROXY_URL=http://localhost:8787/generate-weapon
```

5. Restart the Vite dev server.

## Deploy

```powershell
npm.cmd run worker:deploy
```

After deploy, set the frontend build env to:

```env
VITE_LLM_PROVIDER=proxy
VITE_LLM_PROXY_URL=https://your-worker-name.your-subdomain.workers.dev/generate-weapon
```
