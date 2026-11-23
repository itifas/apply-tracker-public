"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { RouteMap } from "@/components/dashboard/route-map";
import type { ApplicationRecord } from "@/types/application";

type Reminder = {
	id: string;
	company: string;
	roleTitle: string;
	reminderDate: string;
	reminderType: string;
	completed: boolean;
};

type DashboardResponse = {
	metrics: {
		totalApplications: number;
		interviewing: number;
		rejected: number;
		offers: number;
		ghosted: number;
		successRate: number;
	};
};

const REMINDER_LABELS: Record<string, string> = {
	FollowUp3Days: "3-day follow-up",
	FollowUp7Days: "1-week follow-up",
	FollowUp14Days: "2-week follow-up",
	Ghosted30Days: "30-day check-in",
	Custom: "Follow-up",
};

const primaryButton =
	"inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-onPrimary transition-[background-color,transform] duration-150 ease-out hover:bg-primaryHover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const textLink =
	"shrink-0 rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

function plural(count: number, one: string, many: string) {
	return `${count} ${count === 1 ? one : many}`;
}

function headline(moving: number, due: number) {
	const movingText =
		moving === 0
			? "Nothing is in interviews yet"
			: `${plural(moving, "application is", "applications are")} in interviews`;
	if (due === 0) {
		return `${movingText}, and no follow-ups are due.`;
	}
	return `${movingText}, and ${plural(due, "follow-up is", "follow-ups are")} due.`;
}

