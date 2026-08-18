/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kat: {
          deep: '#0B3B82',
          primary: '#1769D2',
          bright: '#2D8CFF',
          soft: '#EAF3FF',
          verylight: '#F4F8FF',
          white: '#FFFFFF',
          offwhite: '#FAFCFF',
          navy: '#081B33',
          text: '#152238',
          muted: '#64748B',
          border: '#DCE8F7',
          success: '#16A34A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'kat-soft': '0 4px 20px -2px rgba(11, 59, 130, 0.08)',
        'kat-hover': '0 12px 30px -4px rgba(23, 105, 210, 0.15)',
        'kat-glow': '0 0 25px rgba(45, 140, 255, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
