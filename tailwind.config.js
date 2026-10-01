/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        navy: {
          DEFAULT: '#07111F',
          800: '#0E1F38',
          700: '#152A4A',
        },
        gold: {
          DEFAULT: '#C9A961',
          light: '#DFCA95',
          dark: '#A88842',
        },
        ivory: '#F5F1E8',
        mist: '#8E9DAE',
        lia: {
          bg: "#07111F",
          dark: "#0E1F38",
          surface: "#152A4A",
          card: "rgba(14, 31, 56, 0.65)",
          glass: "rgba(7, 17, 31, 0.75)",
          border: "rgba(255, 255, 255, 0.10)",
          borderGold: "rgba(201, 169, 97, 0.25)",
          text: "#F5F1E8",
          textMuted: "#8E9DAE",
          textSub: "#CBD5E1",
          gold: "#C9A961",
          goldLight: "#DFCA95",
          goldDim: "#A88842",
        }
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
        serif: ["'Playfair Display'", "serif"],
        heading: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-gold': '0 8px 32px 0 rgba(201, 169, 97, 0.15)',
        'glow-gold': '0 0 25px rgba(201, 169, 97, 0.35)',
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(201, 169, 97, 0.3))' },
          '50%': { filter: 'drop-shadow(0 0 22px rgba(201, 169, 97, 0.6))' },
        },
      }
    },
  },
  plugins: [],
}
