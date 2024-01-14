/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        '3xl': '2000px',
      },
    },
    colors: {
      main: '#93C5FD',  
      mainlight: '#E3F0FF',
      purple: '#C5ADEB',
      lightPurple: '#e2d6f5',
      green: '#9AEDB6',
      orange:'#FDC474'
    },
  }
}

