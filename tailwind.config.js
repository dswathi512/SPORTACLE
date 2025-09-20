/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Noto Sans"', '"Noto Sans Devanagari"', '"Noto Sans Telugu"', 'sans-serif'],
      },
      colors: {
        'brand-primary': '#0052CC',
        'brand-secondary': '#FF8B00',
        'brand-dark': '#0A1D37',
        'brand-light': '#F4F5F7',
        'brand-gray': '#6B778C',
      }
    }
  },
  plugins: [],
}