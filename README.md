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

Copy `travel-tril-api/.env.example` to `travel-tril-api/.env`, then replace `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` with the OAuth client values. Restart the API. Keep `.env` private and never put the client secret in frontend code. When deploying, configure `AUTH_ALLOWED_ORIGINS`, `GOOGLE_REDIRECT_URI`, and `AUTH_FRONTEND_URL` with the deployed URLs; use HTTPS and set `AUTH_COOKIE_SAME_SITE=none` when frontend and API are on different sites.
