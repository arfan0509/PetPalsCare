/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      poppins: ["Poppins"],
      "poppins-bold": ["Poppins", "bold"],
      "poppins-italic": ["Poppins", "italic"],
    },
  },
  plugins: [require("tailgrids/plugin")],
};
