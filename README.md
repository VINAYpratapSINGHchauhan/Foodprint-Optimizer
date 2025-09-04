# Frontend (Next.js + Firebase)

## Quick Start
1) Create a Next.js app (TypeScript, App Router):
```bash
npx create-next-app@latest frontend --ts --app --use-npm
# If you already created the app via this zip, move the contents from this folder over the generated one.
```

2) Install deps:
```bash
cd frontend
npm install firebase react-firebase-hooks chart.js react-chartjs-2
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3) Configure Tailwind: add to `tailwind.config.ts`
```ts
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
export default config
```

4) Add to `app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5) Add Firebase env in `frontend/.env.local`
```
NEXT_PUBLIC_FIREBASE_API_KEY=XXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=XXXX.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=XXXX
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=XXXX.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=XXXX
NEXT_PUBLIC_FIREBASE_APP_ID=1:XXXX:web:XXXX
AI_SERVICE_URL=http://localhost:8000
BACKEND_URL=http://localhost:5001
```

6) Run:
```bash
npm run dev
```

> Note: This folder already includes sample pages/components you can copy into your Next.js project.
