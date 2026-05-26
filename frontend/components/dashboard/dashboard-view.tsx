"use client";

import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { KPICard } from "@/components/dashboard/kpi-card";
import { formatDate } from "@/lib/utils/date";
import { StatusBadge } from "@/components/applications/status-badge";
import {
	CHART_AXIS_PROPS,
	CHART_GRID_PROPS,
	CHART_TOOLTIP_STYLE,
} from "@/lib/charts";
import {
	Briefcase,
	MessageCircle,
	XCircle,
	Trophy,
	TrendingUp,
	Ghost,
	Calendar,
	Clock,
	Mail,
} from "lucide-react";

const PIPELINE_COLORS: Record<string, string> = {
	Applied: "var(--primary)",
	Interviewing: "var(--secondary)",
	Rejected: "var(--danger)",
	OFFER: "var(--accent)",
	Ghosted: "var(--highlight)",
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
	charts: {
		pipeline: Array<{ name: string; value: number }>;
		applicationsOverTime: Array<{ month: string; count: number }>;
		ghostedTrend: Array<{ month: string; count: number }>;
	};
	recentActivity: Array<{
		id: string;
		company: string;
		roleTitle: string;
		finalStatus: string;
		createdAt: string;
	}>;
	upcomingReminders: Array<{
		id: string;
		company: string;
		roleTitle: string;
		reminderDate: string;
		reminderType: string;
	}>;
};

