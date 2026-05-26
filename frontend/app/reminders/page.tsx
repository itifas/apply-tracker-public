"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format, parseISO, isPast, isToday, isTomorrow } from "date-fns";
import { AppShell } from "@/components/layout/app-shell";
import {
	Bell,
	Calendar as CalendarIcon,
	Clock,
	Download,
	Loader2,
	Plus,
	Pencil,
	RefreshCw,
	X,
	AlertCircle,
} from "lucide-react";

type ReminderItem = {
	id: string;
	applicationId: string;
	company: string;
	roleTitle: string;
	reminderDate: string;
	reminderType: ReminderType;
	completed: boolean;
};

type ApplicationOption = {
	id: string;
	company: string;
	roleTitle: string;
};

const reminderTypes = [
	"FollowUp3Days",
	"FollowUp7Days",
	"FollowUp14Days",
	"Ghosted30Days",
	"Custom",
] as const;
type ReminderType = (typeof reminderTypes)[number];

const shellPanelClass = "rounded-2xl border border-border bg-card shadow-sm";
const fieldClass =
	"w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const primaryButtonClass =
	"inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primaryHover";

const reminderThemeMap = {
	red: {
		card: "border-l-danger",
		accent: "bg-surfaceAlt text-danger",
		label: "text-danger",
		button: "hover:bg-surfaceAlt text-danger",
	},
	amber: {
		card: "border-l-warning",
		accent: "bg-surfaceAlt text-warning",
		label: "text-warning",
		button: "hover:bg-surfaceAlt text-warning",
	},
	blue: {
		card: "border-l-info",
		accent: "bg-surfaceAlt text-info",
		label: "text-info",
		button: "hover:bg-surfaceAlt text-info",
	},
} as const;

