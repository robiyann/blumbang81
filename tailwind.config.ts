import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pusaka Merdeka — Primary (Merah Semangat)
        primary: {
          DEFAULT: "#a70009",
          container: "#ce201c",
          fixed: "#ffdad5",
          "fixed-dim": "#ffb4aa",
        },
        "on-primary": "#ffffff",
        "on-primary-container": "#ffe5e1",
        "on-primary-fixed": "#410001",
        "on-primary-fixed-variant": "#930006",
        "inverse-primary": "#ffb4aa",

        // Secondary
        secondary: {
          DEFAULT: "#5d5f5f",
          container: "#dfe0e0",
          fixed: "#e2e2e2",
          "fixed-dim": "#c6c6c7",
        },
        "on-secondary": "#ffffff",
        "on-secondary-container": "#616363",
        "on-secondary-fixed": "#1a1c1c",
        "on-secondary-fixed-variant": "#454747",

        // Tertiary
        tertiary: {
          DEFAULT: "#505252",
          container: "#686a6a",
          fixed: "#e2e2e2",
          "fixed-dim": "#c6c6c7",
        },
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#eaebeb",
        "on-tertiary-fixed": "#1a1c1c",
        "on-tertiary-fixed-variant": "#454747",

        // Surface
        surface: {
          DEFAULT: "#f7fafd",
          dim: "#d7dade",
          bright: "#f7fafd",
          variant: "#e0e3e6",
          tint: "#bd0f12",
          "container-lowest": "#ffffff",
          "container-low": "#f1f4f8",
          container: "#ebeef2",
          "container-high": "#e5e8ec",
          "container-highest": "#e0e3e6",
        },
        "on-surface": "#181c1f",
        "on-surface-variant": "#5c403c",
        "inverse-surface": "#2d3134",
        "inverse-on-surface": "#eef1f5",

        // Background
        background: "#f7fafd",
        "on-background": "#181c1f",

        // Error
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        // Outline
        outline: {
          DEFAULT: "#916f6b",
          variant: "#e5bdb8",
        },
      },

      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        jetbrains: ["var(--font-jetbrains)", "monospace"],
      },

      fontSize: {
        "headline-xl": [
          "clamp(2rem, 4vw, 3rem)",
          { lineHeight: "1.17", fontWeight: "800", letterSpacing: "-0.02em" },
        ],
        "headline-lg": [
          "clamp(1.5rem, 2.5vw, 2rem)",
          { lineHeight: "1.25", fontWeight: "700" },
        ],
        "headline-md": [
          "1.5rem",
          { lineHeight: "1.33", fontWeight: "700" },
        ],
        "body-lg": ["1.125rem", { lineHeight: "1.56", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "label-sm": [
          "0.875rem",
          { lineHeight: "1.43", fontWeight: "500", letterSpacing: "0.05em" },
        ],
      },

      spacing: {
        "section-gap": "7.5rem",
        "section-gap-sm": "4rem",
        "margin-desktop": "5rem",
        "margin-mobile": "1.25rem",
        gutter: "1.5rem",
      },

      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      boxShadow: {
        card: "0 4px 6px -1px rgba(24, 28, 31, 0.08), 0 2px 4px -2px rgba(24, 28, 31, 0.04)",
        "card-hover": "0 10px 25px -5px rgba(24, 28, 31, 0.12), 0 4px 10px -5px rgba(24, 28, 31, 0.06)",
        "nav": "0 1px 3px rgba(24, 28, 31, 0.08)",
        "primary-glow": "0 0 20px rgba(167, 0, 9, 0.3)",
      },

      animation: {
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "countdown-flip": "countdownFlip 0.3s ease-in-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        countdownFlip: {
          "0%": { transform: "rotateX(-90deg)", opacity: "0" },
          "100%": { transform: "rotateX(0deg)", opacity: "1" },
        },
      },

      backgroundImage: {
        "gradient-patriotic": "linear-gradient(135deg, #a70009 0%, #ce201c 50%, #a70009 100%)",
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
