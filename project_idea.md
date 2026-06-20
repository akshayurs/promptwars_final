Context & Persona:
Act as a Senior Frontend Engineer and WebGPU Specialist. We are building a hackathon project called "pebbl." (an AI Pet Rock for mental wellness). The target audience is Gen-Z Indian students facing extreme pressure from competitive exams (JEE/NEET/UPSC).

The vibe is ironic, cozy, and anti-corporate. Instead of clinical mental health tracking, users "yap" (voice-vent) to a digital pet rock. Instead of earning "sanity points," taking mental breaks makes the rock grow moss.

Strict Architectural Constraint (CRITICAL):
This is a 100% Zero-Backend, Client-Side-Only application. Do NOT suggest, mock, or write any Node.js, Express, Python, or API backend code. The app must run entirely in the browser using WebGPU, IndexedDB, and local storage to guarantee absolute user privacy.

Core Tech Stack:

Framework: Vite + React + TypeScript

Styling: Tailwind CSS (Theme: earthy tones, stone grays, moss greens, cozy lo-fi aesthetic)

State Management: Zustand with persist middleware (for syncing game state to local storage)

Storage: localforage (wrapping IndexedDB for storing audio transcripts and news logs)

AI Engine: @xenova/transformers (Transformers.js v3 running via WebGPU for local sentiment analysis and embeddings)

Local RAG / Vector DB: @orama/orama (in-browser vector database for long-term memory)

Voice Processing: Native browser Web Speech API (SpeechRecognition)

Feature Requirements:

1. The "Yap to pebbl" Voice Engine

Create a UI component with a microphone button.

Use the Web Speech API to transcribe the user's voice in real-time.

Feed the transcribed text into a small local Transformers.js model (e.g., distilbert-base-uncased-finetuned-sst-2-english) to calculate the stress/sentiment score.

1. Gamification: The Moss System

In the Zustand store, track two states: rockHealth (0-100) and mossLevel (0-5).

If the sentiment is highly negative (stressed), the rockHealth drops.

If the user completes a "Sidequest" (e.g., "Drink water" or "Step away from the screen for 5 mins"), mossLevel increases.

The UI should visually update the rock (e.g., adding SVG moss or changing its color) based on these states.

1. Long-Term Memory (RAG in the Browser)

Initialize an Orama vector database locally.

When a user finishes yapping, convert their transcript into a vector using a local embedding model (e.g., Xenova/all-MiniLM-L6-v2) and save it to Orama with a timestamp.

Before generating a response to a new vent, query Orama for semantically similar past vents so the Rock can say things like, "You yelled at me about a mock test 3 weeks ago and survived. You will survive this."

1. Seismic Activity (Live News)

Create a background utility function that fetches live Indian exam news via an RSS feed using a free public proxy (e.g., corsproxy.io).

Store the hash of seen headlines in localforage to prevent duplicate alerts.

If new breaking news drops, trigger a UI alert where pebbl wears a hard hat and delivers the news calmly.

Execution Steps for the AI Assistant:

Step 1: Generate the setup commands (Vite, Tailwind, package installs).

Step 2: Write the useRockStore.ts (Zustand configuration with persistence).

Step 3: Write the initialization logic for Transformers.js and Orama inside a custom hook (useAI.ts).

Step 4: Build the main PebbleUI.tsx component, including the Web Speech API integration and visual states for the moss.
