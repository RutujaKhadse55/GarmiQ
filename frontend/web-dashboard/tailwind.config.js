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
        navy: {
          sidebar: '#0C1B33',
          primary: '#102442',
          dark: '#081426',
          light: '#1B355A'
        },
        action: {
          blue: '#0866D9',
          hover: '#0756B8',
          light: '#EBF4FE'
        },
        surface: {
          bg: '#F4F8FD',
          card: '#FFFFFF',
          border: '#DFEAF7',
          muted: '#7186A3',
          dark: '#132D50'
        },
        risk: {
          low: '#10B981',        // Green
          moderate: '#F59E0B',   // Yellow / Amber
          high: '#F97316',       // Orange / Red
          veryhigh: '#EF4444',   // Deep Red
          extreme: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(16, 36, 66, 0.04), 0 1px 2px -1px rgba(16, 36, 66, 0.04)',
        'card': '0 2px 6px 0 rgba(16, 36, 66, 0.05), 0 1px 3px -1px rgba(16, 36, 66, 0.03)',
        'elevated': '0 8px 20px -4px rgba(16, 36, 66, 0.08), 0 4px 8px -2px rgba(16, 36, 66, 0.04)',
        'modal': '0 20px 40px -8px rgba(12, 27, 51, 0.25)',
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },
  plugins: [],
}
