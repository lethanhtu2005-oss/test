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
        surface: "rgb(var(--we-surface, 251 250 244) / <alpha-value>)",
        "surface-alt": "rgb(var(--we-surface-alt, 245 235 216) / <alpha-value>)",
        ink: "rgb(var(--we-ink, 33 37 41) / <alpha-value>)",
        "ink-soft": "rgb(var(--we-ink-soft, 98 94 88) / <alpha-value>)",
        accent: "rgb(var(--we-accent, 52 144 220) / <alpha-value>)",
        "accent-dark": "rgb(var(--we-accent-dark, 29 104 167) / <alpha-value>)",
        line: "rgb(var(--we-line, 234 229 219) / <alpha-value>)",
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
