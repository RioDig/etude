/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      white: "#FFFFFF",
      black: "#000000",
      yellow: {
        25: '#FFF5E9',
        50: '#FFEFDA',
        100: '#F9E2C3',
        150: '#F8D8AC',
        200: '#EDB566',
        250: '#F5B45A',
        300: '#E99E36',
        400: '#DB9027',
        500: '#C98424',
        900: '#AC7529',
      },
      gray: {
        25: '#F9F9F9',
        50: '#F4F4F4',
        100: '#F0F0F0',
        150: '#E3E3E3',
        200: '#C9CACD',
        300: '#727477',
        400: '#5C5F62',
        500: '#48494C',
        900: '#323232',
      },
      red: {
        100: '#F78C8C',
        200: '#F26969',
        300: '#EC4646',
        400: '#C72E2E',
        900: '#B12323',
      },
      green: {
        100: '#CBFFDA',
        200: '#A9F1BD',
        300: '#44BF66',
        400: '#2BA94E',
        900: '#177F34',
      },
      orange: {
        200: '#FFB168',
        300: '#FC9638',
        400: '#E98529',
        900: '#B86C25',
      },
      purple: {
        100: '#F3DBFF',
        200: '#EECDFE',
        300: '#BA62E5',
      },
    },
    fontFamily: {
      sansSerif: ['Nunito Sans', 'sans-serif'],
    },
    extend: {

    },
  },
  plugins: [],
};
