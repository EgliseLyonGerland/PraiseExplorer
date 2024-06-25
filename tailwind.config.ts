import type { Config } from "tailwindcss";
import daisyui, { Config as DaisyUIConfig } from "daisyui";


export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [
		daisyui
	],
	daisyui: {
		themes: ['retro', 'night'],
		darkTheme: 'night'
	}
} satisfies Config & { daisyui: DaisyUIConfig };
