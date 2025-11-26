import type { Config } from "tailwindcss";

export default {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          lg: "1rem",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        primary: "#BD1F37",
        primary_hover: "#A21A2F",
        gray_one: "#EEEEEE",
        gray_two: "#A2A2A2",
        gray_three: "#737373",
        gray_four: "#313943",
        dark: "#262C34",
        secondary: "#E7A9B2",
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
} satisfies Config;
