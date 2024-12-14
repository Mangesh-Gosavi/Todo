/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: 'rgb(1, 59, 82)', // Add your custom color here
      },
    },
  },
  plugins: [],
};