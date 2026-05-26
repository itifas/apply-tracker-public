export const PALETTE_STORAGE_KEY = "apply-tracker.palette";

export type PaletteId =
	| "indigo-aurora"
	| "ocean-teal"
	| "sunset-amber"
	| "forest-emerald"
	| "cyber-violet"
	| "minimal-slate";

export type PaletteMode = "light" | "dark";

export type PaletteVariables = Record<
	| "background"
	| "surface"
	| "surfaceAlt"
	| "card"
	| "primary"
	| "primaryHover"
	| "secondary"
	| "accent"
	| "highlight"
	| "textMain"
	| "textSoft"
	| "border"
	| "success"
	| "danger"
	| "warning"
	| "info",
	string
>;

export type ThemePalette = {
	id: PaletteId;
	name: string;
	description: string;
	swatches: [string, string, string, string];
	light: PaletteVariables;
	dark: PaletteVariables;
};

export const defaultPaletteId: PaletteId = "indigo-aurora";

export const themePalettes: ThemePalette[] = [
	{
		id: "indigo-aurora",
		name: "Indigo Aurora",
		description: "A balanced indigo foundation with teal and amber highlights.",
		swatches: ["#4f46e5", "#14b8a6", "#f59e0b", "#a855f7"],
		light: {
			background: "#f4f7ff",
			surface: "#fcfdff",
			surfaceAlt: "#eef2ff",
			card: "#ffffff",
			primary: "#4f46e5",
			primaryHover: "#4338ca",
			secondary: "#14b8a6",
			accent: "#f59e0b",
			highlight: "#a855f7",
			textMain: "#111827",
			textSoft: "#5b6473",
			border: "#d9dff0",
			success: "#16a34a",
			danger: "#dc2626",
			warning: "#d97706",
			info: "#2563eb",
		},
		dark: {
			background: "#09111f",
			surface: "#101a33",
			surfaceAlt: "#16213c",
			card: "#131f3d",
			primary: "#818cf8",
			primaryHover: "#6366f1",
			secondary: "#2dd4bf",
			accent: "#fbbf24",
			highlight: "#c084fc",
			textMain: "#f8fafc",
			textSoft: "#9aa9c8",
			border: "#2f4063",
			success: "#4ade80",
			danger: "#f87171",
			warning: "#fbbf24",
			info: "#60a5fa",
		},
	},
	{
		id: "ocean-teal",
		name: "Ocean Teal",
		description:
			"Cool teal tones with deep navy contrast and calm blue accents.",
		swatches: ["#0f766e", "#06b6d4", "#2563eb", "#14b8a6"],
		light: {
			background: "#f1fbfc",
			surface: "#fbfeff",
			surfaceAlt: "#e6f8fb",
			card: "#ffffff",
			primary: "#0f766e",
			primaryHover: "#115e59",
			secondary: "#06b6d4",
			accent: "#2563eb",
			highlight: "#14b8a6",
			textMain: "#102a2f",
			textSoft: "#56737a",
			border: "#c7e8ee",
			success: "#0f9d58",
			danger: "#dc2626",
			warning: "#d97706",
			info: "#0284c7",
		},
		dark: {
			background: "#08131a",
			surface: "#0e1d26",
			surfaceAlt: "#132935",
			card: "#10212b",
			primary: "#5eead4",
			primaryHover: "#2dd4bf",
			secondary: "#22d3ee",
			accent: "#38bdf8",
			highlight: "#67e8f9",
			textMain: "#effafc",
			textSoft: "#93b7c0",
			border: "#23424d",
			success: "#34d399",
			danger: "#f87171",
			warning: "#fbbf24",
			info: "#38bdf8",
		},
	},
	{
		id: "sunset-amber",
		name: "Sunset Amber",
		description:
			"Warm amber light with coral and rose accents for a brighter canvas.",
		swatches: ["#c2410c", "#f59e0b", "#fb7185", "#f97316"],
		light: {
			background: "#fff8f1",
			surface: "#fffdf9",
			surfaceAlt: "#fff0e3",
			card: "#ffffff",
			primary: "#c2410c",
			primaryHover: "#9a3412",
			secondary: "#f59e0b",
			accent: "#fb7185",
			highlight: "#f97316",
			textMain: "#2b1b15",
			textSoft: "#7c5a4f",
			border: "#f2d9c4",
			success: "#16a34a",
			danger: "#dc2626",
			warning: "#d97706",
			info: "#ea580c",
		},
		dark: {
			background: "#1a0f0b",
			surface: "#28150f",
			surfaceAlt: "#382017",
			card: "#2d1912",
			primary: "#fb923c",
			primaryHover: "#f97316",
			secondary: "#fbbf24",
			accent: "#fb7185",
			highlight: "#fdba74",
			textMain: "#fff6ee",
			textSoft: "#d6b9aa",
			border: "#5a3728",
			success: "#4ade80",
			danger: "#f87171",
			warning: "#fbbf24",
			info: "#fdba74",
		},
	},
	{
		id: "forest-emerald",
		name: "Forest Emerald",
		description: "Grounded greens with pine shadows and mossy highlight tones.",
		swatches: ["#166534", "#10b981", "#84cc16", "#22c55e"],
		light: {
			background: "#f4fbf4",
			surface: "#fcfefb",
			surfaceAlt: "#e8f5ea",
			card: "#ffffff",
			primary: "#166534",
			primaryHover: "#14532d",
			secondary: "#10b981",
			accent: "#84cc16",
			highlight: "#22c55e",
			textMain: "#13241a",
			textSoft: "#547163",
			border: "#d2e7d6",
			success: "#16a34a",
			danger: "#dc2626",
			warning: "#ca8a04",
			info: "#0ea5e9",
		},
		dark: {
			background: "#07140d",
			surface: "#0f1d15",
			surfaceAlt: "#14261c",
			card: "#13231a",
			primary: "#4ade80",
			primaryHover: "#22c55e",
			secondary: "#34d399",
			accent: "#a3e635",
			highlight: "#86efac",
			textMain: "#eefbf3",
			textSoft: "#9bc1ab",
			border: "#254231",
			success: "#86efac",
			warning: "#fde047",
			danger: "#f87171",
			info: "#67e8f9",
		},
	},
	{
		id: "cyber-violet",
		name: "Cyber Violet",
		description: "Electric violet energy with neon blue and magenta accents.",
		swatches: ["#6d28d9", "#8b5cf6", "#ec4899", "#22d3ee"],
		light: {
			background: "#f8f5ff",
			surface: "#fdfcff",
			surfaceAlt: "#efe8ff",
			card: "#ffffff",
			primary: "#6d28d9",
			primaryHover: "#5b21b6",
			secondary: "#8b5cf6",
			accent: "#ec4899",
			highlight: "#22d3ee",
			textMain: "#1d1730",
			textSoft: "#665a82",
			border: "#dbd3f2",
			success: "#16a34a",
			danger: "#dc2626",
			warning: "#d97706",
			info: "#2563eb",
		},
		dark: {
			background: "#090816",
			surface: "#111024",
			surfaceAlt: "#181433",
			card: "#15122b",
			primary: "#a78bfa",
			primaryHover: "#8b5cf6",
			secondary: "#22d3ee",
			accent: "#f472b6",
			highlight: "#60a5fa",
			textMain: "#f8f7ff",
			textSoft: "#a4a0c6",
			border: "#2a2652",
			success: "#4ade80",
			danger: "#f87171",
			warning: "#fbbf24",
			info: "#38bdf8",
		},
	},
	{
		id: "minimal-slate",
		name: "Minimal Slate",
		description: "Quiet, neutral slate tones with restrained accent color.",
		swatches: ["#334155", "#64748b", "#94a3b8", "#0f766e"],
		light: {
			background: "#f5f7fa",
			surface: "#fcfdff",
			surfaceAlt: "#eef2f7",
			card: "#ffffff",
			primary: "#334155",
			primaryHover: "#1e293b",
			secondary: "#64748b",
			accent: "#0f766e",
			highlight: "#94a3b8",
			textMain: "#101828",
			textSoft: "#5f6b7a",
			border: "#d5dbe4",
			success: "#15803d",
			warning: "#b45309",
			danger: "#b91c1c",
			info: "#2563eb",
		},
		dark: {
			background: "#0a0f17",
			surface: "#111827",
			surfaceAlt: "#1f2937",
			card: "#172033",
			primary: "#cbd5e1",
			primaryHover: "#94a3b8",
			secondary: "#94a3b8",
			accent: "#5eead4",
			highlight: "#e2e8f0",
			textMain: "#f8fafc",
			textSoft: "#94a3b8",
			border: "#334155",
			success: "#4ade80",
			warning: "#fbbf24",
			danger: "#f87171",
			info: "#60a5fa",
		},
	},
];

export const themePaletteMap = Object.fromEntries(
	themePalettes.map((palette) => [palette.id, palette]),
) as Record<PaletteId, ThemePalette>;

export const paletteIds = themePalettes.map((palette) => palette.id);

export function isPaletteId(
	value: string | null | undefined,
): value is PaletteId {
	return Boolean(value && value in themePaletteMap);
}
