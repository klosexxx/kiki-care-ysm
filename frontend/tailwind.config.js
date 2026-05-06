/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#c8a882',
        'primary-dark': '#b8926a',
        dark: '#1a1a1a',
        light: '#faf8f5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}