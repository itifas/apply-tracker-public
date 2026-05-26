import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
	const year = new Date().getFullYear();

	return (
		<div className="relative flex min-h-screen overflow-x-hidden bg-background text-textMain">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--canvas-glow-1),transparent_35%),radial-gradient(circle_at_top_right,var(--canvas-glow-2),transparent_28%),radial-gradient(circle_at_bottom,var(--canvas-glow-3),transparent_25%)]" />
			<Sidebar />
			<div className="relative z-10 flex min-w-0 flex-1 flex-col">
				<Topbar />
				<main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
					<div className="p-4 sm:p-6 lg:p-8">{children}</div>
				</main>
				<footer className="border-t border-border px-8 py-3 text-xs text-textSoft bg-surface/90 backdrop-blur">
					{`© ${year} Jobs Tracker. All rights reserved by me. This project is open source.`}
				</footer>
			</div>
		</div>
	);
}
