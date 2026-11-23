import Link from "next/link";
import type { ReactNode } from "react";

// Shared layout for the privacy and terms pages. Works without signing in.
export function LegalPage({
	title,
	updated,
	children,
}: {
	title: string;
	updated: string;
	children: ReactNode;
}) {
	return (
		<div className="min-h-screen bg-background text-textMain">
			<header className="border-b border-border bg-surface">
				<div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
					<Link href="/dashboard" className="font-extrabold">
						Apply Tracker
					</Link>
					<nav className="flex gap-5 text-sm">
						<Link href="/privacy" className="text-textSoft hover:text-textMain">
							Privacy
						</Link>
						<Link href="/terms" className="text-textSoft hover:text-textMain">
							Terms
						</Link>
					</nav>
				</div>
			</header>
			<main className="mx-auto max-w-3xl px-6 py-12">
				<h1 className="text-[36px] font-extrabold leading-tight tracking-[-0.02em]">
					{title}
				</h1>
				<p className="mt-2 text-sm text-textSoft">Last updated {updated}</p>
				<div className="legal-prose mt-10 max-w-[68ch]">{children}</div>
			</main>
		</div>
	);
}
