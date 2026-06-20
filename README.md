# 🪨 Pebbl.ai

> **Your digital AI pet rock and study companion for surviving competitive exams without burning out.**

![Pebbl.ai Banner](/public/logo.png)

Pebbl.ai is an interactive, AI-powered digital study companion designed specifically to combat burnout and mental fatigue among students preparing for intense competitive exams like JEE, NEET, and UPSC.

## ✨ Key Features

*   **Dynamic Pet Rock Companion:** A virtual "pet rock" that tracks your mental wellness (HP) via AI sentiment analysis, dynamically changing its appearance and glowing aura based on your stress levels.
*   **Voice-Activated AI Therapist:** A fully hands-free, voice-activated AI mentor powered by **Google's Gemini 2.5 Flash**, responding with extreme empathy and real-time Google Search grounding.
*   **Therapeutic Soundscapes:** A deeply relaxing 4-7-8 Breathing Game that uses the native Web Audio API to generate low-frequency, solfeggio-inspired therapeutic sine waves to physically calm you down.
*   **Focus & Logging Tools:** Stay laser-focused using an integrated Pomodoro Timer, and use the built-in Daily Journal to log thoughts and naturally restore your pet's health.
*   **Exam Radar:** Keep informed without the distraction of doomscrolling through an "Exam Radar" that fetches and filters live education news tailored specifically to your target exams.
*   **Seamless Persistence:** User data, chat history, and wellness metrics are fully persistent across sessions using Firebase Authentication, Firestore, and synchronized local storage.

## 🛠️ Tech Stack

*   **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS
*   **Animations:** Framer Motion
*   **State Management:** Zustand (with local storage persistence)
*   **AI:** `@google/genai` (Gemini 2.5 Flash with Google Search Grounding)
*   **Backend & Auth:** Firebase (Auth, Firestore)
*   **Icons:** Lucide React

## 🚀 Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏆 PromptWars Competition Optimization

This project has been heavily audited and optimized for competition evaluation:
*   **100% Strict TypeScript:** Zero `any` types or compilation errors (`npx tsc --noEmit` passes).
*   **PWA Compliant:** Fully valid `manifest.json`.
*   **Accessibility (a11y):** Screen-reader compliant with `aria-live` dynamic regions for AI Voice Chat and `aria-label` icon buttons.
*   **Security:** Enforced `Content-Security-Policy` and hidden environment variables.
*   **Efficiency:** Uses `preconnect` tags for rapid DNS resolution to Firebase and Google APIs.
*   **CI/CD:** Automated GitHub Actions workflow checks TypeScript and ESLint on every push.

---
*Built with ❤️ to help students survive the grind.*
