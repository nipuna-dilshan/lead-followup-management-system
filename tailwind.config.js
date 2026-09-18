/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#F8F5F1',
        surface: '#FFFFFF',
        border: '#DDDAD2',
        text: {
          primary: '#191918',
          secondary: '#6D6A63',
        },
        accent: {
          DEFAULT: '#B86A53',
          light: '#F3E4DE',
          dark: '#9A5744',
        },
        success: {
          DEFAULT: '#47735C',
          light: '#E8F1EB',
        },
        warning: {
          DEFAULT: '#A06A32',
          light: '#F5EBDD',
        },
        danger: {
          DEFAULT: '#A34A3B',
          light: '#F7E8E5',
        },
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        input: '8px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(25, 25, 24, 0.06), 0 1px 2px -1px rgba(25, 25, 24, 0.04)',
        modal: '0 20px 60px -12px rgba(25, 25, 24, 0.18)',
      },
    },
  },
  plugins: [],
}
