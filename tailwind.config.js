/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3aafdc', dark: '#2b97c1' },
      },
    },
  },
  plugins: [],
}
