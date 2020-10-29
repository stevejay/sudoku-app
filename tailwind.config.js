module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
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
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
