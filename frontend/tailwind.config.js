/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        shine: {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
      },
      animation: {
        shine: 'shine 5s linear infinite',
      },
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
