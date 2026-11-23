// Demo mode builds a static site where all data lives in the visitor's browser.
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// The Windows app reuses the demo build, but starts empty and hides the
// demo banner because it holds the user's real data.
export const isDesktop = process.env.NEXT_PUBLIC_DESKTOP === "true";

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Link to an application's detail page. Static hosting can't serve dynamic
// /applications/[id] routes, so the demo uses a query parameter instead.
export function applicationHref(id: string) {
	return isDemoMode
		? `/applications/view?id=${encodeURIComponent(id)}`
		: `/applications/${id}`;
}
