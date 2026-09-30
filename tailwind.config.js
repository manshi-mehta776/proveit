/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0C10",
          panel: "#141519",
          raised: "#1B1D22",
          line: "rgba(255,255,255,0.08)",
        },
        paper: {
          DEFAULT: "#EDEDEF",
          dim: "#9CA0AA",
          faint: "#5B5F68",
        },
        gold: {
          DEFAULT: "#C9A24B",
          light: "#DBBD73",
          dim: "#8A7238",
        },
        signal: {
          ok: "#5FA97C",
          err: "#C1594B",
        },
      },
      fontFamily: {
        display: ["Spectral", "serif"],
        body: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        plate: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 60px -30px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
