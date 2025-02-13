/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        // 'blue-custom': '#034694',
        'blue-custom': '#034694',
        'lightblue-custom' :'#A4DDED' ,
        'yellow-custom' :'#fbbf24',
        'grey-custom':'#999999',
        'blueheader': '#457b9d',
        // 'blue-custom': 'rgb(70, 130, 180)',
        // 'lightblue-custom' :'#e1ecf2' ,
      },
    },
  },
  plugins: [
    require('flowbite/plugin')({
      charts: true,
    }),
    // ... other plugins
  ],
};
