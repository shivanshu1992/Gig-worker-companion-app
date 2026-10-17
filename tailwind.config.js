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
        gig: {
          amber: '#F59E0B',
          amberDark: '#D97706',
          safety: '#EF4444',
          safetyDark: '#DC2626',
          emerald: '#10B981',
          emeraldDark: '#059669',
          blue: '#2563EB',
          darkBg: '#090D16',
          darkCard: '#111827',
          darkCardHover: '#1F2937',
          sunlightBg: '#FFFDF0',
          sunlightCard: '#FFFFFF',
          sunlightBorder: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.4)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.4)',
        'glow-safety': '0 0 20px -3px rgba(239, 68, 68, 0.4)',
        'sunlight': '4px 4px 0px 0px #000000',
      }
    },
  },
  plugins: [],
}
