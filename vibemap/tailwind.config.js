/** @type {import('tailwindcss').Config} */
module.exports = {
  // to prevent Windows build issues.
  darkMode: 'class',
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
