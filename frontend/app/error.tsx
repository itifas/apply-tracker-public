"use client";

import { AppShell } from "@/components/layout/app-shell";

export default function Error({ reset }: { error: Error; reset: () => void }) {
	return (
		<AppShell>
			<div className="mx-auto mt-20 max-w-xl rounded-2xl border border-border bg-surface p-8 text-center shadow-panel">
				<h2 className="text-2xl font-semibold text-textMain">
					Something went wrong
				</h2>
				<p className="mt-2 text-sm text-textSoft">
					The page failed to load. Try again.
				</p>
				<button
					className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primaryHover"
					onClick={reset}
				>
					Retry
				</button>
			</div>
		</AppShell>
	);
}
