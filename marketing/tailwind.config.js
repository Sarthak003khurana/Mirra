/** @type {import('tailwindcss').Config} */
// Tailwind v4 is configured primarily via the `@theme` block in src/index.css
// (see @tailwindcss/vite in vite.config.ts). This file exists for editor/tooling
// intellisense and mirrors those tokens.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#05070a',
        surface: '#0b0f14',
        'surface-raised': '#111720',
        border: '#1e2630',
        teal: {
          50: '#eefffb',
          100: '#c7fff2',
          200: '#90ffe6',
          300: '#52f5d6',
          400: '#22d9bd',
          500: '#0fb8a3',
          600: '#0a9186',
          700: '#0d726c',
          800: '#105a57',
          900: '#124b49',
        },
      },
    },
  },
}
