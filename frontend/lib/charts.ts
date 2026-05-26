export const CHART_GRID_PROPS = {
	stroke: "var(--border)",
	strokeDasharray: "4 4",
	strokeOpacity: 0.72,
} as const;

export const CHART_AXIS_PROPS = {
	axisLine: { stroke: "var(--border)" },
	tickLine: { stroke: "var(--border)" },
	tick: { fill: "var(--text-soft)" },
} as const;

export const CHART_TOOLTIP_STYLE = {
	backgroundColor: "var(--surface)",
	border: "1px solid var(--border)",
	borderRadius: "12px",
	boxShadow: "0 20px 45px -28px rgba(15, 23, 42, 0.28)",
	backdropFilter: "blur(14px)",
	color: "var(--text-main)",
} as const;
