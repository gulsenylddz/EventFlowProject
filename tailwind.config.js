/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    // tailwind.config.js
theme: {
  extend: {
    animation: {
      'slide-in': 'slideIn 0.3s ease-out',
    },
    keyframes: {
      slideIn: {
        '0%': { transform: 'translateX(100%)' },
        '100%': { transform: 'translateX(0)' },
      },
    },
  },
},

    plugins: [],
  }
  