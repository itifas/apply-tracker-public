"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const navItems = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/applications", label: "Applications" },
	{ href: "/reminders", label: "Follow-ups" },
	{ href: "/analytics", label: "Analytics" },
	{ href: "/integrations/email", label: "Email" },
	{ href: "/settings", label: "Settings" },
];

// The navigation is drawn as a line with stations; the current page is the
// station you're at.
export function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();

	async function handleLogout() {
		await fetch("/api/auth/logout", { method: "POST" });
		router.replace("/login");
		router.refresh();
	}

	return (
		<aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface">
			<Link
				href="/dashboard"
				className="flex items-center gap-3 px-6 pb-8 pt-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
			>
				<RouteMark />
				<span className="text-[19px] font-extrabold leading-none tracking-[-0.01em] text-textMain">
					Apply Tracker
				</span>
			</Link>

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
