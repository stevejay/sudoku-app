module.exports = {
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["Architects Daughter", "cursive"],
      },
      inset: {
        "1/2": "50%",
      },
      maxHeight: {
        "11/12": "91.666667%",
      },
      boxShadow: {
        "inset-highlight": "0px 0px 2px 3px #ED64A6 inset",
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
