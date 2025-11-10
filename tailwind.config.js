/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3CA65C',
        'primary-light': '#EDF7ED',
        'primary-dark': '#2D8A47',
      },
    },
  },
  plugins: [],
}
