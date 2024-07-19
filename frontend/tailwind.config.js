/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderColor:{
        primary:'1A66FF',
        primaryLight:'194185',

      },
      color:{
        primary:'1A66FF',
        primaryLight:'194185',
      },
      backgroundColor:{
            primary:'1A66FF'
      },
      textColor:{
        primary:'1A66FF',
        primaryLight:'194185',
      },
      fontSize: {
        md: '16px',
        logoFontSize: '32px',
        logoFontSizeSmall: '26px',
      },
      keyframes: {
        arrowMove: {
          '0%': {left: '0%'},
          '50%': {left: '10%'},
          '100%': {left: '0%'},
        }
      },
      padding: {
        rootXPadd: '80px',
      },
      animation: {
        arrowMove: 'arrowMove 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}