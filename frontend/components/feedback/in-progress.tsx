"use client";

import { TrafficCone } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { useToast } from "@/components/feedback/toast";

// "Works ahead" tape for features that aren't built yet: yellow and navy
// stripes, like the barrier tape around roadworks on a route.

export function CautionTape({
	label = "Coming soon",
	className = "",
}: {
	label?: string;
	className?: string;
}) {
	return (
		<div className={`caution-tape ${className}`}>
			<span className="caution-tape__label">
				<TrafficCone size={15} aria-hidden="true" />
				{label}
			</span>
		</div>
	);
}

// Stretches the tape across a section that doesn't work yet. The section
// underneath is dimmed and can't be used, so nobody clicks a dead control.
export function ComingSoon({
	label = "Coming soon",
	description,
	showDescription = false,
	align = "center",
	children,
	className = "",
}: {
	label?: string;
	description: string;
	showDescription?: boolean;
	align?: "center" | "top";
	children: ReactNode;
	className?: string;
}) {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current) {
			contentRef.current.inert = true;
		}
	}, []);

	return (
		<div className={`relative isolate overflow-hidden ${className}`}>
			<div
				ref={contentRef}
				className="pointer-events-none select-none opacity-45 saturate-50"
			>
				{children}
			</div>
			<div
				className={`absolute inset-0 z-10 flex flex-col items-center gap-6 ${
					align === "top" ? "justify-start pt-16" : "justify-center"
				}`}
			>
				<CautionTape label={label} className="caution-tape--across" />
				{showDescription && (
					<p className="mx-4 max-w-md rounded-lg border border-border bg-surface px-5 py-4 text-center text-sm text-textMain shadow-panel">
						{description}
					</p>
				)}
			</div>
			{!showDescription && <p className="sr-only">{description}</p>}
		</div>
	);
}

// Page-level notice: a straight strip of tape with a short explanation.
export function InProgressNotice({
	title,
	children,
}: {
	title: string;
	children?: ReactNode;
}) {
	return (
		<div
			role="note"
			className="mb-8 overflow-hidden rounded-lg border border-border bg-surface"
		>
			<CautionTape label={title} className="caution-tape--strip" />
			{children && (
				<p className="px-5 py-4 text-sm text-textSoft">{children}</p>
			)}
		</div>
	);
}

// Small label for a heading whose feature isn't finished.
export function InProgressBadge({ label = "Coming soon" }: { label?: string }) {
	return (
		<span className="caution-badge">
			<TrafficCone size={12} aria-hidden="true" />
			{label}
		</span>
	);
}

// Click handler for buttons whose feature isn't available yet.
export function useComingSoon() {
	const toast = useToast();
	return (feature: string) => () => {
		toast.info(`${feature} is coming soon`, {
			description: "This part of Apply Tracker is still being built.",
		});
	};
}
