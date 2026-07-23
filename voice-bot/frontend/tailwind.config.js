/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Orbitron'", "monospace"],
        body: ["'Syne'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      colors: {
        void: "#020408",
        panel: "#060d18",
        surface: "#0a1628",
        "neon-cyan": "#00f5ff",
        "neon-blue": "#0066ff",
        "neon-purple": "#7b2fff",
        "neon-green": "#00ff88",
        "neon-red": "#ff2d55",
        "glass-white": "rgba(255,255,255,0.04)",
        "glass-border": "rgba(0,245,255,0.15)",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0,245,255,0.4), 0 0 60px rgba(0,245,255,0.1)",
        "neon-blue": "0 0 20px rgba(0,102,255,0.4), 0 0 60px rgba(0,102,255,0.1)",
        "neon-purple": "0 0 20px rgba(123,47,255,0.4), 0 0 60px rgba(123,47,255,0.1)",
        "neon-green": "0 0 20px rgba(0,255,136,0.4), 0 0 60px rgba(0,255,136,0.1)",
        "neon-red": "0 0 20px rgba(255,45,85,0.4)",
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)",
        "hero-gradient": "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,102,255,0.25) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(123,47,255,0.15) 0%, transparent 60%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      },
      backgroundSize: {
        grid: "60px 60px",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "sound-wave": "soundWave 1.2s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "typewriter": "typewriter 3s steps(40) 1s forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6", boxShadow: "0 0 20px rgba(0,245,255,0.3)" },
          "50%": { opacity: "1", boxShadow: "0 0 40px rgba(0,245,255,0.7), 0 0 80px rgba(0,245,255,0.3)" },
        },
        soundWave: {
          "0%, 100%": { scaleY: "0.3" },
          "50%": { scaleY: "1" },
        },
        scan: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
      },
    },
  },
  plugins: [],
};