export default function RemindersPage() {
	const [reminders, setReminders] = useState<ReminderItem[]>([]);
	const [applications, setApplications] = useState<ApplicationOption[]>([]);
	const [applicationId, setApplicationId] = useState("");
	const [reminderDate, setReminderDate] = useState("");
	const [reminderType, setReminderType] = useState<ReminderType>("Custom");
	const [showCreate, setShowCreate] = useState(false);
	const [editingReminder, setEditingReminder] = useState<ReminderItem | null>(
		null,
	);
	const [editReminderDate, setEditReminderDate] = useState("");
	const [editReminderType, setEditReminderType] =
		useState<ReminderType>("Custom");
	const [editReminderCompleted, setEditReminderCompleted] = useState(false);
	const [isEditSaving, setIsEditSaving] = useState(false);
	const [editError, setEditError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const [remindersRes, appsRes] = await Promise.all([
				fetch("/api/reminders"),
				fetch("/api/applications"),
			]);

			if (!remindersRes.ok || !appsRes.ok) {
				throw new Error("Unable to load reminders.");
			}

			const [remindersData, appsData] = await Promise.all([
				remindersRes.json(),
				appsRes.json(),
			]);
			const reminderItems = Array.isArray(remindersData) ? remindersData : [];
			const appItems = Array.isArray(appsData) ? appsData : [];

			setReminders(reminderItems);
			setApplications(appItems);
			setApplicationId((current) => current || appItems[0]?.id || "");
		} catch {
			setReminders([]);
			setApplications([]);
			setError("We couldn't load reminders right now.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void load();
	}, [load]);

	async function createReminder() {
		await fetch("/api/reminders", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ applicationId, reminderDate, reminderType }),
		});
		setReminderDate("");
		setShowCreate(false);
		await load();
	}

	async function toggleReminder(id: string, completed: boolean) {
		await fetch(`/api/reminders/${id}/complete`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ completed: !completed }),
		});
		await load();
	}

	function openEditReminder(reminder: ReminderItem) {
		setEditingReminder(reminder);
		setEditReminderDate(format(parseISO(reminder.reminderDate), "yyyy-MM-dd"));
		setEditReminderType(reminder.reminderType);
		setEditReminderCompleted(reminder.completed);
		setEditError(null);
	}

	function closeEditReminder() {
		if (isEditSaving) {
			return;
		}

		setEditingReminder(null);
		setEditError(null);
	}

	async function saveEditedReminder() {
		if (!editingReminder) {
			return;
		}

		if (!editReminderDate) {
			setEditError("Please choose a reminder date.");
			return;
		}

		setIsEditSaving(true);
		setEditError(null);

		try {
			const response = await fetch(`/api/reminders/${editingReminder.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					reminderDate: editReminderDate,
					reminderType: editReminderType,
					completed: editReminderCompleted,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update reminder.");
			}

			setEditingReminder(null);
			await load();
		} catch {
			setEditError("We couldn't save that reminder. Please try again.");
		} finally {
			setIsEditSaving(false);
		}
	}

	async function generatePresets() {
		await fetch("/api/reminders", { method: "PUT" });
		await load();
	}

	async function exportICS() {
		const response = await fetch("/api/export/ics");
		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "jobs-tracker-reminders.ics";
		a.click();
		URL.revokeObjectURL(url);
	}

	const active = useMemo(
		() => reminders.filter((reminder) => !reminder.completed),
		[reminders],
	);
	const overdue = useMemo(
		() =>
			active.filter((reminder) => {
				const date = parseISO(reminder.reminderDate);
				return isPast(date) && !isToday(date);
			}),
		[active],
	);
	const today = useMemo(
		() => active.filter((reminder) => isToday(parseISO(reminder.reminderDate))),
		[active],
	);
	const tomorrow = useMemo(
		() =>
			active.filter((reminder) => isTomorrow(parseISO(reminder.reminderDate))),
		[active],
	);
	const later = useMemo(
		() =>
			active.filter((reminder) => {
				const date = parseISO(reminder.reminderDate);
				return !isPast(date) && !isToday(date) && !isTomorrow(date);
			}),
		[active],
	);

	function ReminderCard({
		item,
		color,
		label,
		onEdit,
	}: {
		item: ReminderItem;
		color: keyof typeof reminderThemeMap;
		label?: string;
		onEdit: (item: ReminderItem) => void;
	}) {
		const d = parseISO(item.reminderDate);
		const theme = reminderThemeMap[color];

		return (
			<div
				className={`flex flex-col gap-4 rounded-2xl border border-border border-l-4 bg-card p-4 shadow-sm ${theme.card}`}
			>
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-center gap-4">
						<div
							className={`flex h-12 w-12 flex-col items-center justify-center rounded-xl ${theme.accent}`}
						>
							<p className="text-lg font-semibold">{format(d, "d")}</p>
							<p className="text-xs font-medium">{format(d, "MMM")}</p>
						</div>
						<div className="flex-1">
							<p className="font-medium text-textMain">{item.company}</p>
							<p className="text-sm text-textSoft">{item.roleTitle}</p>
							<div className="mt-1 flex flex-wrap items-center gap-2">
								<span className="text-xs text-textSoft">
									{item.reminderType}
								</span>
								{label && (
									<span className={`text-xs font-medium ${theme.label}`}>
										{label}
									</span>
								)}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2 self-start sm:self-center">
						<button
							onClick={() => onEdit(item)}
							className={`rounded-lg p-2 transition-colors ${theme.button}`}
							aria-label={`Edit reminder for ${item.company}`}
						>
							<Pencil size={18} className={theme.label} />
						</button>
						<button
							onClick={() => toggleReminder(item.id, item.completed)}
							className={`rounded-lg p-2 transition-colors ${theme.button}`}
							aria-label={
								item.completed
									? "Mark reminder as incomplete"
									: "Mark reminder as complete"
							}
						>
							<Bell size={18} className={theme.label} />
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<AppShell>
			<div className="space-y-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div>
						<h1 className="text-2xl font-semibold text-textMain">
							Reminder Center
						</h1>
						<p className="mt-1 text-sm text-textSoft">
							Manage follow-ups and stay on track
						</p>
					</div>
					<button
						onClick={() => setShowCreate(!showCreate)}
						className={primaryButtonClass}
					>
						<Plus size={16} />
						Add Reminder
					</button>
				</div>

				{isLoading && (
					<div
						className={`${shellPanelClass} flex items-center gap-3 p-6 text-textSoft`}
					>
						<Loader2 size={18} className="animate-spin text-primary" />
						Loading reminders...
					</div>
				)}

				{error && !isLoading && (
					<div className={`${shellPanelClass} space-y-4 p-6`}>
						<div className="flex items-start gap-3">
							<AlertCircle className="mt-0.5 text-danger" size={20} />
							<div>
								<h2 className="text-lg font-semibold text-textMain">
									Couldn&apos;t load reminders
								</h2>
								<p className="mt-1 text-sm text-textSoft">{error}</p>
							</div>
						</div>
						<button onClick={load} className={primaryButtonClass}>
							<RefreshCw size={16} />
							Retry
						</button>
					</div>
				)}

				{showCreate && (
					<div className={`${shellPanelClass} p-5 sm:p-6`}>
						{/* Create reminder */}
						<div className="mb-4 flex items-center justify-between gap-4">
							<div>
								<h2 className="text-lg font-semibold text-textMain">
									Create Reminder
								</h2>
								<p className="mt-1 text-sm text-textSoft">
									Choose an application and reminder date.
								</p>
							</div>
							<button
								onClick={() => setShowCreate(false)}
								className="rounded-lg p-1 text-textSoft transition-colors hover:bg-surfaceAlt hover:text-textMain"
							>
								<X size={18} />
							</button>
						</div>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
							<label className="space-y-1 md:col-span-2">
								<span className="block text-xs font-medium text-textSoft">
									Application
								</span>
								<select
									value={applicationId}
									onChange={(e) => setApplicationId(e.target.value)}
									className={fieldClass}
								>
									{applications.map((app) => (
										<option key={app.id} value={app.id}>
											{app.company} - {app.roleTitle}
										</option>
									))}
								</select>
							</label>
							<label className="space-y-1">
								<span className="block text-xs font-medium text-textSoft">
									Date
								</span>
								<input
									type="date"
									value={reminderDate}
									onChange={(e) => setReminderDate(e.target.value)}
									className={fieldClass}
								/>
							</label>
							<label className="space-y-1">
								<span className="block text-xs font-medium text-textSoft">
									Type
								</span>
								<select
									value={reminderType}
									onChange={(e) =>
										setReminderType(e.target.value as ReminderType)
									}
									className={fieldClass}
								>
									{reminderTypes.map((value) => (
										<option key={value} value={value}>
											{value}
										</option>
									))}
								</select>
							</label>
							<div className="md:col-span-4">
								<button
									onClick={createReminder}
									className={`${primaryButtonClass} w-full md:w-auto`}
								>
									Create
								</button>
							</div>
						</div>
					</div>
				)}

				<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
					<div className="space-y-6 xl:col-span-2">
						{overdue.length > 0 && (
							<div className={`${shellPanelClass} p-5 sm:p-6`}>
								<div className="mb-4 flex items-center gap-2">
									<Clock className="text-danger" size={20} />
									<h2 className="text-lg font-semibold text-textMain">
										Overdue ({overdue.length})
									</h2>
								</div>
								<div className="space-y-3">
									{overdue.map((reminder) => (
										<ReminderCard
											key={reminder.id}
											item={reminder}
											color="red"
											label="Overdue"
											onEdit={openEditReminder}
										/>
									))}
								</div>
							</div>
						)}

						{today.length > 0 && (
							<div className={`${shellPanelClass} p-5 sm:p-6`}>
								<div className="mb-4 flex items-center gap-2">
									<Bell className="text-warning" size={20} />
									<h2 className="text-lg font-semibold text-textMain">
										Today ({today.length})
									</h2>
								</div>
								<div className="space-y-3">
									{today.map((reminder) => (
										<ReminderCard
											key={reminder.id}
											item={reminder}
											color="amber"
											label="Due today"
											onEdit={openEditReminder}
										/>
									))}
								</div>
							</div>
						)}

						{tomorrow.length > 0 && (
							<div className={`${shellPanelClass} p-5 sm:p-6`}>
								<div className="mb-4 flex items-center gap-2">
									<CalendarIcon className="text-info" size={20} />
									<h2 className="text-lg font-semibold text-textMain">
										Tomorrow ({tomorrow.length})
									</h2>
								</div>
								<div className="space-y-3">
									{tomorrow.map((reminder) => (
										<ReminderCard
											key={reminder.id}
											item={reminder}
											color="blue"
											onEdit={openEditReminder}
										/>
									))}
								</div>
							</div>
						)}

						{later.length > 0 && (
							<div className={`${shellPanelClass} p-5 sm:p-6`}>
								<h2 className="mb-4 text-lg font-semibold text-textMain">
									Upcoming ({later.length})
								</h2>
								<div className="space-y-3">
									{later.map((reminder) => (
										<div
											key={reminder.id}
											className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-surface sm:flex-row sm:items-center sm:justify-between"
										>
											<div className="flex items-center gap-4">
												<div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-surfaceAlt text-textSoft">
													<p className="text-lg font-semibold">
														{format(parseISO(reminder.reminderDate), "d")}
													</p>
													<p className="text-xs font-medium">
														{format(parseISO(reminder.reminderDate), "MMM")}
													</p>
												</div>
												<div className="flex-1">
													<p className="font-medium text-textMain">
														{reminder.company}
													</p>
													<p className="text-sm text-textSoft">
														{reminder.roleTitle}
													</p>
													<div className="mt-1 flex flex-wrap items-center gap-2">
														<span className="text-xs text-textSoft">
															{reminder.reminderType}
														</span>
														<span className="text-xs text-textSoft">
															•{" "}
															{format(
																parseISO(reminder.reminderDate),
																"MMMM d, yyyy",
															)}
														</span>
													</div>
												</div>
											</div>
											<button
												onClick={() =>
													toggleReminder(reminder.id, reminder.completed)
												}
												className="rounded-lg p-2 text-textSoft transition-colors hover:bg-surfaceAlt hover:text-textMain"
											>
												<Bell size={18} />
											</button>
											<button
												onClick={() => openEditReminder(reminder)}
												className="rounded-lg p-2 text-textSoft transition-colors hover:bg-surfaceAlt hover:text-textMain"
												aria-label={`Edit reminder for ${reminder.company}`}
											>
												<Pencil size={18} />
											</button>
										</div>
									))}
								</div>
							</div>
						)}

						{!isLoading && !error && active.length === 0 && (
							<div className={`${shellPanelClass} p-6`}>
								<div className="py-12 text-center">
									<CalendarIcon
										className="mx-auto mb-3 text-textSoft"
										size={48}
									/>
									<p className="text-textMain">No upcoming reminders</p>
									<p className="mt-1 text-sm text-textSoft">
										Set follow-up dates for your applications
									</p>
								</div>
							</div>
						)}

						<div className={`${shellPanelClass} p-5 sm:p-6`}>
							<h2 className="mb-4 text-lg font-semibold text-textMain">
								Auto-Reminder Rules
							</h2>
							<p className="mb-4 text-sm text-textSoft">
								Automatically create reminders based on application status
							</p>
							<div className="space-y-3">
								{[
									{
										title: "Follow-up reminder",
										desc: "3 days after applying with no response",
										on: true,
									},
									{
										title: "Interview reminder",
										desc: "1 day before scheduled interview",
										on: true,
									},
									{
										title: "Recruiter callback reminder",
										desc: "7 days after last contact",
										on: false,
									},
								].map((rule) => (
									<div
										key={rule.title}
										className="flex flex-col gap-3 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
									>
										<div>
											<p className="text-sm font-medium text-textMain">
												{rule.title}
											</p>
											<p className="text-xs text-textSoft">{rule.desc}</p>
										</div>
										<label className="relative inline-flex cursor-pointer items-center">
											<input
												type="checkbox"
												className="peer sr-only"
												defaultChecked={rule.on}
												onChange={
													rule.title === "Follow-up reminder"
														? generatePresets
														: undefined
												}
											/>
											<div className="peer h-6 w-11 rounded-full border border-border bg-surface transition after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-white after:transition-all peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:bg-primary peer-checked:after:translate-x-full" />
										</label>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div className={`${shellPanelClass} p-5 sm:p-6`}>
							<h2 className="mb-4 text-lg font-semibold text-textMain">
								Calendar Integration
							</h2>
							<div className="space-y-3">
								<button className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface p-3 transition-colors hover:bg-surfaceAlt">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-semibold text-white">
											G
										</div>
										<div className="text-left">
											<p className="text-sm font-medium text-textMain">
												Google Calendar
											</p>
											<p className="text-xs text-textSoft">Connected</p>
										</div>
									</div>
									<div className="h-2 w-2 rounded-full bg-success" />
								</button>

								<button className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface p-3 transition-colors hover:bg-surfaceAlt">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary font-semibold text-white">
											O
										</div>
										<div className="text-left">
											<p className="text-sm font-medium text-textMain">
												Outlook Calendar
											</p>
											<p className="text-xs text-textSoft">Not connected</p>
										</div>
									</div>
									<span className="text-xs font-medium text-primary">
										Connect
									</span>
								</button>

								<button
									onClick={exportICS}
									className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface p-3 transition-colors hover:bg-surfaceAlt"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mutedSurface text-textMain">
											<CalendarIcon size={18} />
										</div>
										<div className="text-left">
											<p className="text-sm font-medium text-textMain">
												Export ICS
											</p>
											<p className="text-xs text-textSoft">
												Download calendar file
											</p>
										</div>
									</div>
									<Download size={18} className="text-textSoft" />
								</button>
							</div>
						</div>
					</div>
				</div>

				{editingReminder && (
					<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
						<div
							className={`${shellPanelClass} max-h-[90vh] w-full max-w-2xl overflow-hidden`}
						>
							<div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
								<div>
									<p className="text-xs font-medium uppercase tracking-wide text-textSoft">
										Edit reminder
									</p>
									<h2 className="mt-1 text-lg font-semibold text-textMain">
										{editingReminder.company}
									</h2>
									<p className="text-sm text-textSoft">
										{editingReminder.roleTitle}
									</p>
								</div>
								<button
									onClick={closeEditReminder}
									className="rounded-lg p-1 text-textSoft transition-colors hover:bg-surfaceAlt hover:text-textMain"
									disabled={isEditSaving}
								>
									<X size={18} />
								</button>
							</div>
							<div className="max-h-[calc(90vh-6rem)] overflow-y-auto p-5 sm:p-6">
								{editError && (
									<div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
										{editError}
									</div>
								)}
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<label className="space-y-1">
										<span className="block text-xs font-medium text-textSoft">
											Reminder date
										</span>
										<input
											type="date"
											value={editReminderDate}
											onChange={(e) => setEditReminderDate(e.target.value)}
											className={fieldClass}
											disabled={isEditSaving}
										/>
									</label>
									<label className="space-y-1">
										<span className="block text-xs font-medium text-textSoft">
											Reminder type
										</span>
										<select
											value={editReminderType}
											onChange={(e) =>
												setEditReminderType(e.target.value as ReminderType)
											}
											className={fieldClass}
											disabled={isEditSaving}
										>
											{reminderTypes.map((value) => (
												<option key={value} value={value}>
													{value}
												</option>
											))}
										</select>
									</label>
									<label className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 md:col-span-2">
										<input
											type="checkbox"
											checked={editReminderCompleted}
											onChange={(e) =>
												setEditReminderCompleted(e.target.checked)
											}
											className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
											disabled={isEditSaving}
										/>
										<div>
											<p className="text-sm font-medium text-textMain">
												Completed
											</p>
											<p className="text-xs text-textSoft">
												Mark this reminder as done or reopen it.
											</p>
										</div>
									</label>
								</div>
								<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
									<button
										onClick={closeEditReminder}
										className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-textMain transition-colors hover:bg-surfaceAlt"
										disabled={isEditSaving}
									>
										Cancel
									</button>
									<button
										onClick={saveEditedReminder}
										className={`${primaryButtonClass} ${isEditSaving ? "opacity-70" : ""}`}
										disabled={isEditSaving}
									>
										{isEditSaving ? (
											<>
												<Loader2 size={16} className="animate-spin" />
												Saving...
											</>
										) : (
											"Save changes"
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</AppShell>
	);
}
