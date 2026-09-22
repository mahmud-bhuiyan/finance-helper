# Finance Helper — Client (React)

React + TypeScript frontend for Finance Helper.

Deploy as a **separate Vercel project**.

## Setup

```bash
cp .env.example .env
# Set VITE_API_URL to your API URL

npm install
npm run dev
```

App runs at `http://localhost:5173`

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | API base URL including `/api` |

**Local:** `http://localhost:5000/api`  
**Production:** `https://your-server-project.vercel.app/api`

## Vercel deployment

1. Create a new Vercel project pointing to this `client/` folder
2. Framework preset: **Vite**
3. Add `VITE_API_URL` in Vercel env vars pointing to your deployed API
4. Deploy
