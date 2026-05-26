import { FinalStatus, StepStatus } from "@prisma/client";

const colorMap: Record<string, string> = {
	// Final Status colors
	Applied: "bg-surfaceAlt text-info border-border",
	Interviewing: "bg-surfaceAlt text-secondary border-border",
	Rejected: "bg-surfaceAlt text-danger border-border",
	OFFER: "bg-surfaceAlt text-accent border-border",
	Ghosted: "bg-surfaceAlt text-highlight border-border",
	// Step Status colors
	Pending: "bg-surfaceAlt text-textSoft border-border",
	Passed: "bg-surfaceAlt text-success border-border",
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
			{status}
		</span>
	);
}
