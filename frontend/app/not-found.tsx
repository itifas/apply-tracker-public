import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
			<div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-panel">
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
					<Compass size={24} />
				</div>
				<p className="text-sm font-semibold text-primary">404</p>
				<h1 className="mt-1 text-xl font-semibold text-textMain">
					Page not found
				</h1>
				<p className="mt-2 text-sm text-textSoft">
					This page doesn&apos;t exist or has moved. Your applications are
					safe.
				</p>
				<div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
					<Link
						href="/dashboard"
						className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primaryHover"
					>
						Go to dashboard
					</Link>
					<Link
						href="/applications"
						className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-textMain transition-colors hover:bg-surfaceAlt"
					>
						View applications
					</Link>
				</div>
			</div>
		</main>
	);
}
