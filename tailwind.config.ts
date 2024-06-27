import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import daisyui from 'daisyui'
import type { Config as DaisyUIConfig } from 'daisyui'
import { dim, retro } from 'daisyui/src/theming/themes'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,svg}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Sans Pro', ...defaultTheme.fontFamily.sans],
        serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...retro,
          'primary': 'oklch(50% 0.131 278.93)',
          'primary-content': 'oklch(90% 0.131 278.93)',
          '--rounded-btn': '2rem',
          '--rounded-badge': '2rem',
        },
        dark: {
          ...dim,
          'primary': 'oklch(50% 0.131 278.93)',
          'primary-content': 'oklch(90% 0.131 278.93)',
          '--rounded-btn': '2rem',
          '--rounded-badge': '2rem',
        },
      },
    ],
    // @ts-expect-error Type 'boolean' is not assignable to type 'string'
    darkTheme: false,
  },
} satisfies Config & { daisyui: DaisyUIConfig }
