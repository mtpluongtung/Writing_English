/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chalkboard: {
          dark: '#2e3d2e',
          DEFAULT: '#3d4f3c',
          light: '#4b5e4a',
          accent: '#2f5233',
        },
        ielts: {
          green: '#2d6a4f',
          darkgreen: '#1b4332',
          lightgreen: '#d8f3dc',
          bordergreen: '#74c69d',
          chip: '#e9f5ec',
          chipText: '#235332',
          gold: '#d4a373',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
