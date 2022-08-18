/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'linear-gradient': {
          'opacity': '1',
          'background-image':
            'linear-gradient(#444cf7 1.8px, transparent 1.8px), linear-gradient(to right, #444cf7 1.8px, #e5e5f7 1.8px)',
          'background-size': '36px 36px',
        },
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(45deg)' },
        },
        enter: {
          from: {
            opacity: 0,
            transform: 'scale(0.5)',
            transition: 'all 150ms',
          },
          to: {
            opacity: 100,
            transform: 'scale(1)',
            transition: 'all 150ms',
          },
        },
        leave: {
          from: {
            opacity: 100,
            transform: 'scale(1)',
            transition: 'all 150ms',
          },
          to: {
            opacity: 0,
            transform: 'scale(0.5)',
            transition: 'all 150ms',
          },
        },
      },
      animation: {
        wiggle: 'wiggle 1400ms ease-in-out 1',
        enter: 'enter 150ms linear 1 forwards',
        leave: 'leave 150ms linear 1 forwards',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};

