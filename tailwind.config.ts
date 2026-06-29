import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Warm, light "editorial roastery" system
        canvas: {
          DEFAULT: "#F2EFE8", // warm page background
          deep: "#ECE8DF",
        },
        surface: {
          DEFAULT: "#FFFFFF", // cards
          raised: "#FFFFFF",
        },
        panel: "#FAF8F2", // sidebar / secondary surfaces
        cream: "#FDFCF8",
        line: {
          DEFAULT: "#E7E2D6",
          soft: "#EFEBE1",
          strong: "#DAD3C3",
        },
        // Primary brand — espresso brown
        espresso: {
          50: "#F6F2EE",
          100: "#EADFD6",
          200: "#D6C3B4",
          300: "#B89A82",
          400: "#8C6B52",
          500: "#6B5240",
          600: "#4A3728",
          700: "#3A2B1F",
          800: "#2A1F16",
          900: "#1C140D",
          DEFAULT: "#4A3728",
        },
        // Secondary — sage / olive green
        sage: {
          50: "#F1F4EF",
          100: "#DEE6D8",
          200: "#BFCEB4",
          300: "#97AC87",
          400: "#6E855F",
          500: "#5E7153",
          600: "#4A5A41",
          700: "#3A4734",
          DEFAULT: "#5E7153",
        },
        // Tertiary accent — warm amber
        amber: {
          50: "#FBF3E9",
          100: "#F6E1C8",
          200: "#EFC28C",
          300: "#E79E4F",
          400: "#D97706",
          500: "#B5630A",
          600: "#8F4E0C",
          DEFAULT: "#D97706",
        },
        // Foreground text scale (warm near-black)
        cocoa: {
          DEFAULT: "#2B2521",
          muted: "#6E6557",
          faint: "#968C7C",
          ghost: "#B6AD9D",
        },
        success: "#4D7C53",
        warning: "#C2820B",
        danger: "#B5462E",
      },
      fontFamily: {
        display: ["var(--font-literata)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.375rem",
        "4xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(43,37,33,0.05), 0 1px 3px rgba(43,37,33,0.06)",
        card: "0 1px 2px rgba(43,37,33,0.04), 0 10px 28px -16px rgba(43,37,33,0.16)",
        float: "0 4px 12px rgba(43,37,33,0.06), 0 28px 56px -28px rgba(43,37,33,0.22)",
        ring: "0 0 0 1px rgba(43,37,33,0.05)",
      },
      backgroundImage: {
        "glow-amber":
          "radial-gradient(60% 60% at 50% 0%, rgba(217,119,6,0.08) 0%, rgba(217,119,6,0) 70%)",
        "glow-sage":
          "radial-gradient(50% 50% at 80% 10%, rgba(94,113,83,0.10) 0%, rgba(94,113,83,0) 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.8s ease both",
        shimmer: "shimmer 1.8s infinite",
      },
      transitionTimingFunction: {
        lux: "cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },
  plugins: [],
};

export default config;
