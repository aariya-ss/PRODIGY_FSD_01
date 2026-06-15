/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d2e0ff',
          300: '#a3c0ff',
          400: '#6d9bff',
          500: '#3b71f7',
          600: '#1b4cf5',
          700: '#113ad4',
          800: '#0e2ea8',
          900: '#0b2075',
        }
      }
    },
  },
  plugins: [],
}
