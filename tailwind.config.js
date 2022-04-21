module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'orange': '#FE6F00',
        'light-orange': '#FF8C32',
        'sky-blue': '#8DC3DD',
        'light-blue': '#EAF5F9',
      },
      letterSpacing: {
        tightest: '-.175em',
        tighter: '-.1em',
      },
      rotate: {
        '-135': '-135deg',
        '135': '135deg',
      },
      zIndex: {
       '-10': '-10',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
