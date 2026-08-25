/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        shine: {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shine: 'shine 5s linear infinite',
        blob: 'blob 7s infinite',
        fadeIn: 'fadeIn 0.3s ease-out',
      },
      colors: {
        brand: {
          50: '#f0fdf6',
          100: '#dcfce9',
          200: '#bbf7d6',
          300: '#86efb8',
          400: '#4ade93',
          500: '#22c274',
          600: '#16a35e',
          700: '#12804c',
          800: '#12643f',
          900: '#0f5236',
          950: '#052e1d',
        },
        accent: {
          DEFAULT: '#0d9488',
          hover: '#0f766e',
        },
        surface: {
          base: 'var(--surface-base)',
          card: 'var(--surface-card)',
          panel: 'var(--surface-panel)',
          border: 'var(--surface-border)',
          muted: 'var(--surface-muted)',
        },
        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          500: 'var(--ink-500)',
          300: 'var(--ink-300)',
        },
        status: {
          success: '#16a34a',
          warning: '#d97706',
          danger: '#dc2626',
          info: '#0284c7',
        },
        bg: {
          dark: '#0f0f0f',
          card: 'rgba(23, 23, 23, 0.8)',
          panel: '#1a1a1a',
        }
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 26, 20, 0.04), 0 1px 3px rgba(15, 26, 20, 0.06)',
        'card-hover': '0 4px 12px rgba(15, 26, 20, 0.08), 0 2px 4px rgba(15, 26, 20, 0.04)',
        panel: 'inset 0 0 0 1px rgba(15, 26, 20, 0.04)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #22c274 0%, #0d9488 100%)',
      }
    },
  },
  plugins: [],
}