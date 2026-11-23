import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { DemoBanner } from "@/components/demo/demo-mode";

export function AppShell({ children }: { children: React.ReactNode }) {
	const year = new Date().getFullYear();

	return (
		<div className="flex min-h-screen overflow-x-hidden bg-background text-textMain">
			<Sidebar />
			<div className="flex min-w-0 flex-1 flex-col">
				<DemoBanner />
				<Topbar />
				<main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
					<div className="p-4 sm:p-6 lg:p-10">{children}</div>
				</main>
				<footer className="border-t border-border px-10 py-4 text-xs text-textSoft">
					{`© ${year} Iakovos Tifas. Apply Tracker is open source under the MIT License.`}
				</footer>
			</div>
		</div>
	);
}
