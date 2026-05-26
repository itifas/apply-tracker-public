"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	BarChart3,
	Bell,
	FileText,
	LogOut,
	Mail,
	LayoutDashboard,
	Settings,
} from "lucide-react";

const navItems = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/applications", label: "Applications", icon: FileText },
	{ href: "/reminders", label: "Reminder Center", icon: Bell },
	{ href: "/integrations/email", label: "Email Integration", icon: Mail },
	{ href: "/analytics", label: "Analytics", icon: BarChart3 },
	{ href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();

	async function handleLogout() {
		await fetch("/api/auth/logout", { method: "POST" });
		router.replace("/login");
		router.refresh();
	}

	return (
		<aside className="w-64 bg-surface/95 backdrop-blur border-r border-border h-screen sticky top-0 flex flex-col shadow-panel relative">
			<div className="absolute inset-y-0 right-0 w-px bg-[linear-gradient(180deg,transparent,var(--canvas-glow-1),transparent)]" />
			<div className="p-6 border-b border-border bg-[linear-gradient(180deg,var(--canvas-glow-1),transparent)]">
				<h1 className="text-xl font-semibold text-textMain">Jobs Tracker</h1>
				<p className="text-xs text-textSoft mt-1">Manage your applications</p>
			</div>

			<nav className="flex-1 p-4 space-y-1">
				{navItems.map((item) => {
					const Icon = item.icon;
					const active = pathname.startsWith(item.href);
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 ${
								active
									? "bg-[linear-gradient(90deg,var(--surfaceAlt),var(--background))] text-primary font-medium shadow-sm ring-1 ring-primary/10"
									: "text-textSoft hover:bg-surfaceAlt hover:text-textMain hover:translate-x-0.5"
							}`}
						>
							<span
								className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
									active
										? "border-transparent bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-white shadow-sm"
										: "border-border bg-[linear-gradient(180deg,var(--surfaceAlt),var(--background))] text-textSoft group-hover:text-textMain"
								}`}
							>
								<Icon size={18} />
							</span>
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t border-border">
				<button
					onClick={handleLogout}
					className="mb-3 flex w-full items-center gap-3 rounded-xl border border-border bg-[linear-gradient(180deg,var(--surface),var(--surfaceAlt))] px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-danger/40 hover:shadow-sm"
					title="Sign out"
				>
					<span className="flex h-9 w-9 items-center justify-center rounded-xl border border-danger/20 bg-[linear-gradient(135deg,var(--danger),var(--accent))] text-white shadow-sm">
						<LogOut size={18} />
					</span>
					<div className="min-w-0">
						<p className="text-sm font-medium text-textMain">Logout</p>
						<p className="text-xs text-textSoft">Sign out of your account</p>
					</div>
				</button>

				<div className="rounded-xl border border-border bg-[linear-gradient(180deg,var(--surfaceAlt),var(--surface))] p-4">
					<p className="text-xs font-semibold text-primary mb-1">Need help?</p>
					<p className="text-xs text-textSoft">
						Check out our guide for tips on tracking applications.
					</p>
				</div>
			</div>
		</aside>
	);
}
