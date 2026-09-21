/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f8ae38",
        "primary-hover": "#e09f2f",
        surface: "#fbfaf4",
        "surface-alt": "#f5ebd8",
        ink: "#212529",
        "ink-soft": "#736f68",
        accent: "#3490dc",
        "accent-dark": "#1d68a7",
        line: "#eae5db",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        quote: ["var(--font-quote)", "Georgia", "serif"],
      },
      borderRadius: {
        pill: "30px",
      },
      boxShadow: {
        card: "rgba(0, 0, 0, 0.12) 0px 3px 20px 2px",
        "card-hover": "0px 6px 25px 4px rgba(0, 0, 0, 0.18)",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
