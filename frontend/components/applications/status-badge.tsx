import { FinalStatus, StepStatus } from "@prisma/client";

const colorMap: Record<string, string> = {
	// Final Status colors
	Applied: "bg-surfaceAlt text-textSoft border-border",
	Interviewing: "bg-surfaceAlt text-[var(--line-interview)] border-border",
	Rejected: "bg-surfaceAlt text-[var(--line-rejected)] border-border",
	OFFER: "bg-surfaceAlt text-[var(--line-offer)] border-border",
	Ghosted: "bg-surfaceAlt text-[var(--line-ghosted)] border-border",
	// Step Status colors
	Pending: "bg-surfaceAlt text-textSoft border-border",
	Passed: "bg-surfaceAlt text-success border-border",
};

// Plain-language names, matching the dashboard.
const labelMap: Record<string, string> = {
	OFFER: "Offer",
	Ghosted: "No reply",
};

export function StatusBadge({
	status,
	size = "sm",
}: {
	status: StepStatus | FinalStatus;
	size?: "sm" | "md";
}) {
	const sizeClasses =
		size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
	const colorClass =
		colorMap[status] || "bg-surfaceAlt text-textSoft border-border";

	return (
		<span
			className={`inline-flex items-center rounded-full border font-medium ${sizeClasses} ${colorClass}`}
		>
			{labelMap[status] ?? status}
		</span>
	);
}
