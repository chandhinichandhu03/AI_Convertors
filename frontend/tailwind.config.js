/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        card: 'rgba(17, 24, 39, 0.85)',
        primary: {
          DEFAULT: '#8B5CF6',
          hover: '#7c3aed',
        },
        accent: {
          DEFAULT: '#A855F7',
          success: '#22C55E',
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'glow-gradient': 'linear-gradient(90deg, #8B5CF6, #A855F7, #ec4899)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
};
