/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#06b6ff',
        'neon-purple': '#7c3aed',
      }
    }
  },
  plugins: [],
}
