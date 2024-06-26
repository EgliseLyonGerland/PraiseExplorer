import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import daisyui from "daisyui";
import type { Config as DaisyUIConfig } from "daisyui";
import { retro } from "daisyui/src/theming/themes";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,svg}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Source Sans Pro", ...defaultTheme.fontFamily.sans],
        serif: ["Playfair Display", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...retro,
          "--rounded-btn": "2rem",
          "--rounded-badge": "2rem",
        },
      },
    ],
    // darkTheme: 'night'
  },
} satisfies Config & { daisyui: DaisyUIConfig };
