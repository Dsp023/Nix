/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a', // Vercel-like dark background
        foreground: '#ededed',
        primary: '#ffffff',
        'primary-foreground': '#000000',
        muted: '#171717',
        'muted-foreground': '#a1a1aa',
        border: '#333333',
        input: '#262626',
        ring: '#ffffff',
        accent: '#e63946', // A splash of color (optional)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