export function DashboardView() {
	const [data, setData] = useState<DashboardResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryKey, setRetryKey] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		let cancelled = false;

		setIsLoading(true);
		setError(null);
		setData(null);

		async function loadDashboard() {
			try {
				const response = await fetch("/api/dashboard", {
					signal: controller.signal,
				});

				if (!response.ok) {
					throw new Error(`Dashboard API failed: ${response.status}`);
				}

				const json = (await response.json()) as DashboardResponse | null;
				if (
					!json?.metrics ||
					!json?.charts ||
					!Array.isArray(json.recentActivity) ||
					!Array.isArray(json.upcomingReminders)
				) {
					throw new Error("Invalid dashboard payload.");
				}

				if (!cancelled) {
					setData(json);
				}
			} catch (err: unknown) {
				if (err instanceof DOMException && err.name === "AbortError") {
					return;
				}

				if (!cancelled) {
					setData(null);
					setError("Could not load dashboard data.");
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		}

		loadDashboard();

		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [retryKey]);

	return (
		<AppShell>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-semibold text-textMain">Dashboard</h1>
					<p className="text-sm text-textSoft mt-1">
						Overview of your application progress
					</p>
				</div>

				{isLoading ? (
					<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
						<p className="py-10 text-center text-sm text-textSoft">
							Loading dashboard...
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
				) : !data ? (
					<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
						<div className="flex flex-col items-center gap-3 py-10 text-center text-sm text-textSoft">
							<p>Dashboard data is not available right now.</p>
							<button
								onClick={() => setRetryKey((prev) => prev + 1)}
								className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors text-sm font-medium shadow-glow"
							>
								Retry
							</button>
						</div>
					</div>
				) : data.metrics.totalApplications === 0 ? (
					<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
						<p className="py-10 text-center text-sm text-textSoft">
							No applications yet. Add your first application in the
							Applications page.
						</p>
					</div>
				) : (
					<>
						{/* KPI Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
							<KPICard
								title="Total Applications"
								value={data.metrics.totalApplications}
								icon={Briefcase}
								iconTone="primary"
							/>
							<KPICard
								title="Interviewing"
								value={data.metrics.interviewing}
								icon={MessageCircle}
								iconTone="secondary"
							/>
							<KPICard
								title="Rejected"
								value={data.metrics.rejected}
								icon={XCircle}
								iconTone="danger"
							/>
							<KPICard
								title="Offers"
								value={data.metrics.offers}
								icon={Trophy}
								iconTone="accent"
							/>
							<KPICard
								title="Success Rate"
								value={`${data.metrics.successRate}%`}
								icon={TrendingUp}
								iconTone="success"
							/>
							<KPICard
								title="Ghosted"
								value={data.metrics.ghosted}
								icon={Ghost}
								iconTone="highlight"
							/>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Pipeline Chart */}
							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
								<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary),var(--secondary),var(--accent),var(--highlight))]" />
								<h2 className="text-lg font-semibold text-textMain mb-4">
									Application Pipeline
								</h2>
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={data.charts.pipeline}>
										<CartesianGrid {...CHART_GRID_PROPS} />
										<XAxis dataKey="name" {...CHART_AXIS_PROPS} />
										<YAxis {...CHART_AXIS_PROPS} />
										<Tooltip
											contentStyle={CHART_TOOLTIP_STYLE}
											cursor={{ fill: "transparent" }}
										/>
										<Bar dataKey="value" radius={[8, 8, 0, 0]}>
											{data.charts.pipeline.map((entry) => (
												<Cell
													key={entry.name}
													fill={PIPELINE_COLORS[entry.name] || "#6b7280"}
												/>
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>

							{/* Upcoming Follow-ups */}
							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
								<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--secondary),var(--accent))]" />
								<div className="flex items-center gap-2 mb-4">
									<Calendar className="text-primary" size={20} />
									<h2 className="text-lg font-semibold text-textMain">
										Upcoming Follow-ups
									</h2>
								</div>
								<div className="space-y-3">
									{data.upcomingReminders.length > 0 ? (
										data.upcomingReminders.slice(0, 5).map((item) => (
											<div
												key={item.id}
												className="flex items-center justify-between p-3 bg-surfaceAlt rounded-lg"
											>
												<div className="flex-1">
													<p className="font-medium text-textMain text-sm">
														{item.company}
													</p>
													<p className="text-xs text-textSoft">
														{item.roleTitle}
													</p>
												</div>
												<div className="text-right">
													<p className="text-xs font-medium text-textMain">
														{formatDate(item.reminderDate)}
													</p>
													<p className="text-xs text-textSoft">
														{item.reminderType}
													</p>
												</div>
											</div>
										))
									) : (
										<div className="text-center py-8 text-textSoft text-sm">
											No upcoming follow-ups scheduled
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Recent Activity */}
							<div className="bg-surface rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
								<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--highlight),var(--primary))]" />
								<div className="flex items-center gap-2 mb-4">
									<Clock className="text-primary" size={20} />
									<h2 className="text-lg font-semibold text-textMain">
										Recent Applications
									</h2>
								</div>
								<div className="space-y-3">
									{data.recentActivity.map((item) => (
										<div
											key={item.id}
											className="flex items-center justify-between p-3 border-b border-border last:border-0"
										>
											<div className="flex-1">
												<p className="font-medium text-textMain text-sm">
													{item.company}
												</p>
												<p className="text-xs text-textSoft">
													{item.roleTitle}
												</p>
											</div>
											<div className="text-right flex items-center gap-2">
												<p className="text-xs text-textSoft">
													{formatDate(item.createdAt)}
												</p>
												<StatusBadge status={item.finalStatus as never} />
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Calendar & Email Status */}
							<div className="space-y-6">
								<div className="bg-surface rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
									<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary),var(--secondary))]" />
									<h2 className="text-lg font-semibold text-textMain mb-4">
										Calendar Reminders
									</h2>
									<div className="flex items-center justify-between p-3 bg-surfaceAlt rounded-lg">
										<div>
											<p className="text-sm font-medium text-textMain">
												{data.upcomingReminders.length} reminders upcoming
											</p>
											<p className="text-xs text-textSoft">
												Follow-ups and interviews
											</p>
										</div>
										<a
											href="/reminders"
											className="text-sm text-primary hover:text-primaryHover font-medium"
										>
											View all
										</a>
									</div>
								</div>

								<div className="bg-surface rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
									<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--accent),var(--highlight))]" />
									<h2 className="text-lg font-semibold text-textMain mb-4">
										Email Sync Status
									</h2>
									<div className="space-y-3">
										<div className="flex items-center justify-between p-3 bg-surfaceAlt rounded-lg">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border">
													<Mail className="text-secondary" size={20} />
												</div>
												<div>
													<p className="text-sm font-medium text-textMain">
														Connected
													</p>
													<p className="text-xs text-textSoft">
														Last synced 2 hours ago
													</p>
												</div>
											</div>
											<div className="w-2 h-2 bg-success rounded-full" />
										</div>
										<a
											href="/integrations/email"
											className="block w-full text-center text-sm text-textMain py-2 border border-border rounded-lg hover:bg-surfaceAlt transition-colors"
										>
											Sync now
										</a>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</AppShell>
	);
}
