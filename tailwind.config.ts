import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#111111",
        foreground: "#FFFFFF",
        accent: {
          DEFAULT: "#D90429",
          hover: "#B80322",
          muted: "rgba(217, 4, 41, 0.12)",
        },
        surface: {
          DEFAULT: "#1A1A1A",
          elevated: "#222222",
          border: "#2A2A2A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        glow: "0 0 40px rgba(217, 4, 41, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "quote-pulse": "quotePulse 20s ease-in-out infinite",
        "slide-up-modal": "slideUpModal 0.35s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        quotePulse: {
          "0%, 88%, 100%": {
            boxShadow: "0 4px 24px rgba(217, 4, 41, 0.3)",
            transform: "scale(1)",
          },
          "92%": {
            boxShadow:
              "0 4px 24px rgba(217, 4, 41, 0.4), 0 0 0 6px rgba(217, 4, 41, 0.35), 0 0 0 14px rgba(217, 4, 41, 0)",
            transform: "scale(1.04)",
          },
          "96%": {
            boxShadow: "0 4px 24px rgba(217, 4, 41, 0.3)",
            transform: "scale(1)",
          },
        },
        slideUpModal: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
