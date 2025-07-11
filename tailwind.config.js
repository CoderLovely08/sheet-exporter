/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6',
        'primary-dark': '#2563eb',
        'secondary': '#10b981',
        'secondary-dark': '#059669',
      }
    },
  },
  plugins: [],
}