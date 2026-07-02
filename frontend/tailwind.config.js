/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        violet: {
          950: '#1a0b2e',
        },
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        mint: {
          400: '#34d8b5',
          500: '#14b8a6',
        },
      },
      backgroundImage: {
        'aurora': 'radial-gradient(circle at 20% 20%, rgba(139,92,246,0.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(20,184,166,0.25), transparent 45%), radial-gradient(circle at 50% 100%, rgba(236,72,153,0.2), transparent 45%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 12, 66, 0.25)',
        'glass-lg': '0 20px 60px -10px rgba(31, 12, 66, 0.45)',
        glow: '0 0 30px rgba(139, 92, 246, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
