module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#05050A',
          900: '#0A0A10',
          800: '#0E0E16',
          700: '#18181F',
          600: '#1E1E2A',
        },
        gold: {
          400: '#FDE047',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};