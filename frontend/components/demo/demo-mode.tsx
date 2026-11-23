"use client";

import { RotateCcw } from "lucide-react";
import { basePath, isDemoMode, isDesktop } from "@/lib/demo/config";
import { handleDemoRequest } from "@/lib/demo/api";
import { resetDB } from "@/lib/demo/store";

// Route same-origin /api/* requests to the in-browser demo backend. This runs
// when the module loads, before any page component fetches data.
function installDemoFetch() {
	const w = window as Window & { __demoFetchInstalled?: boolean };
	if (w.__demoFetchInstalled) {
		return;
	}
	w.__demoFetchInstalled = true;

	const originalFetch = window.fetch.bind(window);

	window.fetch = async (input, init) => {
		const request = input instanceof Request ? input : null;
		const url = new URL(
			request ? request.url : String(input),
			window.location.origin,
		);
		const path = url.pathname.startsWith(`${basePath}/api/`)
			? url.pathname.slice(basePath.length)
			: url.pathname;

		if (url.origin !== window.location.origin || !path.startsWith("/api/")) {
			return originalFetch(input, init);
		}

		const method = (init?.method ?? request?.method ?? "GET").toUpperCase();
		const rawBody =
			typeof init?.body === "string"
				? init.body
				: request
					? await request.text()
					: "";
		let body: Record<string, unknown> = {};
		try {
			body = rawBody ? JSON.parse(rawBody) : {};
		} catch {
			body = {};
		}

		return handleDemoRequest(method, path, url.searchParams, body);
	};
}

if (isDemoMode && typeof window !== "undefined") {
	installDemoFetch();
}

// Rendered once in the root layout so this module ships in the client bundle.
export function DemoFetchInstaller() {
	return null;
}

export function DemoBanner() {
	if (!isDemoMode || isDesktop) {
		return null;
	}

	function handleReset() {
		resetDB();
		window.location.reload();
	}

	return (
		<aside
			aria-label="Demo notice"
			className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-border bg-surface px-4 py-2 text-center text-[13px] text-textSoft">
			<span>
				This is a demo. Your changes are saved only in this browser.
			</span>
			<button
				type="button"
				onClick={handleReset}
				className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
			>
				<RotateCcw size={12} />
				Reset sample data
			</button>
		</aside>
	);
}
