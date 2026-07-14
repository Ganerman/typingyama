/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rush: {
          green: '#35f48c',
          blue: '#42c7ff',
          purple: '#a855f7',
          ink: '#090b12',
          panel: '#111522',
          line: '#243045',
        },
      },
      boxShadow: {
        glow: '0 0 28px rgba(53, 244, 140, 0.24)',
        blueGlow: '0 0 28px rgba(66, 199, 255, 0.22)',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
