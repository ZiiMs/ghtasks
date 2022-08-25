/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /(bg|border|outline|text)-(stone|red|yellow|green|blue|indigo|purple|pink)-(100|200|300|400|500|600|700|800|900)/,
      variants: ['hover']
    }
  ],
  theme: {
    extend: {
      colors: {
        user: {
          assignment: 'var(--custom-assignment)',
        },
      },
      backgroundImage: {
        'linear-gradient': {
          opacity: '1',
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
        blurBackdrop: {
          from: {
            opacity: 0,
            transition: 'all 150ms',
          },
          to: {
            opacity: '20',
            transition: 'all 150ms',
          },
        },
        indicator: {
          from: {
            opacity: 0,
            transform: 'scale(0)',
          },
          to: {
            transform: 'scale(1)',
            opacity: 1,
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
        modelBackdrop: 'blurBackdrop 150ms linear 1 forwards',
        indicator: 'indicator 0.35s 2.5s cubic-bezier(.21,1.02,.73,1) forwards',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};

