/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.jsx'],
  theme: {
    extend: {
      colors: {
        ink: '#05070a',
        surface: '#0b0f14',
        border: '#1e2630',
        teal: { 300: '#52f5d6', 400: '#22d9bd', 500: '#0fb8a3' },
      },
    },
  },
}
