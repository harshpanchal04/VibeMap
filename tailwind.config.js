/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: NativeWind styling is currently disabled in babel.config.js
  // to prevent Windows build issues.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
