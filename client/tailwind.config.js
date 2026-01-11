/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pharaoh-gold': '#D4AF37',
        'nile-blue': '#1A5276',
        'desert-sand': '#E2C9A1',
        'papyrus': '#F5F5DC',
        'hieroglyph-black': '#1E1E1E',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'pyramid-pattern': "url('/src/assets/pyramid-pattern.svg')",
        'papyrus-texture': "url('/src/assets/papyrus-texture.jpg')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
