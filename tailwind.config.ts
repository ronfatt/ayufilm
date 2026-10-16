import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#090b0e",
          900: "#0f1217",
          850: "#14181f",
          800: "#1a1f29",
          750: "#212734",
          700: "#2b3343",
          600: "#3d475c",
          500: "#5a6782",
          400: "#8896b3",
          300: "#b5c1d7",
          200: "#e2e8f0",
          100: "#f8fafc",
        },
        cyanAccent: {
          DEFAULT: "#00e5ff",
          hover: "#26ebff",
          muted: "rgba(0, 229, 255, 0.12)",
          border: "rgba(0, 229, 255, 0.35)",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
