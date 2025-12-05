/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3366ff',
        'deals-processing': '#7a9cff',
        'days-remaining': '#ed8d8d',
        'done-successfully': '#8aefaf',
      },
    },
  },
  plugins: [],
}
