import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f7f1e8",
        ink: "#15221d",
        ember: "#c85b3c",
        olive: "#5e7465",
        gold: "#b18b47",
        mist: "#f5efe4",
      },
      boxShadow: {
        float: "0 24px 60px rgba(32, 42, 35, 0.12)",
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.65), transparent 28%), radial-gradient(circle at 80% 10%, rgba(200,91,60,0.18), transparent 20%), radial-gradient(circle at 50% 80%, rgba(94,116,101,0.18), transparent 26%)",
      },
    },
  },
  plugins: [],
};

export default config;
