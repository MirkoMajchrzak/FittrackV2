/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brandStart: '#4f46e5', // indigo-600
        brandEnd:   '#9333ea', // purple-600
      },
    },
  },
  plugins: [],
}
