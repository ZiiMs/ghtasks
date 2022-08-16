/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(45deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1400ms ease-in-out 1',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};

