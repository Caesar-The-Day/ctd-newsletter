import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'medium': 'var(--shadow-medium)',
        'strong': 'var(--shadow-strong)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "cicada-pulse": {
          "0%, 100%": { opacity: "0.2", transform: "translateY(0) scale(1)" },
          "50%": { opacity: "0.6", transform: "translateY(-5px) scale(1.1)" },
        },
        "wave-drift": {
          "0%": { transform: "translateX(-20px) translateY(0px)", opacity: "0.3" },
          "50%": { transform: "translateX(10px) translateY(30px)", opacity: "0.6" },
          "100%": { transform: "translateX(-10px) translateY(60px)", opacity: "0.2" },
        },
        "olive-drift": {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.7" },
          "100%": { transform: "translateY(100vh) rotate(180deg)", opacity: "0.5" },
        },
        "wildflower-dance": {
          "0%, 100%": { transform: "translateX(0px) translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateX(10px) translateY(20px) rotate(5deg)" },
          "50%": { transform: "translateX(-5px) translateY(40px) rotate(-3deg)" },
          "75%": { transform: "translateX(8px) translateY(60px) rotate(4deg)" },
        },
        "slide-train": {
          "0%": { transform: "translateX(-200%)" },
          "100%": { transform: "translateX(200vw)" },
        },
        "kiss-burst": {
          "0%": { transform: "scale(0) translateY(0)", opacity: "1" },
          "50%": { transform: "scale(1.2) translateY(-20px)", opacity: "0.8" },
          "100%": { transform: "scale(0.8) translateY(-60px)", opacity: "0" },
        },
        "foil-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in": "slide-in 0.5s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        "cicada-pulse": "cicada-pulse 3s ease-in-out infinite",
        "wave-drift": "wave-drift 15s ease-in-out infinite",
        "olive-drift": "olive-drift 20s linear infinite",
        "wildflower-dance": "wildflower-dance 12s ease-in-out infinite",
        "slide-train": "slide-train 20s linear infinite",
        "kiss-burst": "kiss-burst 2s ease-out forwards",
        "foil-shimmer": "foil-shimmer 1.5s linear infinite",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
