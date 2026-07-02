/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#0f172a',
          card: 'rgba(30, 41, 59, 0.7)',
        },
        primary: {
          DEFAULT: '#10b981',
          hover: '#059669',
        }
      }
    },
  },
  plugins: [],
}
