import Link from "next/link";
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
				<footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-10 py-4 text-xs text-textSoft">
					<span>{`© ${year} Iakovos Tifas. Open source under the MIT License.`}</span>
					<nav aria-label="Legal" className="flex gap-5">
						<Link href="/privacy" className="hover:text-textMain">
							Privacy
						</Link>
						<Link href="/terms" className="hover:text-textMain">
							Terms
						</Link>
					</nav>
				</footer>
			</div>
		</div>
	);
}
