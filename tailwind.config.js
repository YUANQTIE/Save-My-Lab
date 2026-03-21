/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        }
      },
      animation: {
        shake: 'shake 0.2s ease-in-out 0s 2',
      },
      backgroundImage: {
        'bg-pattern': "url('images/dlsubg.jpg')",
      },

      spacing: {
        '104': '26rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
}

