// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'rose-gold': '#b76e79',
      },
      backgroundImage: {
        'salon-pattern': "url('/image/background.png')",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
      },
      spacing: {
        '18': '4.5rem',
      },
      transitionDuration: {
        '1500': '1500ms',
      }
    },
  },
  plugins: [],
}