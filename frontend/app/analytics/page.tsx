"use client";

import { useEffect, useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import {
	TrendingUp,
	Clock,
	Target,
	Calendar as CalendarIcon,
} from "lucide-react";
import {
	CHART_AXIS_PROPS,
	CHART_GRID_PROPS,
	CHART_TOOLTIP_STYLE,
} from "@/lib/charts";

type DashboardResponse = {
	metrics: {
		totalApplications: number;
		interviewing: number;
		rejected: number;
		offers: number;
		ghosted: number;
		successRate: number;
	};
	charts: {
		pipeline: Array<{ name: string; value: number }>;
		applicationsOverTime: Array<{ month: string; count: number }>;
		ghostedTrend: Array<{ month: string; count: number }>;
	};
};

export default function AnalyticsPage() {
	const [data, setData] = useState<DashboardResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryKey, setRetryKey] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		setIsLoading(true);
		setError(null);

		fetch("/api/dashboard", { signal: controller.signal })
			.then((res) => {
				if (!res.ok) throw new Error(`Analytics API failed: ${res.status}`);
				return res.json();
			})
			.then((json) => {
				if (!json?.metrics || !json?.charts)
					throw new Error("Invalid analytics payload.");
				setData(json);
			})
			.catch((err: unknown) => {
				if (err instanceof DOMException && err.name === "AbortError") return;
				setData(null);
				setError("Could not load analytics data.");
			})
			.finally(() => setIsLoading(false));

		return () => controller.abort();
	}, [retryKey]);

	const totalApps = data?.metrics.totalApplications ?? 0;
	const offers = data?.metrics.offers ?? 0;
	const interviewing = data?.metrics.interviewing ?? 0;
	const rejected = data?.metrics.rejected ?? 0;
	const ghosted = data?.metrics.ghosted ?? 0;
	const successRate = data?.metrics.successRate ?? 0;
	const applied =
		data?.charts.pipeline.find((item) => item.name === "Applied")?.value ?? 0;

	const responded = useMemo(() => {
		if (!data) return 0;
		return interviewing + rejected + offers;
	}, [data, interviewing, rejected, offers]);

	const responseRate =
		totalApps > 0 ? Math.round((responded / totalApps) * 100) : 0;

	const statusData = useMemo(
		() =>
			[
				{
					name: "Applied",
					value: applied,
					color: "var(--primary)",
				},
				{
					name: "Interviewing",
					value: interviewing,
					color: "var(--secondary)",
				},
				{ name: "Rejected", value: rejected, color: "var(--danger)" },
				{ name: "Offer", value: offers, color: "var(--accent)" },
				{ name: "Ghosted", value: ghosted, color: "var(--highlight)" },
			].filter((item) => item.value > 0),
		[applied, interviewing, rejected, offers, ghosted],
	);

	const timelineData = useMemo(() => {
		if (!data) return [];
		return data.charts.applicationsOverTime.map((monthEntry) => ({
			month: monthEntry.month,
			applications: monthEntry.count,
			offers: 0,
		}));
	}, [data]);

	return (
		<AppShell>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-semibold text-textMain">Analytics</h1>
					<p className="text-sm text-textSoft mt-1">
						Insights into your application performance
					</p>
				</div>

				{isLoading ? (
					<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
						<p className="py-10 text-center text-sm text-textSoft">
							Loading analytics...
						</p>
					</div>
				) : error ? (
					<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
						<div className="flex flex-col items-center gap-3 py-10 text-center text-sm text-textSoft">
							<p>{error}</p>
							<button
								onClick={() => setRetryKey((prev) => prev + 1)}
								className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors text-sm font-medium shadow-glow"
							>
								Retry
							</button>
						</div>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
								<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary),var(--secondary))]" />
								<div className="flex items-center gap-3 mb-2">
									<div className="w-10 h-10 rounded-lg bg-surfaceAlt flex items-center justify-center border border-border">
										<TrendingUp className="text-secondary" size={20} />
									</div>
									<p className="text-sm text-textSoft">Success Rate</p>
								</div>
								<p className="text-3xl font-semibold text-textMain">
									{successRate}%
								</p>
								<p className="text-xs text-textSoft mt-1">
									Offers + Interviewing
								</p>
							</div>

							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
								<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary),var(--highlight))]" />
								<div className="flex items-center gap-3 mb-2">
									<div className="w-10 h-10 rounded-lg bg-surfaceAlt flex items-center justify-center border border-border">
										<Target className="text-primary" size={20} />
									</div>
									<p className="text-sm text-textSoft">Response Rate</p>
								</div>
								<p className="text-3xl font-semibold text-textMain">
									{responseRate}%
								</p>
								<p className="text-xs text-textSoft mt-1">
									Companies responded
								</p>
							</div>

							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
								<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--highlight),var(--accent))]" />
								<div className="flex items-center gap-3 mb-2">
									<div className="w-10 h-10 rounded-lg bg-surfaceAlt flex items-center justify-center border border-border">
										<Clock className="text-highlight" size={20} />
									</div>
									<p className="text-sm text-textSoft">Total Applications</p>
								</div>
								<p className="text-3xl font-semibold text-textMain">
									{totalApps}
								</p>
								<p className="text-xs text-textSoft mt-1">All time</p>
							</div>

							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
								<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--accent),var(--secondary))]" />
								<div className="flex items-center gap-3 mb-2">
									<div className="w-10 h-10 rounded-lg bg-surfaceAlt flex items-center justify-center border border-border">
										<CalendarIcon className="text-accent" size={20} />
									</div>
									<p className="text-sm text-textSoft">Offers Received</p>
								</div>
								<p className="text-3xl font-semibold text-textMain">{offers}</p>
								<p className="text-xs text-textSoft mt-1">
									Out of {totalApps} applications
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
								<h2 className="text-lg font-semibold text-textMain mb-4">
									Applications Over Time
								</h2>
								<ResponsiveContainer width="100%" height={300}>
									<LineChart data={timelineData}>
										<CartesianGrid {...CHART_GRID_PROPS} />
										<XAxis dataKey="month" {...CHART_AXIS_PROPS} />
										<YAxis {...CHART_AXIS_PROPS} />
										<Tooltip
											contentStyle={CHART_TOOLTIP_STYLE}
											cursor={{ fill: "transparent" }}
										/>
										<Legend />
										<Line
											type="monotone"
											dataKey="applications"
											stroke="var(--primary)"
											strokeWidth={2.5}
											dot={false}
											name="Applications"
										/>
										<Line
											type="monotone"
											dataKey="offers"
											stroke="var(--accent)"
											strokeWidth={2.5}
											dot={false}
											name="Offers"
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>

							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
								<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--danger),var(--accent),var(--highlight))]" />
								<h2 className="text-lg font-semibold text-textMain mb-4">
									Status Distribution
								</h2>
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie
											data={statusData}
											cx="50%"
											cy="50%"
											labelLine={false}
											label={({ name, percent }) =>
												`${name}: ${(percent * 100).toFixed(0)}%`
											}
											outerRadius={100}
											fill="var(--primary)"
											dataKey="value"
										>
											{statusData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Pie>
										<Tooltip
											contentStyle={CHART_TOOLTIP_STYLE}
											cursor={{ fill: "transparent" }}
										/>
									</PieChart>
								</ResponsiveContainer>
							</div>

							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
								<h2 className="text-lg font-semibold text-textMain mb-4">
									Pipeline Funnel
								</h2>
								<div className="space-y-3">
									{[
										{
											label: "Applied",
											count: totalApps,
											pct: 100,
											color: "bg-primary",
										},
										{
											label: "Responded",
											count: responded,
											pct: responseRate,
											color: "bg-secondary",
										},
										{
											label: "Interviewing",
											count: interviewing,
											pct:
												totalApps > 0
													? Math.round((interviewing / totalApps) * 100)
													: 0,
											color: "bg-highlight",
										},
										{
											label: "Offers",
											count: offers,
											pct:
												totalApps > 0
													? Math.round((offers / totalApps) * 100)
													: 0,
											color: "bg-accent",
										},
									].map((stage) => (
										<div key={stage.label}>
											<div className="flex items-center justify-between mb-1">
												<p className="text-sm font-medium text-textSoft">
													{stage.label}
												</p>
												<p className="text-sm font-semibold text-textMain">
													{stage.count}
												</p>
											</div>
											<div className="w-full bg-surfaceAlt rounded-full h-8 overflow-hidden">
												<div
													className={`${stage.color} h-8 rounded-full flex items-center justify-end pr-3`}
													style={{ width: `${Math.max(stage.pct, 5)}%` }}
												>
													<span className="text-xs text-white font-medium">
														{stage.pct}%
													</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
								<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--danger),var(--accent),var(--highlight))]" />
								<h2 className="text-lg font-semibold text-textMain mb-4">
									Rejection vs Offer Ratio
								</h2>
								<ResponsiveContainer width="100%" height={300}>
									<BarChart
										data={[
											{ name: "Rejected", value: rejected },
											{ name: "Offers", value: offers },
											{ name: "Ghosted", value: ghosted },
										]}
									>
										<CartesianGrid {...CHART_GRID_PROPS} />
										<XAxis dataKey="name" {...CHART_AXIS_PROPS} />
										<YAxis {...CHART_AXIS_PROPS} />
										<Tooltip
											contentStyle={CHART_TOOLTIP_STYLE}
											cursor={{ fill: "transparent" }}
										/>
										<Bar dataKey="value" radius={[8, 8, 0, 0]}>
											<Cell fill="var(--danger)" />
											<Cell fill="var(--accent)" />
											<Cell fill="var(--highlight)" />
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>

							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm lg:col-span-2 relative overflow-hidden">
								<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary),var(--secondary),var(--accent),var(--highlight))]" />
								<h2 className="text-lg font-semibold text-textMain mb-4">
									Application Activity Heatmap
								</h2>
								<div className="grid grid-cols-7 gap-2">
									{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
										(day) => (
											<div
												key={day}
												className="text-center text-xs font-medium text-textSoft mb-2"
											>
												{day}
											</div>
										),
									)}
									{Array.from({ length: 28 }).map((_, index) => {
										const intensity = [
											0, 1, 2, 3, 0, 1, 0, 2, 3, 1, 0, 2, 1, 0, 3, 2, 1, 0, 1,
											2, 0, 3, 1, 2, 0, 1, 0, 2,
										][index];
										const colors = [
											"bg-surfaceAlt",
											"bg-blue-100",
											"bg-blue-300",
											"bg-primary",
										];
										return (
											<div
												key={index}
												className={`aspect-square rounded ${colors[intensity]} hover:ring-2 hover:ring-primary cursor-pointer transition-all`}
												title={`${intensity} applications`}
											/>
										);
									})}
								</div>
								<div className="flex items-center gap-2 mt-4 text-xs text-textSoft">
									<span>Less</span>
									<div className="flex gap-1">
										<div className="w-4 h-4 bg-surfaceAlt rounded" />
										<div className="w-4 h-4 bg-blue-100 rounded" />
										<div className="w-4 h-4 bg-blue-300 rounded" />
										<div className="w-4 h-4 bg-primary rounded" />
									</div>
									<span>More</span>
								</div>
							</div>

							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm lg:col-span-2 relative overflow-hidden">
								<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--highlight),var(--accent),var(--secondary))]" />
								<h2 className="text-lg font-semibold text-textMain mb-4">
									Insights &amp; Recommendations
								</h2>
								<div className="space-y-3">
									<div className="flex items-start gap-3 p-4 bg-surfaceAlt rounded-lg">
										<div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
											<TrendingUp className="text-primary" size={16} />
										</div>
										<div>
											<p className="font-medium text-textMain text-sm">
												Strong response rate
											</p>
											<p className="text-xs text-textSoft mt-1">
												Your response rate of {responseRate}% is{" "}
												{responseRate > 30 ? "above" : "around"} average. Keep
												applying to similar companies!
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3 p-4 bg-surfaceAlt rounded-lg">
										<div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
											<Clock className="text-accent" size={16} />
										</div>
										<div>
											<p className="font-medium text-textMain text-sm">
												Follow up on pending applications
											</p>
											<p className="text-xs text-textSoft mt-1">
												Consider following up on applications that haven&apos;t
												received a response in over 2 weeks.
											</p>
										</div>
									</div>

									{offers > 0 && (
										<div className="flex items-start gap-3 p-4 bg-surfaceAlt rounded-lg">
											<div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
												<Target className="text-success" size={16} />
											</div>
											<div>
												<p className="font-medium text-textMain text-sm">
													Congratulations on your offers!
												</p>
												<p className="text-xs text-textSoft mt-1">
													You&apos;ve received {offers}{" "}
													{offers === 1 ? "offer" : "offers"}. Review and
													compare them carefully.
												</p>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</AppShell>
	);
}
