import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import daisyui from 'daisyui'
import type { Config as DaisyUIConfig } from 'daisyui'

const palette = {
  primary: {
    10: '#EAECFB',
    20: '#DCE0F8',
    30: '#B9C0F0',
    40: '#99A1E6',
    50: '#7A82DC',
    60: '#5E61D0',
    70: '#463CC3',
    80: '#352D99',
    90: '#251F70',
    100: '#15114A',
    110: '#080627',
    120: '#010108',
  },
  secondary: {
    10: '#FDFCFA',
    20: '#FCF9F7',
    30: '#F9F4EE',
    40: '#F6EEE6',
    50: '#F3E9DF',
    60: '#B8B1AA',
    70: '#87817C',
    80: '#5D5A56',
    90: '#3D3B39',
    100: '#252423',
    110: '#141413',
    120: '#060606',
  },
}

const baseTheme = {
  'primary': palette.primary[70],
  'primary-content': palette.primary[20],

  'neutral': palette.secondary[90],
  'neutral-content': palette.secondary[10],

  '--rounded-box': '0.4rem',
  '--rounded-btn': '2rem',
  '--rounded-badge': '0.4rem',
  '--tab-radius': '0.4rem',

  // "secondary": "#a4cbb4",
  // "secondary-content": "#282425",
  // "accent": "#DC8850",
  // "accent-content": "#282425",
  // "info": "#2563eb",
  // "success": "#16a34a",
  // "warning": "#d97706",
  // "error": "oklch(65.72% 0.199 27.33)",
}

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,svg}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Sans Pro', ...defaultTheme.fontFamily.sans],
        serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      },
    },
    colors: palette,
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...baseTheme,

          'color-scheme': 'light',

          'base-100': palette.secondary[10],
          'base-200': palette.secondary[50],
          'base-300': palette.secondary[60],
          'base-content': palette.secondary[110],
        },
        dark: {
          ...baseTheme,

          'color-scheme': 'dark',

          'base-100': palette.secondary[110],
          'base-200': palette.secondary[100],
          'base-300': palette.secondary[90],
          'base-content': palette.secondary[20],
        },
      },
    ],
    darkTheme: 'dark',
  },
} satisfies Config & { daisyui: DaisyUIConfig }
