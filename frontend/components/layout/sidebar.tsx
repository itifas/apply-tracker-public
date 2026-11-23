"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";

const navItems = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/applications", label: "Applications" },
	{ href: "/reminders", label: "Follow-ups" },
	{ href: "/analytics", label: "Analytics" },
	{ href: "/integrations/email", label: "Email" },
	{ href: "/settings", label: "Settings" },
];

// True on screens where the sidebar is a slide-out drawer (below lg).
function useIsDrawer() {
	const [isDrawer, setIsDrawer] = useState(false);

	useEffect(() => {
		const query = window.matchMedia("(max-width: 1023.98px)");
		const update = () => setIsDrawer(query.matches);
		update();
		query.addEventListener("change", update);
		return () => query.removeEventListener("change", update);
	}, []);

	return isDrawer;
}

// The navigation is drawn as a line with stations; the current page is the
// station you're at. Below lg it becomes a drawer opened from the top bar.
export function Sidebar({
	open = false,
	onClose,
}: {
	open?: boolean;
	onClose?: () => void;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const isDrawer = useIsDrawer();
	const panelRef = useRef<HTMLElement>(null);
	const hidden = isDrawer && !open;

	// A closed drawer can't be tabbed into or read out.
	useEffect(() => {
		if (panelRef.current) {
			panelRef.current.inert = hidden;
		}
	}, [hidden]);

	// Close when the page changes.
	useEffect(() => {
		onClose?.();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	// While open as a drawer: Escape closes, focus moves in and returns to the
	// menu button afterwards, and the page behind doesn't scroll.
	useEffect(() => {
		if (!isDrawer || !open) {
			return;
		}

		const opener = document.activeElement as HTMLElement | null;
		const panel = panelRef.current;
		(
			panel?.querySelector<HTMLElement>("a[aria-current]") ??
			panel?.querySelector<HTMLElement>("nav a")
		)?.focus();
		const { overflow } = document.body.style;
		document.body.style.overflow = "hidden";

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				onClose?.();
			}
		}
		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = overflow;
			opener?.focus();
		};
	}, [isDrawer, open, onClose]);

	async function handleLogout() {
		await fetch("/api/auth/logout", { method: "POST" });
		router.replace("/login");
		router.refresh();
	}

	return (
		<>
			<div
				aria-hidden="true"
				data-open={open}
				onClick={onClose}
				className="nav-backdrop fixed inset-0 z-40 bg-[#0b1118]/50 lg:hidden"
			/>
			<aside
				id="app-sidebar"
				ref={panelRef}
				data-open={open}
				aria-label="Navigation"
				aria-hidden={hidden || undefined}
				{...(isDrawer && open ? { role: "dialog", "aria-modal": true } : {})}
				className="nav-drawer fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-72 max-w-[85vw] shrink-0 flex-col border-r border-border bg-surface lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-60 lg:self-start"
			>
			<div className="flex items-center justify-between gap-3 pb-8 pr-3 pt-7">
				<Link
					href="/dashboard"
					className="flex items-center gap-3 pl-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
				>
					<RouteMark />
					<span className="text-[19px] font-extrabold leading-none tracking-[-0.01em] text-textMain">
						Apply Tracker
					</span>
				</Link>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close menu"
					className="rounded-md p-2 text-textSoft transition-[background-color,color,transform] duration-150 ease-out hover:bg-surfaceAlt hover:text-textMain active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
				>
					<X size={18} />
				</button>
			</div>

			<nav aria-label="Main" className="relative flex-1 px-6">
				<span
					aria-hidden="true"
					className="absolute bottom-3 left-[29px] top-3 w-[2px] rounded-full bg-border"
				/>
				<ul className="space-y-1">
					{navItems.map((item) => {
						const active = pathname.startsWith(item.href);
						return (
							<li key={item.href}>
								<Link
									href={item.href}
									aria-current={active ? "page" : undefined}
									className={`group relative flex items-center gap-4 rounded-md py-2 pl-0 pr-2 text-[15px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary ${
										active
											? "font-bold text-textMain"
											: "text-textSoft hover:text-textMain"
									}`}
								>
									<span
										aria-hidden="true"
										className={`relative z-10 block shrink-0 rounded-full border-2 transition-colors duration-150 ${
											active
												? "-ml-[1px] h-3.5 w-3.5 border-primary bg-primary"
												: "ml-[1px] h-2.5 w-2.5 border-textSoft/60 bg-surface group-hover:border-textMain"
										}`}
									/>
									{item.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			<div className="border-t border-border px-6 py-4">
				<button
					onClick={handleLogout}
					className="flex items-center gap-2 rounded-md py-1 text-sm text-textSoft outline-none transition-[color,transform] duration-150 ease-out hover:text-danger active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary"
				>
					<LogOut size={16} />
					Sign out
				</button>
			</div>
			</aside>
		</>
	);
}

function RouteMark() {
	return (
		<svg
			width="26"
			height="26"
			viewBox="0 0 26 26"
			aria-hidden="true"
			className="shrink-0"
		>
			<path
				d="M5 20 L11 20 L17 6 L21 6"
				fill="none"
				stroke="var(--primary)"
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle cx="5" cy="20" r="3.2" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2.4" />
			<circle cx="21" cy="6" r="3.6" fill="var(--secondary)" />
		</svg>
	);
}
