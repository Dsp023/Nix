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

Most of the early development was fighting react-markdown and getting KaTeX to render properly inside dynamically generated streaming content.

---

## What it does

Type any concept (or pick from starter suggestions). Pick one of 5 levels. Get an explanation written specifically for that level streamed in real-time.

| Level | What it sounds like |
|-------|-------------------|
| Child | Simple words, analogies, no jargon |
| Simple | Everyday examples, general audience |
| Detailed | Structured breakdown — what, why, how |
| Academic | Undergraduate level, proper definitions, LaTeX equations |
| Expert | Edge cases, advanced theory, LaTeX derivations |

Other things it does:
- **Real-time token streaming**: Watch explanations render chunk-by-chunk without delay
- **Dynamic Learning Paths**: Generates a 5-step learning roadmap for any topic
- **3D Study Flashcards**: Creates 3D flippable flashcards from key terms
- **Multi-Provider AI**: Supports Groq (Llama 3.3), Google Gemini (2.0 Flash), and OpenAI (GPT-4o mini)
- **Math & Syntax Rendering**: Full KaTeX LaTeX math support alongside syntax-highlighted code blocks
- **PDF Export**: Exports your notes as a PDF with math formatting preserved
- **Command Palette & Cheatsheet**: Quick keyboard navigation (`Ctrl+K` / `⌘K` and `?`)
- **Focus Mode**: Distraction-free reading view
- **Local History**: Saves session history locally so you can revisit past explanations

---

## Tech stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **AI Inference**: Multi-provider streaming client supporting Groq, Google Gemini, and OpenAI
- **Markdown & Math**: `react-markdown` + `remark-math` + `rehype-katex` + `rehype-raw`
- **Code Highlighting**: `react-syntax-highlighter` (Prism atomDark)
- **Exporting**: `jspdf` + `html2canvas`

---

## Project structure

```
src/
├── components/
│   ├── ExplainEngine.jsx           # Main orchestrator component
│   ├── Header.jsx                  # Header with active API status
│   ├── InputSection.jsx            # Text prompt, complexity levels & quick topic chips
│   ├── ExplanationView.jsx         # Streaming Markdown + LaTeX rendering & focus mode
│   ├── FollowUpSection.jsx         # Contextual follow-up question chips
│   ├── HistorySidebar.jsx          # Local session history drawer
│   ├── FlashcardViewer.jsx         # 3D flippable study flashcards
│   ├── LearningPathViewer.jsx      # 5-step structured concept roadmaps
│   ├── CommandPalette.jsx          # Ctrl+K command menu
│   ├── ApiKeySettings.jsx          # Multi-provider BYOK configuration modal
│   ├── Keyboardshortcutsmodal.jsx  # Keyboard cheatsheet modal
│   └── Footer.jsx                  # Minimal footer
├── utils/
│   ├── apiService.js               # Multi-provider streaming AI client (Groq, Gemini, OpenAI)
│   └── pdfGenerator.js             # Math-preserved PDF export logic
├── App.jsx
├── index.css
└── main.jsx
```

---

## Running locally

```bash
git clone https://github.com/Dsp023/Nix.git
cd Nix
npm install
```

Create a `.env` file (optional, Nix also supports in-app API key configuration):

```bash
VITE_GROQ_API_KEY=your_groq_key_here
```

Get a free key at [console.groq.com](https://console.groq.com)

```bash
npm run dev
```

Opens at `http://localhost:5173`

---

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl` / `⌘` + `Enter` | Explain topic |
| `Ctrl` / `⌘` + `Shift` + `C` | Copy explanation |
| `Ctrl` / `⌘` + `K` | Open command palette |
| `?` | Open keyboard shortcuts cheatsheet |
| `Esc` | Clear output / Close modals |

---

## Hardest part

Getting the KaTeX math rendering to work inside react-markdown without breaking the syntax highlighter. The `node` prop in the code renderer was causing conflicts with the math blocks. Removing `node` from the destructured props fixed it.

---

Built with care by [Nakka Devi Sri Prasad](https://github.com/Dsp023)
