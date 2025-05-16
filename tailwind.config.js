/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@windmill/react-ui/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Solana Brand Colors
        solanaGreen: "#00ffba",
        solanaPurple: "#9945ff",
        solanaTeal: "#19fb9b",
        solanaBlue: "#43b4ca",
        solanaBlack: "#19161c",
        accent: "#9945ff", // Solana purple as accent
        accentSecondary: "#00ffba", // Solana green as secondary accent
        headerBg: "rgba(25, 22, 28, 0.95)", // solanaBlack with opacity
        footerBg: "rgba(25, 22, 28, 0.95)",
        menuBg: "rgba(67, 180, 202, 0.85)", // solanaBlue with opacity
        linkAccent: "#19fb9b", // Solana teal
        linkHover: "#00ffba", // Solana green
        footerText: "#ffffff",
        headerText: "#ffffff",
        backgroundMain: "#19161c", // solanaBlack
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        tiny: "9px",
        small: "12px",
        medium: "16px",
        large: "20px",
        huge: "26px",
      },
      boxShadow: {
        header: "0 2px 10px rgba(0, 0, 0, 0.3)",
        footer: "0 -2px 10px rgba(0, 0, 0, 0.3)",
        logo: "0 2px 3px rgba(0, 0, 0, 0.3)",
      },
      borderColor: {
        headerBottom: "#9945ff", // solanaPurple
        footerTop: "#00ffba", // solanaGreen
      },
      height: {
        footer: "40px",
        logo: "40px",
      },
      maxWidth: {
        main: "1280px",
        header: "1200px",
        footer: "1200px",
      },
      padding: {
        header: "15px",
        footer: "15px",
        card: "2em",
        logo: "1.5em",
      },
    },
  },
  plugins: [],
};
