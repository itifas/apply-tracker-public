"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AppShell } from "@/components/layout/app-shell";
import { usePalette } from "@/components/theme-provider";
import { themePalettes } from "@/lib/theme-palettes";
import {
	Moon,
	Sun,
	Monitor,
	Bell,
	Calendar,
	Mail,
	Download,
	Keyboard,
	Trash2,
} from "lucide-react";

export default function SettingsPage() {
	const { theme, setTheme } = useTheme();
	const { palette, setPalette, mounted } = usePalette();
	const [mountedTheme, setMountedTheme] = useState(false);

	useEffect(() => {
		setMountedTheme(true);
	}, []);

	async function exportCSV() {
		const response = await fetch("/api/export/csv");
		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "jobs-tracker-export.csv";
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<AppShell>
			<div className="space-y-6 max-w-4xl">
				<div>
					<h1 className="text-2xl font-semibold text-textMain">Settings</h1>
					<p className="mt-1 text-sm text-textSoft">
						Manage your preferences and integrations
					</p>
				</div>

				<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
					<h2 className="mb-4 text-lg font-semibold text-textMain">
						Appearance
					</h2>
					<div className="space-y-6">
						<div>
							<p className="mb-3 text-sm font-medium text-textMain">Theme</p>
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
								{[
									{ value: "light", icon: Sun, label: "Light" },
									{ value: "dark", icon: Moon, label: "Dark" },
									{ value: "system", icon: Monitor, label: "System" },
								].map((option) => {
									const isSelected = mountedTheme && theme === option.value;
									const Icon = option.icon;

									return (
										<button
											key={option.value}
											onClick={() => setTheme(option.value)}
											className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
												isSelected
													? "border-primary bg-[linear-gradient(180deg,var(--surface),var(--surfaceAlt))] shadow-panel"
													: "border-border bg-[linear-gradient(180deg,var(--surface),var(--background))] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-panel"
											}`}
										>
											<div className="flex items-center gap-3">
												<div
													className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
														isSelected
															? "border-transparent bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-white shadow-sm"
															: "border-border bg-surfaceAlt text-textSoft"
													}`}
												>
													{mountedTheme ? (
														<Icon size={20} />
													) : (
														<span
															className="block h-5 w-5"
															aria-hidden="true"
														/>
													)}
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-semibold text-textMain">
														{option.label}
													</p>
													<p className="mt-1 text-xs text-textSoft">
														{option.value === "system"
															? "Follow your device preference automatically."
															: option.value === "dark"
																? "Reduce glare with a darker workspace."
																: "Keep the interface bright and airy."}
													</p>
												</div>
												{isSelected ? (
													<span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
														Active
													</span>
												) : null}
											</div>
										</button>
									);
								})}
							</div>
						</div>

						<div>
							<div className="mb-3 flex items-center justify-between gap-3">
								<div>
									<p className="text-sm font-medium text-textMain">
										Color Theme
									</p>
									<p className="mt-1 text-xs text-textSoft">
										Pick a preset palette. The choice is stored locally in this
										browser.
									</p>
								</div>
								<span className="rounded-full border border-border bg-surfaceAlt px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-textSoft">
									{mounted
										? themePalettes.find((item) => item.id === palette)?.name
										: "Palette"}
								</span>
							</div>
							<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
								{themePalettes.map((option) => {
									const isSelected = mounted && palette === option.id;

									return (
										<button
											key={option.id}
											onClick={() => setPalette(option.id)}
											aria-pressed={isSelected}
											className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
												isSelected
													? "border-primary bg-[linear-gradient(180deg,var(--surface),var(--surfaceAlt))] shadow-panel"
													: "border-border bg-[linear-gradient(180deg,var(--surface),var(--background))] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-panel"
											}`}
										>
											<div className="flex items-start justify-between gap-3">
												<div>
													<p className="text-sm font-semibold text-textMain">
														{option.name}
													</p>
													<p className="mt-1 text-xs text-textSoft">
														{option.description}
													</p>
												</div>
												{isSelected ? (
													<span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
														Active
													</span>
												) : null}
											</div>
											<div className="mt-4 flex items-center gap-2">
												{option.swatches.map((swatch) => (
													<span
														key={swatch}
														className="h-4 w-4 rounded-full border border-white/50 shadow-sm"
														style={{ backgroundColor: swatch }}
													/>
												))}
											</div>
											<div className="mt-4 grid grid-cols-2 gap-3">
												<div className="rounded-xl border border-border bg-background px-3 py-2">
													<p className="text-[10px] uppercase tracking-[0.2em] text-textSoft">
														Light
													</p>
													<div className="mt-2 space-y-2">
														<div
															className="h-2 rounded-full"
															style={{ backgroundColor: option.light.primary }}
														/>
														<div
															className="h-2 rounded-full opacity-80"
															style={{
																backgroundColor: option.light.secondary,
															}}
														/>
													</div>
												</div>
												<div className="rounded-xl border border-border bg-surfaceAlt px-3 py-2">
													<p className="text-[10px] uppercase tracking-[0.2em] text-textSoft">
														Dark
													</p>
													<div className="mt-2 space-y-2">
														<div
															className="h-2 rounded-full"
															style={{ backgroundColor: option.dark.primary }}
														/>
														<div
															className="h-2 rounded-full opacity-80"
															style={{ backgroundColor: option.dark.secondary }}
														/>
													</div>
												</div>
											</div>
										</button>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
					<div className="mb-4 flex items-center gap-2">
						<Bell className="text-primary" size={20} />
						<h2 className="text-lg font-semibold text-textMain">
							Notification Preferences
						</h2>
					</div>
					<div className="space-y-3">
						{[
							{
								title: "Application updates",
								desc: "Get notified when application status changes",
								on: true,
							},
							{
								title: "Upcoming reminders",
								desc: "Notify me about upcoming follow-ups",
								on: true,
							},
							{
								title: "Email notifications",
								desc: "Receive email summaries",
								on: false,
							},
							{
								title: "Weekly digest",
								desc: "Get weekly application summary",
								on: true,
							},
						].map((notification) => (
							<div
								key={notification.title}
								className="flex items-center justify-between rounded-lg bg-surfaceAlt p-3"
							>
								<div>
									<p className="text-sm font-medium text-textMain">
										{notification.title}
									</p>
									<p className="text-xs text-textSoft">{notification.desc}</p>
								</div>
								<label className="relative inline-flex cursor-pointer items-center">
									<input
										type="checkbox"
										className="peer sr-only"
										defaultChecked={notification.on}
									/>
									<div className="peer h-6 w-11 rounded-full border border-border bg-surface transition after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-white after:transition-all peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 peer-checked:bg-primary peer-checked:after:translate-x-full" />
								</label>
							</div>
						))}
					</div>
				</div>

				<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
					<div className="mb-4 flex items-center gap-2">
						<Calendar className="text-primary" size={20} />
						<h2 className="text-lg font-semibold text-textMain">
							Reminder Defaults
						</h2>
					</div>
					<div className="space-y-4">
						<div>
							<label className="mb-2 block text-sm font-medium text-textMain">
								Default follow-up time
							</label>
							<select className="w-full rounded-lg border border-border bg-background px-4 py-2 text-textMain focus:outline-none focus:ring-2 focus:ring-primary">
								<option>3 days after applying</option>
								<option>5 days after applying</option>
								<option>7 days after applying</option>
								<option>14 days after applying</option>
							</select>
						</div>
						<div>
							<label className="mb-2 block text-sm font-medium text-textMain">
								Reminder time of day
							</label>
							<select className="w-full rounded-lg border border-border bg-background px-4 py-2 text-textMain focus:outline-none focus:ring-2 focus:ring-primary">
								<option>9:00 AM</option>
								<option>12:00 PM</option>
								<option>3:00 PM</option>
								<option>6:00 PM</option>
							</select>
						</div>
					</div>
				</div>

				<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
					<h2 className="mb-4 text-lg font-semibold text-textMain">
						Integrations
					</h2>
					<div className="space-y-3">
						<div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surfaceAlt">
									<Mail className="text-secondary" size={20} />
								</div>
								<div>
									<p className="text-sm font-medium text-textMain">
										Email Integration
									</p>
									<p className="text-xs text-textSoft">Gmail connected</p>
								</div>
							</div>
							<a
								href="/integrations/email"
								className="text-sm font-medium text-primary hover:text-primaryHover"
							>
								Manage
							</a>
						</div>

						<div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surfaceAlt">
									<Calendar className="text-primary" size={20} />
								</div>
								<div>
									<p className="text-sm font-medium text-textMain">
										Calendar Sync
									</p>
									<p className="text-xs text-textSoft">
										Google Calendar connected
									</p>
								</div>
							</div>
							<a
								href="/reminders"
								className="text-sm font-medium text-primary hover:text-primaryHover"
							>
								Manage
							</a>
						</div>
					</div>
				</div>

				<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
					<div className="mb-4 flex items-center gap-2">
						<Keyboard className="text-highlight" size={20} />
						<h2 className="text-lg font-semibold text-textMain">
							Keyboard Shortcuts
						</h2>
					</div>
					<div className="space-y-3">
						{[
							{ action: "Add new application", key: "Ctrl + N" },
							{ action: "Search applications", key: "Ctrl + K" },
							{ action: "Go to dashboard", key: "G then D" },
							{ action: "Go to applications", key: "G then A" },
							{ action: "Open settings", key: "Ctrl + ," },
						].map((shortcut, index, shortcuts) => (
							<div
								key={shortcut.key}
								className={`flex items-center justify-between py-2 ${index < shortcuts.length - 1 ? "border-b border-border" : ""}`}
							>
								<span className="text-sm text-textMain">{shortcut.action}</span>
								<kbd className="rounded border border-border bg-surfaceAlt px-2 py-1 font-mono text-xs text-textMain">
									{shortcut.key}
								</kbd>
							</div>
						))}
					</div>
				</div>

				<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
					<h2 className="mb-4 text-lg font-semibold text-textMain">
						Data &amp; Privacy
					</h2>
					<div className="space-y-3">
						<button
							onClick={exportCSV}
							className="flex w-full items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-surfaceAlt"
						>
							<div className="flex items-center gap-3">
								<Download className="text-textSoft" size={20} />
								<div className="text-left">
									<p className="text-sm font-medium text-textMain">
										Export data
									</p>
									<p className="text-xs text-textSoft">
										Download all your application data
									</p>
								</div>
							</div>
							<span className="text-sm font-medium text-primary">Export</span>
						</button>

						<button className="flex w-full items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-surfaceAlt">
							<div className="flex items-center gap-3">
								<Download className="text-textSoft" size={20} />
								<div className="text-left">
									<p className="text-sm font-medium text-textMain">
										Backup data
									</p>
									<p className="text-xs text-textSoft">
										Create a backup of your data
									</p>
								</div>
							</div>
							<span className="text-sm font-medium text-primary">Backup</span>
						</button>

						<button className="flex w-full items-center justify-between rounded-lg border-2 border-red-200 bg-red-50 p-3 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:hover:bg-red-900/30">
							<div className="flex items-center gap-3">
								<Trash2 className="text-red-600" size={20} />
								<div className="text-left">
									<p className="text-sm font-medium text-textMain">
										Delete all data
									</p>
									<p className="text-xs text-red-600">
										Permanently delete all applications
									</p>
								</div>
							</div>
							<span className="text-sm font-medium text-red-600">Delete</span>
						</button>
					</div>
				</div>

				<div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
					<h2 className="mb-4 text-lg font-semibold text-textMain">Account</h2>
					<div className="space-y-4">
						<div>
							<label className="mb-2 block text-sm font-medium text-textMain">
								Name
							</label>
							<input
								type="text"
								defaultValue="Alex Student"
								className="w-full rounded-lg border border-border bg-background px-4 py-2 text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
						<div>
							<label className="mb-2 block text-sm font-medium text-textMain">
								Email
							</label>
							<input
								type="email"
								defaultValue="alex@university.edu"
								className="w-full rounded-lg border border-border bg-background px-4 py-2 text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
						<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primaryHover">
							Save Changes
						</button>
					</div>
				</div>
			</div>
		</AppShell>
	);
}
