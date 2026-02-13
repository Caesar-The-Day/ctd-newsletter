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
          "0%": { 
            opacity: "1",
            transform: "translate(-50%, -50%) scale(0)"
          },
          "30%": { 
            opacity: "1",
            transform: "translate(var(--tx), var(--ty)) scale(1.3)"
          },
          "100%": { 
            opacity: "0",
            transform: "translate(calc(var(--tx) * 1.5), calc(var(--ty) - 80px)) scale(0.6)"
          },
        },
        "foil-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "card-unwrap": {
          "0%": { transform: "perspective(1000px) rotateY(0deg)", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
          "100%": { transform: "perspective(1000px) rotateY(-5deg)", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.15)" },
        },
        "svg-float": {
          "0%, 100%": { transform: "translateY(-8px)" },
          "50%": { transform: "translateY(0px)" },
        },
        "svg-sway": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "svg-breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
        "svg-bounce-note": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "svg-rise-fade": {
          "0%": { transform: "translateY(0)", opacity: "0.6" },
          "100%": { transform: "translateY(-12px)", opacity: "0" },
        },
        "svg-knight-hop": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(8px)" },
        },
        "svg-wine-pour": {
          "0%": { clipPath: "inset(100% 0 0 0)" },
          "100%": { clipPath: "inset(0% 0 0 0)" },
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
        "kiss-burst": "kiss-burst 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "foil-shimmer": "foil-shimmer 1.5s linear infinite",
        "card-unwrap": "card-unwrap 0.3s ease-out forwards",
        "svg-float": "svg-float 6s ease-in-out infinite",
        "svg-sway": "svg-sway 8s ease-in-out infinite",
        "svg-breathe": "svg-breathe 4s ease-in-out infinite",
        "svg-bounce-note": "svg-bounce-note 1.2s ease-in-out infinite",
        "svg-rise-fade": "svg-rise-fade 2s ease-out infinite",
        "svg-knight-hop": "svg-knight-hop 3s ease-in-out infinite",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
