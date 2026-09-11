import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef2f7",
          100: "#d7e0ec",
          200: "#b0c1d9",
          300: "#89a2c6",
          400: "#4d6c9c",
          500: "#1d3f70",
          600: "#152f56",
          700: "#0f2440",
          800: "#0b1b30",
          900: "#081324",
        },
        coral: {
          50: "#fff1ee",
          100: "#ffe0d9",
          200: "#ffbfae",
          300: "#ff9679",
          400: "#fa6d47",
          500: "#e8492a",
          600: "#c73820",
          700: "#a12c19",
          800: "#7c2214",
          900: "#5c190f",
        },
        sand: {
          50: "#fbf8f3",
          100: "#f4ecdf",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -10px rgba(11, 27, 48, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
