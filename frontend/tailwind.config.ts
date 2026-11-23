import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	// Hover styles only apply on devices that can hover, so taps on touch
	// screens don't leave elements stuck in their hover state.
	future: {
		hoverOnlyWhenSupported: true,
	},
	content: [
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./lib/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				surface: "var(--surface)",
				surfaceAlt: "var(--surface-alt)",
				card: "var(--card)",
				primary: "var(--primary)",
				onPrimary: "var(--on-primary)",
				primaryHover: "var(--primary-hover)",
				secondary: "var(--secondary)",
				accent: "var(--accent)",
				highlight: "var(--highlight)",
				textMain: "var(--text-main)",
				textSoft: "var(--text-soft)",
				border: "var(--border)",
				success: "var(--success)",
				warning: "var(--warning)",
				danger: "var(--danger)",
				info: "var(--info)",
				mutedSurface: "var(--muted-surface)",
			},
			transitionTimingFunction: {
				out: "var(--ease-out)",
				"in-out": "var(--ease-in-out)",
			},
			boxShadow: {
				panel: "0 18px 45px -28px rgba(15, 23, 42, 0.35)",
				glow: "0 20px 50px -32px rgba(79, 70, 229, 0.45)",
			},
		},
	},
	plugins: [],
};

export default config;
