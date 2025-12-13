<div align="center">
  <h1 align="center">Nix</h1>

  <p align="center">
    <strong>Adaptive Explanation Engine for Complex Topics</strong>
  </p>

  <p align="center">
    <a href="https://reactjs.org/">
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    </a>
    <a href="https://vitejs.dev/">
      <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    </a>
    <a href="https://groq.com/">
      <img src="https://img.shields.io/badge/Powered_by-Groq-000000?style=for-the-badge&logo=groq&logoColor=white" alt="Groq" />
    </a>
  </p>

  <br />
</div>

**Nix** is a next-generation study companion that uses advanced AI to break down complex concepts into understandable explanations. Whether you're a curious 5-year-old or a PhD researcher, Nix adapts its language and depth to suit your needs.

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| **🧠 Adaptive AI** | Powered by the **Groq API** (Llama 3 / Mixtral) for instant, high-quality insights. |
| **🎚️ 5 Complexity Levels** | From **"Child"** (simple analogies) to **"Expert"** (rigorous math & theory). |
| **🕒 Smart History** | Automatically saves your sessions locally. Access past explanations via the sidebar. |
| **📄 Pro PDF Export** | Generate professional, branded PDFs of your notes with **LaTeX math** and formatting preserved. |
| **🎨 Obsidian UI** | A beautiful, distraction-free **dark mode** interface using Tailwind CSS and Vercel-inspired design. |
| **📱 Mobile Ready** | Fully responsive design with touch-friendly controls and stackable layouts. |
| **� Rich Rendering** | Supports **Markdown tables**, **Code blocks** (with syntax highlighting), and **LaTeX equations** ($E=mc^2$). |

---

## 🎛️ How It Works

Nix isn't just a chatbot; it's a tuned engine. Select a level to change how the AI thinks:

1.  **� Child**: Uses magic, stories, and simple words.
2.  **😊 Simple**: Everyday examples for a general audience.
3.  **📚 Detailed**: Structured breakdown with "What, Why, How".
4.  **🎓 Academic**: Undergraduate-level rigor with definitions.
5.  **� Expert**: Edge cases, advanced theory, and LaTeX derivations.

---

## 🛠️ Tech Stack

-   **Frontend**: React + Vite
-   **Styling**: Tailwind CSS + Typography Plugin
-   **Markdown**: `react-markdown`, `remark-math`, `rehype-katex`, `react-syntax-highlighter`
-   **Export**: `jspdf` + `html2canvas` for high-fidelity PDF generation
-   **AI**: Groq SDK (`openai/gpt-oss-120b` compatible endpoint)

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   A free API key from [Groq Console](https://console.groq.com/)

### Installation

1.  **Clone the repo**
    ```bash
    git clone https://github.com/Dsp023/Nix.git
    cd Nix
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    VITE_GROQ_API_KEY=gsk_your_actual_api_key_here
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` to start learning!

---

## � Project Structure

```bash
src/
├── components/
│   └── ExplainEngine.jsx  # Main application logic & UI
├── utils/
│   └── pdfGenerator.js    # PDF export utility
├── index.css              # Global styles & Tailwind directives
├── App.jsx                # Root layout
└── main.jsx               # Entry point
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

<div align="center">
  <p>
    Created by <strong>Nakka Devi Sri Prasad</strong>
  </p>
  <p>
    <a href="https://github.com/Dsp023">
      <img src="https://img.shields.io/github/followers/Dsp023?style=social&label=Follow" alt="GitHub" />
    </a>
  </p>
</div>
