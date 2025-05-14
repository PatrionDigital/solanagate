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
        accent: "#646cff",
        gold: "#d4af37",
        goldLight: "rgba(212, 175, 55, 0.8)",
        goldBorder: "rgba(212, 175, 55, 0.3)",
        headerBg: "rgba(40, 44, 52, 0.8)",
        footerBg: "rgba(40, 44, 52, 0.8)",
        menuBg: "rgba(119, 121, 125, 0.8)",
        linkAccent: "#fff826",
        linkHover: "#f59794",
        footerText: "#ffffff",
        headerText: "#ffffff",
        backgroundMain: "transparent",
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
        headerBottom: "rgba(212, 175, 55, 0.3)",
        footerTop: "rgba(212, 175, 55, 0.3)",
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
