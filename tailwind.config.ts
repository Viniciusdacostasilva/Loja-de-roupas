import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "background-black": "#1C1C1C",
        "light-black": "#393939",
        "white-buttons": "#F8F7F7",
        "light-black-200": "2A2A2A",
        "link-gray": "#818181",
      },

      screens: {
        'sm': '350px',
        'md': '600px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      }
    }

    },
  plugins: [],
} satisfies Config;
