import { type LucideIcon } from "lucide-react";

type IconTone =
	| "primary"
	| "secondary"
	| "accent"
	| "highlight"
	| "success"
	| "warning"
	| "danger"
	| "info";

const ICON_TONE_CLASSES: Record<IconTone, string> = {
	primary:
		"bg-[linear-gradient(135deg,var(--primary),var(--primary-hover))] text-white",
	secondary:
		"bg-[linear-gradient(135deg,var(--secondary),var(--highlight))] text-white",
	accent:
		"bg-[linear-gradient(135deg,var(--accent),var(--secondary))] text-white",
	highlight:
		"bg-[linear-gradient(135deg,var(--highlight),var(--accent))] text-white",
	success:
		"bg-[linear-gradient(135deg,var(--success),var(--secondary))] text-white",
	warning:
		"bg-[linear-gradient(135deg,var(--warning),var(--accent))] text-white",
	danger:
		"bg-[linear-gradient(135deg,var(--danger),var(--highlight))] text-white",
	info: "bg-[linear-gradient(135deg,var(--info),var(--secondary))] text-white",
};

export function KPICard({
	title,
	value,
	icon: Icon,
	trend,
	iconTone = "primary",
}: {
	title: string;
	value: string | number;
	icon?: LucideIcon;
	trend?: string;
	iconTone?: IconTone;
}) {
	return (
		<div className="group relative overflow-hidden rounded-2xl border border-border bg-[linear-gradient(180deg,var(--surface),var(--muted-surface))] p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-panel">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary),var(--secondary),var(--accent),var(--highlight))] opacity-90" />
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1">
					<p className="mb-1 text-sm text-textSoft">{title}</p>
					<p className="text-3xl font-semibold text-textMain">{value}</p>
					{trend && <p className="mt-2 text-xs text-textSoft">{trend}</p>}
				</div>
				{Icon && (
					<div
						className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-border/70 shadow-sm ${ICON_TONE_CLASSES[iconTone]}`}
					>
						<Icon size={22} strokeWidth={2.2} />
					</div>
				)}
			</div>
		</div>
	);
}
