"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Loader2, Lock, User } from "lucide-react";

export default function LoginPage() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const response = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

		if (!response.ok) {
			const body = (await response.json().catch(() => null)) as {
				error?: string;
			} | null;
			setError(body?.error ?? "Could not sign in.");
			setIsSubmitting(false);
			return;
		}

		const next = new URLSearchParams(window.location.search).get("next");
		router.replace(next && next.startsWith("/") ? next : "/dashboard");
		router.refresh();
	}

	return (
		<main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-panel">
				<div className="border-b border-border bg-[linear-gradient(180deg,rgba(79,70,229,0.06),transparent)] px-8 py-6">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-glow">
							<BriefcaseBusiness size={22} />
						</div>
						<div>
							<h1 className="text-xl font-semibold text-textMain">
								Jobs Tracker
							</h1>
							<p className="text-sm text-textSoft">Sign in to continue</p>
						</div>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5 px-8 py-7">
					<div className="space-y-2">
						<label
							htmlFor="username"
							className="text-sm font-medium text-textMain"
						>
							Username
						</label>
						<div className="relative">
							<User
								size={18}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-textSoft"
							/>
							<input
								id="username"
								name="username"
								type="text"
								autoComplete="username"
								value={username}
								onChange={(event) => setUsername(event.target.value)}
								className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="password"
							className="text-sm font-medium text-textMain"
						>
							Password
						</label>
						<div className="relative">
							<Lock
								size={18}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-textSoft"
							/>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
								required
							/>
						</div>
					</div>

					{error ? (
						<p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
							{error}
						</p>
					) : null}

					<button
						type="submit"
						disabled={isSubmitting}
						className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primaryHover disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isSubmitting ? (
							<Loader2 size={16} className="animate-spin" />
						) : null}
						{isSubmitting ? "Signing in..." : "Sign in"}
					</button>
				</form>
			</div>
		</main>
	);
}
