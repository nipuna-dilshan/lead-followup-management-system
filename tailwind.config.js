/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        // Main Brand / CTA
        accent: {
          DEFAULT: '#BD6B52',
          light: '#F3E2DC',
          dark: '#A95C46',
        },
        primary: {
          DEFAULT: '#BD6B52',
          hover: '#A95C46',
          light: '#F3E2DC',
        },
        // Dark UI (Top navigation, Sidebar)
        dark: {
          DEFAULT: '#111315',
          secondary: '#181A1D',
          border: '#2A2D30',
          muted: '#9A9791',
        },
        // Surfaces & Backgrounds
        background: '#F7F5F1',
        surface: '#FFFFFF',
        hover: '#F0ECE7',
        border: {
          DEFAULT: '#E4E0DA',
          hover: '#F0ECE7',
        },
        // Typography
        text: {
          primary: '#17181A',
          secondary: '#74716C',
          muted: '#9A9791',
        },
        // Semantic status colors
        success: {
          DEFAULT: '#3E8F68',
          light: '#E4F2EB',
        },
        warning: {
          DEFAULT: '#B98545',
          light: '#FAF2E6',
        },
        danger: {
          DEFAULT: '#B85C52',
          light: '#F9EAE8',
        },
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
        input: '10px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(17, 19, 21, 0.04)',
        modal: '0 16px 40px rgba(17, 19, 21, 0.12)',
      },
    },
  },
  plugins: [],
}
