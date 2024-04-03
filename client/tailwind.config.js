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
      main: '#C5ADEB',  
      mainlight: '#e2d6f5',
      purple: '#C5ADEB',
      lightPurple: '#e2d6f5',
      green: '#9AEDB6',
      orange:'#FDC474'
    },
  }
}

