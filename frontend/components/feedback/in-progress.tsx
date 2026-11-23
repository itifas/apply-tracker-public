"use client";

import { Construction } from "lucide-react";
import type { ReactNode } from "react";
import { useToast } from "@/components/feedback/toast";

// Banner for pages or sections that are still being built.
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
			className="mb-6 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-textMain"
		>
			<Construction className="mt-0.5 shrink-0 text-amber-600" size={18} />
			<div>
				<p className="font-semibold">{title}</p>
				{children && <p className="mt-1 text-textSoft">{children}</p>}
			</div>
		</div>
	);
}

// Small label for a heading whose feature isn't finished.
export function InProgressBadge() {
	return (
		<span className="ml-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 align-middle text-[11px] font-medium text-amber-700 dark:text-amber-300">
			<Construction size={11} />
			In progress
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
