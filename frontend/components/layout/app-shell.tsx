"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { DemoBanner } from "@/components/demo/demo-mode";

export function AppShell({ children }: { children: React.ReactNode }) {
	const year = new Date().getFullYear();
	const [menuOpen, setMenuOpen] = useState(false);
	const closeMenu = useCallback(() => setMenuOpen(false), []);

	return (
		// overflow-x-clip (not hidden) so the sticky sidebar stays in view.
		<div className="flex min-h-screen overflow-x-clip bg-background text-textMain">
			<Sidebar open={menuOpen} onClose={closeMenu} />
			<div className="flex min-w-0 flex-1 flex-col">
				<DemoBanner />
				<Topbar menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
				<main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
					<div className="p-4 sm:p-6 lg:p-10">{children}</div>
				</main>
				<footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-4 text-xs text-textSoft sm:px-10">
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
