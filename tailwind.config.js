/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors:{
      primary: '#2ecc70',
      secondary: '#f39c12',
      success: '#2ecc71',
      danger: '#e74c3c',
      warning: '#ff9f43',
      info: '#34495e',
      light: '#f9f9f9',
      dark: '#343a40',
      gray: {
        '100': '#f8f9fa',
        '200': '#e9ecef',
        '300': '#dee2e6',
        '400': '#ced4da',
        '500': '#adb5bd',
        '600': '#6c757d',
        '700': '#495057',
        '800': '#343a40',
        '900': '#21252',
    }}
  },
  plugins: [],
};
