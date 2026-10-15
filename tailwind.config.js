/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f8ae38",
        "primary-hover": "#e09f2f",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",
        ink: "var(--ink)",
        "ink-soft": "var(--muted)",
        accent: "var(--link)",
        "accent-dark": "var(--link)",
        line: "var(--line)",
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
