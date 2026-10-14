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
          50: '#EEF5FE',
          100: '#D7E7FD',
          200: '#B6D6FC',
          300: '#87BCFA',
          400: '#4F9AF6',
          500: '#1769E0', // Primary blue
          600: '#0E52BE',
          700: '#0C419A',
          800: '#0E377D',
          900: '#173153', // Dark Navy text
        },
        surface: {
          bg: '#F5F8FC',
          card: '#FFFFFF',
          border: '#E2EAF4',
          muted: '#71829A'
        },
        risk: {
          verylow: '#36B878',
          low: '#36B878',
          moderate: '#F3B43F',
          high: '#F47738',
          veryhigh: '#E5484D',
          extreme: '#E5484D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(23, 49, 83, 0.05), 0 1px 2px -1px rgba(23, 49, 83, 0.05)',
        'elevated': '0 4px 12px 0 rgba(23, 49, 83, 0.08), 0 2px 4px -2px rgba(23, 49, 83, 0.04)',
        'floating': '0 10px 24px -4px rgba(23, 49, 83, 0.12), 0 6px 12px -4px rgba(23, 49, 83, 0.06)',
      }
    },
  },
  plugins: [],
}
