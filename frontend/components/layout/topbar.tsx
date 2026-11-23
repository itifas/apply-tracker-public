"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useComingSoon } from "@/components/feedback/in-progress";
import { Bell, Search, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

type CurrentUser = {
	username: string;
	email: string | null;
	fullName: string | null;
};

export function Topbar() {
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
		<header className="bg-surface/92 backdrop-blur border-b border-border px-8 py-4 sticky top-0 z-10 shadow-[0_1px_0_var(--border)]">
			<div className="flex items-center justify-between">
				<div className="flex-1 max-w-xl">
					<form className="relative" role="search" onSubmit={handleSearch}>
						<Search
							className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md bg-[linear-gradient(135deg,var(--surfaceAlt),var(--background))] p-1 text-textSoft"
							size={20}
						/>
						<input
							type="text"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search applications..."
							aria-label="Search applications"
							className="w-full rounded-lg border border-border bg-[linear-gradient(180deg,var(--surface),var(--background))] pl-10 pr-4 py-2 text-textMain placeholder:text-textSoft shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</form>
				</div>

				<div className="flex items-center gap-4 ml-4">
					<button
						onClick={() =>
							setTheme(resolvedTheme === "dark" ? "light" : "dark")
						}
						className="rounded-xl border border-border bg-[linear-gradient(180deg,var(--surface),var(--surfaceAlt))] p-2 transition-all hover:-translate-y-0.5 hover:shadow-sm"
						title={
							mounted
								? `Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`
								: "Toggle theme"
						}
					>
						{mounted ? (
							resolvedTheme === "dark" ? (
								<Moon size={20} className="text-textSoft" />
							) : (
								<Sun size={20} className="text-textSoft" />
							)
						) : (
							<span className="block h-5 w-5" aria-hidden="true" />
						)}
					</button>

					<button
						onClick={comingSoon("Notifications")}
						title="Notifications (coming soon)"
						className="rounded-xl border border-border bg-[linear-gradient(180deg,var(--surface),var(--surfaceAlt))] p-2 transition-all hover:-translate-y-0.5 hover:shadow-sm relative"
					>
						<Bell size={20} className="text-textSoft" />
					</button>

					<div className="flex items-center gap-3 pl-4 border-l border-border">
						<div className="text-right">
							<p className="text-sm font-medium text-textMain">{displayName}</p>
							<p className="text-xs text-textSoft">{displayDetail}</p>
						</div>
						<div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[linear-gradient(135deg,var(--primary),var(--secondary),var(--accent))] text-white shadow-sm">
							<User size={18} />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
