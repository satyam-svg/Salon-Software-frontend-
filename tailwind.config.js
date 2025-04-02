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
      fontFamily: {
        delius: ['Delius', 'cursive'],
        dancing: ['Dancing Script', 'cursive'],
        ibm: ['IBM Plex Mono', 'monospace'],
      },
      backgroundImage: {
        'salon-pattern': "url('/image/background.png')",
      },
      
      screens: {
        'xs': '480px',
      },
      spacing: {
        '18': '4.5rem',
      },
      transitionDuration: {
        '1500': '1500ms',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}