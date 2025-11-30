/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cliqtrix: {
          dark: '#1a3a45',
          darker: '#0f2a33',
          sidebar: '#1a4d5c',
          messageLight: '#f5f1e8',
          textLight: '#e8e8e8',
          textMuted: '#a8a8a8',
          accent: '#4a9fb5',
          accentLight: '#6bb5c9',
        }
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        mono: ['"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
}

