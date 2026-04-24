# Nix

An adaptive AI explanation engine. Pick a complexity level, type a concept, get an explanation that actually matches where you are.

Live: [nix42.netlify.app](https://nix42.netlify.app)
<img width="1919" height="962" alt="image" src="https://github.com/user-attachments/assets/ef693c82-a837-4c72-b1d3-b56a6f09f36a" />
<img width="1919" height="965" alt="image" src="https://github.com/user-attachments/assets/6639e8f5-9067-47ca-b234-5c0d58495707" />
<img width="1919" height="968" alt="image" src="https://github.com/user-attachments/assets/50cfcd35-2515-4183-a735-4216ea50f465" />
<img width="1919" height="960" alt="image" src="https://github.com/user-attachments/assets/168b3bcd-c354-408f-8d0b-c8bc7c4be38a" />

---

## Why I built this

I kept Googling things and getting explanations that were either too dumbed down or assumed I already knew everything. Couldn't find a middle ground. So I built Nix to let you pick your own level before asking.

Took about 3 weeks. Most of that time was fighting react-markdown and getting KaTeX to render properly inside dynamically generated content.

---

## What it does

Type any concept. Pick one of 5 levels. Get an explanation written specifically for that level.

| Level | What it sounds like |
|-------|-------------------|
| Child | Simple words, analogies, no jargon |
| Simple | Everyday examples, general audience |
| Detailed | Structured breakdown — what, why, how |
| Academic | Undergraduate level, proper definitions |
| Expert | Edge cases, advanced theory, LaTeX derivations |

Other things it does:
- Generates a 5-step learning roadmap for any topic
- Creates 3D flippable flashcards from key concepts
- Exports your notes as a PDF with math formatting preserved
- Saves session history locally so you can come back to it

---

## Tech stack

- React + Vite
- Tailwind CSS
- Groq SDK — Llama 3 for inference
- react-markdown + remark-math + rehype-katex for rendering
- jspdf + html2canvas for PDF export

---

## Project structure

```
src/
├── components/
│   └── ExplainEngine.jsx  # main component — handles UI, API calls, state
├── utils/
│   └── pdfGenerator.js    # PDF export logic
├── index.css
├── App.jsx
└── main.jsx
```

---

## Running locally

```bash
git clone https://github.com/Dsp023/Nix.git
cd Nix
npm install
```

Create a `.env` file:

```
VITE_GROQ_API_KEY=your_groq_key_here
```

Get a free key at [console.groq.com](https://console.groq.com)

```bash
npm run dev
```

Opens at `http://localhost:5173`

---

## Known limitations

- API key is on the client side via Vite env — fine for personal use, not for production
- Everything lives in `ExplainEngine.jsx` — needs to be broken into smaller components
- No backend — history is localStorage only, clears if you switch browsers
- PDF export can be slow on pages with heavy LaTeX content
- No streaming — waits for full response before rendering

---

## Hardest part

Getting the KaTeX math rendering to work inside react-markdown without breaking the syntax highlighter. The `node` prop in the code renderer was causing conflicts with the math blocks. Took a while to figure out that removing `node` from the destructured props fixed it. Committed that fix on March 9th around 2AM.

---

## What I'd do differently

- Split ExplainEngine.jsx into smaller components from the start
- Add a proper backend so history persists across devices
- Use TypeScript — started in JS, by the time I wanted to migrate it was too deep in

---

Built by [Nakka Devi Sri Prasad](https://github.com/Dsp023)
