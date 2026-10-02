# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
"# travel-trill" 
# travel-trill

## Local authentication

Install dependencies once, then run the API and frontend in separate terminals from the repository root:

```sh
npm install
npm --prefix travel-tril-api install
```

```sh
npm --prefix travel-tril-api start
```

```sh
npm run dev
```

Open `http://localhost:5173/home`, select **Sign in**, then **Create account** to register. User records are stored in `travel-tril-api/data/auth.sqlite`; passwords are bcrypt-hashed and browser sessions use HttpOnly cookies.

## Google profile photos

Google OAuth credentials are required for Google sign-in and Gmail profile pictures. In Google Cloud Console, configure the OAuth consent screen, add your account as a test user if the app is in testing, and create an OAuth client with type **Web application**. Set the authorized JavaScript origin to `http://localhost:5173` and the redirect URI to `http://localhost:5173/api/auth/google/callback`.

Copy `travel-tril-api/.env.example` to `travel-tril-api/.env`, then replace `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` with the OAuth client values. Restart the API. Keep `.env` private and never put the client secret in frontend code. When deploying without a same-origin proxy, configure `AUTH_ALLOWED_ORIGINS`, `GOOGLE_REDIRECT_URI`, and `AUTH_FRONTEND_URL` with the deployed URLs; use HTTPS and set `AUTH_COOKIE_SAME_SITE=none` when frontend and API are on different sites.

### Vercel deployment

The frontend `vercel.json` proxies `/api/*` to the existing API deployment at `https://travel-tril-itbd.vercel.app`, keeping browser OAuth and session cookies same-origin. In the API Vercel project's environment settings, set `GOOGLE_REDIRECT_URI` to `https://travel-tril-frontend.vercel.app/api/auth/google/callback`, `AUTH_FRONTEND_URL` to `https://travel-tril-frontend.vercel.app/home`, and `AUTH_ALLOWED_ORIGINS` to `https://travel-tril-frontend.vercel.app`. Add the same frontend URL as the authorized JavaScript origin and the callback above as an authorized redirect URI in Google Cloud Console. Store `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` as API-project environment variables, then redeploy both projects.

The API uses SQLite locally. For Vercel, create a managed PostgreSQL database and set `DATABASE_URL` in the API project's environment variables. Vercel's SQLite fallback is temporary and not suitable for live accounts. The current deployed API must be redeployed with the auth routes and `DATABASE_URL` before the frontend proxy can work.