export function DashboardView() {
	const [data, setData] = useState<DashboardResponse | null>(null);
	const [applications, setApplications] = useState<ApplicationRecord[]>([]);
	const [reminders, setReminders] = useState<Reminder[]>([]);
	const [state, setState] = useState<"loading" | "ready" | "error">("loading");
	const [retryKey, setRetryKey] = useState(0);
	const [today] = useState(() => new Date());

	useEffect(() => {
		let cancelled = false;
		setState("loading");

		Promise.all(
			["/api/dashboard", "/api/applications", "/api/reminders"].map((url) =>
				fetch(url).then((response) => {
					if (!response.ok) {
						throw new Error(`Request failed: ${url}`);
					}
					return response.json();
				}),
			),
		)
			.then(([dashboard, apps, allReminders]) => {
				if (!cancelled) {
					setData(dashboard as DashboardResponse);
					setApplications(apps as ApplicationRecord[]);
					setReminders(
						(allReminders as Reminder[]).filter((item) => !item.completed),
					);
					setState("ready");
				}
			})
			.catch(() => {
				if (!cancelled) {
					setState("error");
				}
			});

		return () => {
			cancelled = true;
		};
	}, [retryKey]);

	const dueCount = reminders.filter(
		(reminder) =>
			differenceInCalendarDays(new Date(reminder.reminderDate), today) <= 0,
	).length;

	return (
		<AppShell>
			<div className="mx-auto max-w-6xl">
				{state === "loading" && (
					<p className="py-24 text-textSoft" role="status">
						Loading your applications…
					</p>
				)}

				{state === "error" && (
					<div className="py-24">
						<p className="text-lg font-bold text-textMain">
							Your dashboard didn&apos;t load.
						</p>
						<p className="mt-1 text-textSoft">
							Check your connection, then try again.
						</p>
						<button
							onClick={() => setRetryKey((key) => key + 1)}
							className={`${primaryButton} mt-5`}
						>
							Try again
						</button>
					</div>
				)}

				{state === "ready" && data && applications.length === 0 && (
					<div className="py-24">
						<h1 className="max-w-xl text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em] text-textMain">
							Your route map is empty.
						</h1>
						<p className="mt-3 max-w-md text-textSoft">
							Add an application and it shows up here as a line, moving from
							applied to offer as you pass each stage.
						</p>
						<Link href="/applications/new" className={`${primaryButton} mt-6`}>
							<Plus size={16} />
							Add application
						</Link>
					</div>
				)}

				{state === "ready" && data && applications.length > 0 && (
					<>
						<header className="flex flex-col gap-6 pb-10 pt-2 md:flex-row md:items-end md:justify-between">
							<div>
								<p className="text-sm text-textSoft">
									{format(today, "EEEE, d MMMM")}
								</p>
								<h1 className="mt-2 max-w-[22ch] text-balance text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] text-textMain sm:text-[34px] lg:text-[42px]">
									{headline(data.metrics.interviewing, dueCount)}
								</h1>
							</div>
							<Link href="/applications/new" className={`${primaryButton} self-start md:self-auto`}>
								<Plus size={16} />
								Add application
							</Link>
						</header>

						<section
							aria-labelledby="route-map-title"
							className="rounded-lg border border-border bg-surface px-5 pb-4 pt-6 sm:px-8"
						>
							<div className="mb-6 flex items-baseline justify-between gap-4">
								<h2
									id="route-map-title"
									className="text-xl font-extrabold tracking-[-0.01em] text-textMain"
								>
									Where every application stands
								</h2>
								<Link
									href="/applications"
									className={textLink}
								>
									{applications.length > 8
										? `See all ${applications.length}`
										: "Open list"}
								</Link>
							</div>
							<RouteMap applications={applications} />
						</section>

						<div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
							<section
								aria-labelledby="follow-ups-title"
								className="rounded-lg border border-border bg-surface px-5 py-6 sm:px-8"
							>
								<div className="mb-4 flex items-baseline justify-between gap-4">
									<h2
										id="follow-ups-title"
										className="text-xl font-extrabold tracking-[-0.01em] text-textMain"
									>
										Follow-ups
									</h2>
									<Link
										href="/reminders"
										className={textLink}
									>
										Manage
									</Link>
								</div>

								{reminders.length === 0 ? (
									<p className="text-textSoft">
										No follow-ups planned. Add one from an application&apos;s
										page when you&apos;re waiting to hear back.
									</p>
								) : (
									<ul className="divide-y divide-border">
										{reminders.slice(0, 6).map((reminder) => {
											const date = new Date(reminder.reminderDate);
											const offset = differenceInCalendarDays(date, today);
											const due = offset <= 0;
											return (
												<li
													key={reminder.id}
													className="relative grid grid-cols-[52px_1fr_auto] items-center gap-4 py-3"
												>
													{due && (
														<span
															aria-hidden="true"
															className="absolute -left-3 bottom-3 top-3 w-[3px] rounded-full bg-[var(--signal)] sm:-left-4"
														/>
													)}
													<span className="text-center leading-none tabular-nums">
														<span className="block text-[22px] font-extrabold text-textMain">
															{format(date, "d")}
														</span>
														<span className="mt-1 block text-xs text-textSoft">
															{format(date, "MMM")}
														</span>
													</span>
													<span className="min-w-0">
														<span className="block truncate font-bold text-textMain">
															{reminder.company}
														</span>
														<span className="block truncate text-sm text-textSoft">
															{REMINDER_LABELS[reminder.reminderType] ??
																"Follow-up"}{" "}
															for {reminder.roleTitle}
														</span>
													</span>
													<span
														className={`text-right text-sm tabular-nums ${
															due
																? "font-bold text-[var(--signal-ink)]"
																: "text-textSoft"
														}`}
													>
														{offset < 0
															? `${plural(-offset, "day", "days")} late`
															: offset === 0
																? "Today"
																: offset === 1
																	? "Tomorrow"
																	: `In ${offset} days`}
													</span>
												</li>
											);
										})}
									</ul>
								)}
							</section>

							<section
								aria-labelledby="totals-title"
								className="rounded-lg border border-border bg-surface px-5 py-6 sm:px-8"
							>
								<h2
									id="totals-title"
									className="mb-5 text-xl font-extrabold tracking-[-0.01em] text-textMain"
								>
									Totals
								</h2>
								<dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
									{[
										["Applications", data.metrics.totalApplications, "var(--text-main)"],
										["In interviews", data.metrics.interviewing, "var(--line-interview)"],
										["Offers", data.metrics.offers, "var(--line-offer)"],
										["Rejected", data.metrics.rejected, "var(--line-rejected)"],
										["No reply", data.metrics.ghosted, "var(--line-ghosted)"],
										["Offer rate", `${data.metrics.successRate}%`, "var(--text-main)"],
									].map(([label, value, color]) => (
										<div key={label as string} className="flex flex-col-reverse">
											<dt className="mt-1.5 text-sm text-textSoft">{label}</dt>
											<dd
												className="text-[30px] font-extrabold leading-none tabular-nums"
												style={{ color: color as string }}
											>
												{value}
											</dd>
										</div>
									))}
								</dl>
							</section>
						</div>
					</>
				)}
			</div>
		</AppShell>
	);
}
