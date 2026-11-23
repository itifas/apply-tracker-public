"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useComingSoon } from "@/components/feedback/in-progress";
import { Bell, Menu, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

type CurrentUser = {
	username: string;
	email: string | null;
	fullName: string | null;
};

export function Topbar({
	menuOpen = false,
	onOpenMenu,
}: {
	menuOpen?: boolean;
	onOpenMenu?: () => void;
}) {
	const { resolvedTheme, setTheme } = useTheme();
	const [user, setUser] = useState<CurrentUser | null>(null);
	const [mounted, setMounted] = useState(false);
	const [search, setSearch] = useState("");
	const router = useRouter();
	const comingSoon = useComingSoon();

	function handleSearch(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = search.trim();
		router.push(
			query ? `/applications?q=${encodeURIComponent(query)}` : "/applications",
		);
	}

	useEffect(() => {
		setMounted(true);

		fetch("/api/auth/me")
			.then((response) => (response.ok ? response.json() : null))
			.then((body) => setUser(body?.user ?? null))
			.catch(() => setUser(null));
	}, []);

	const displayName = user?.fullName || user?.username || "Account";
	const displayDetail = user?.email || user?.username || "Signed in";

	return (
		<header className="sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-8">
			<div className="flex items-center justify-between gap-2">
				<button
					type="button"
					onClick={onOpenMenu}
					aria-label="Open menu"
					aria-expanded={menuOpen}
					aria-controls="app-sidebar"
					className="-ml-1 rounded-md p-2 text-textMain transition-[background-color,transform] duration-150 ease-out hover:bg-surface active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
				>
					<Menu size={20} />
				</button>
				<div className="min-w-0 max-w-xl flex-1">
					<form className="relative" role="search" onSubmit={handleSearch}>
						<Search
							className="absolute left-3 top-1/2 -translate-y-1/2 text-textSoft"
							size={17}
						/>
						<input
							type="text"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search applications..."
							aria-label="Search applications"
							className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-4 text-sm text-textMain placeholder:text-textSoft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
						/>
					</form>
				</div>

				<div className="flex items-center gap-1 sm:ml-4 sm:gap-2">
					<button
						onClick={() =>
							setTheme(resolvedTheme === "dark" ? "light" : "dark")
						}
						className="rounded-md p-2 text-textSoft transition-[background-color,color,transform] duration-150 ease-out hover:bg-surface hover:text-textMain active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						title={
							mounted
								? `Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`
								: "Toggle theme"
						}
						aria-label="Toggle dark mode"
					>
						{mounted ? (
							resolvedTheme === "dark" ? (
								<Moon size={18} />
							) : (
								<Sun size={18} />
							)
						) : (
							<span className="block h-[18px] w-[18px]" aria-hidden="true" />
						)}
					</button>

					<button
						onClick={comingSoon("Notifications")}
						title="Notifications (coming soon)"
						aria-label="Notifications (coming soon)"
						className="rounded-md p-2 text-textSoft transition-[background-color,color,transform] duration-150 ease-out hover:bg-surface hover:text-textMain active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary relative"
					>
						<Bell size={18} />
					</button>

					<div className="ml-1 flex items-center gap-3 border-l border-border pl-3 sm:ml-2 sm:pl-4">
						<div className="hidden text-right sm:block">
							<p className="text-sm font-medium text-textMain">{displayName}</p>
							<p className="text-xs text-textSoft">{displayDetail}</p>
						</div>
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-textMain text-sm font-bold text-surface">
							{displayName.charAt(0).toUpperCase()}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
