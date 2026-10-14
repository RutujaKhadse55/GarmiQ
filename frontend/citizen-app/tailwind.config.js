/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EDF5FF',
          100: '#D6E8FF',
          200: '#B5D6FF',
          300: '#84BCFF',
          400: '#4B99FE',
          500: '#0866D9', // Primary blue
          600: '#054EB0',
          700: '#043E8F',
          800: '#063574',
          900: '#102A4C', // Dark Navy
        },
        surface: {
          bg: '#F5F9FF',
          card: '#FFFFFF',
          border: '#E2EDF9',
          muted: '#5B708B'
        },
        risk: {
          verylow: '#10B981',
          low: '#84CC16',
          moderate: '#F59E0B',
          high: '#F97316',
          extreme: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(8, 102, 217, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 25px -5px rgba(8, 102, 217, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
