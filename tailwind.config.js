/** @type {import('tailwindcss').Config} */

// Durum renkleri (kırmızı/kehribar/yeşil…) temaya göre değişir: koyu temada
// Tailwind'in açık tonları, açık temada aynı sınıflar okunur koyu tonlara
// eşlenir. Değerler index.css'te --t-<renk>-<ton> değişkenlerinde.
const TONLAR = ["red", "amber", "emerald", "lime", "orange", "purple", "rose", "violet", "yellow"];
const KADEMELER = [200, 300, 400, 500, 950];
const tonRenkleri = Object.fromEntries(
  TONLAR.map((t) => [t, Object.fromEntries(KADEMELER.map((k) => [k, `rgb(var(--t-${t}-${k}) / <alpha-value>)`]))])
);

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ...tonRenkleri,
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", border: "hsl(var(--card-border))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        ink: "hsl(var(--ink))",
      },
      borderRadius: {
        none: "0", sm: "2px", DEFAULT: "3px", md: "4px", lg: "5px", xl: "6px", "2xl": "7px", "3xl": "8px",
      },
      fontFamily: {
        display: ["'IBM Plex Sans Variable'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "Menlo", "monospace"],
        sans: ["'IBM Plex Sans Variable'", "system-ui", "'Segoe UI'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
