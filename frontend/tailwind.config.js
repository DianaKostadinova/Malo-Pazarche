module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', '"Helvetica Neue"', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#0a8ddc',
        secondary: '#667eea',
        accent: '#e1306c',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
