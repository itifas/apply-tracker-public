"use client";

import Link from "next/link";
import { FinalStatus, StepStatus } from "@prisma/client";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/applications/status-badge";
import { ConfirmationModal } from "@/components/feedback/confirmation-modal";
import { useToast } from "@/components/feedback/toast";
import { ApplicationRecord } from "@/types/application";
import { formatDate } from "@/lib/utils/date";
import {
	AlertCircle,
	Download,
	ExternalLink,
	Filter,
	Loader2,
	Pencil,
	Plus,
	RefreshCw,
	Trash2,
	Upload,
	X,
} from "lucide-react";

const shellPanelClass = "rounded-2xl border border-border bg-card shadow-sm";
const fieldClass =
	"w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const controlClass =
	"rounded-xl border border-border bg-surface px-4 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const neutralButtonClass =
	"inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-textMain transition-colors hover:bg-surfaceAlt";
const primaryButtonClass =
	"inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primaryHover";
const iconButtonClass =
	"inline-flex h-9 w-9 items-center justify-center rounded-lg text-textSoft transition-colors hover:bg-surface hover:text-textMain";

type ImportSummary = {
	created: number;
	skipped: number;
	errors?: Array<{ lineNumber: number; reason: string }>;
};

type EditApplicationForm = {
	company: string;
	roleTitle: string;
	location: string;
	applicationLink: string;
	dateApplied: string;
	contactPerson: string;
	contactInfo: string;
	salary: string;
	source: string;
	notes: string;
};

function toDateInputValue(value: string | null) {
	return value ? value.slice(0, 10) : "";
}

export function ApplicationsView() {
	const toast = useToast();
	const [applications, setApplications] = useState<ApplicationRecord[]>([]);
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState("all");
	const [sortBy, setSortBy] = useState("dateApplied");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const [showImport, setShowImport] = useState(false);
	const [csvInput, setCsvInput] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [applicationToDelete, setApplicationToDelete] =
		useState<ApplicationRecord | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [editingApplication, setEditingApplication] =
		useState<ApplicationRecord | null>(null);
	const [editForm, setEditForm] = useState<EditApplicationForm | null>(null);
	const [editError, setEditError] = useState<string | null>(null);
	const [isEditSaving, setIsEditSaving] = useState(false);

	const loadApplications = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const params = new URLSearchParams({
				q: query,
				status,
				sortBy,
				sortDirection,
			});
			const response = await fetch(`/api/applications?${params.toString()}`);

			if (!response.ok) {
				throw new Error("Unable to load applications.");
			}

			const data = await response.json();
			setApplications(Array.isArray(data) ? data : []);
		} catch {
			setApplications([]);
			setError("We couldn\'t load your applications right now.");
		} finally {
			setIsLoading(false);
		}
	}, [query, sortBy, sortDirection, status]);

	useEffect(() => {
		void loadApplications();
	}, [loadApplications]);

	const statusFilters = useMemo(
		() => ["all", ...Object.values(FinalStatus)],
		[],
	);

	function openEditApplication(app: ApplicationRecord) {
		setEditingApplication(app);
		setEditForm({
			company: app.company,
			roleTitle: app.roleTitle,
			location: app.location ?? "",
			applicationLink: app.applicationLink ?? "",
			dateApplied: toDateInputValue(app.dateApplied),
			contactPerson: app.contactPerson ?? "",
			contactInfo: app.contactInfo ?? "",
			salary: app.salary ?? "",
			source: app.source ?? "",
			notes: app.notes ?? "",
		});
		setEditError(null);
	}

	function closeEditApplication() {
		if (isEditSaving) {
			return;
		}

		setEditingApplication(null);
		setEditForm(null);
		setEditError(null);
	}

	function updateEditForm<K extends keyof EditApplicationForm>(
		key: K,
		value: EditApplicationForm[K],
	) {
		setEditForm((current) =>
			current ? { ...current, [key]: value } : current,
		);
	}

	async function saveEditedApplication(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!editingApplication || !editForm) {
			return;
		}

		if (!editForm.company.trim() || !editForm.roleTitle.trim()) {
			setEditError("Company and role title are required.");
			return;
		}

		if (!editForm.dateApplied) {
			setEditError("Date applied is required.");
			return;
		}

		setIsEditSaving(true);
		setEditError(null);

		try {
			const response = await fetch(
				`/api/applications/${editingApplication.id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(editForm),
				},
			);

			if (!response.ok) {
				throw new Error("Unable to save application.");
			}

			setEditingApplication(null);
			setEditForm(null);
			await loadApplications();
			toast.success("Application updated", {
				description: `${editForm.company.trim()} was saved.`,
			});
		} catch {
			setEditError("We couldn't save that application. Please try again.");
			toast.error("Update failed", {
				description: "We couldn't save that application. Please try again.",
			});
		} finally {
			setIsEditSaving(false);
		}
	}

	function requestDeleteApplication(app: ApplicationRecord) {
		setApplicationToDelete(app);
	}

	function closeDeleteConfirmation() {
		if (isDeleting) {
			return;
		}

		setApplicationToDelete(null);
	}

	async function confirmDeleteApplication() {
		if (!applicationToDelete) {
			return;
		}

		setIsDeleting(true);

		try {
			const response = await fetch(
				`/api/applications/${applicationToDelete.id}`,
				{ method: "DELETE" },
			);

			if (!response.ok) {
				throw new Error("Unable to delete application.");
			}

			const deletedCompany = applicationToDelete.company;
			setApplicationToDelete(null);
			await loadApplications();
			toast.success("Application deleted", {
				description: `${deletedCompany} was removed.`,
			});
		} catch {
			toast.error("Delete failed", {
				description: "We couldn't delete that application. Please try again.",
			});
		} finally {
			setIsDeleting(false);
		}
	}

	async function inlineUpdate(
		id: string,
		key: "step1Status" | "step2Status" | "step3Status",
		value: StepStatus,
	) {
		await fetch(`/api/applications/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ [key]: value }),
		});
		await loadApplications();
	}

	async function importCSV() {
		if (!csvInput.trim()) {
			toast.warning("No CSV data", {
				description: "Paste CSV rows before importing.",
			});
			return;
		}

		try {
			const response = await fetch("/api/import/csv", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ csvData: csvInput }),
			});

			if (!response.ok) {
				toast.error("Import failed", {
					description: "Please check your CSV format and try again.",
				});
				return;
			}

			const summary = (await response.json()) as ImportSummary;
			const rowErrors = summary.errors ?? [];
			const visibleErrors = rowErrors.slice(0, 5);
			const hasIssues = summary.skipped > 0 || rowErrors.length > 0;

			toast[hasIssues ? "warning" : "success"](
				hasIssues ? "Import completed with issues" : "Import complete",
				{
					description: (
						<div className="space-y-2">
							<div>
								<p>Created: {summary.created}</p>
								<p>Skipped: {summary.skipped}</p>
							</div>
							{visibleErrors.length > 0 && (
								<div>
									<p className="font-medium text-textMain">Row errors</p>
									<ul className="mt-1 list-disc space-y-1 pl-4">
										{visibleErrors.map((err) => (
											<li key={`${err.lineNumber}-${err.reason}`}>
												Line {err.lineNumber}: {err.reason}
											</li>
										))}
									</ul>
									{rowErrors.length > visibleErrors.length && (
										<p className="mt-1">
											... and {rowErrors.length - visibleErrors.length} more
											errors
										</p>
									)}
								</div>
							)}
						</div>
					),
					duration: hasIssues ? 9000 : 5000,
				},
			);

			setCsvInput("");
			setShowImport(false);
			await loadApplications();
		} catch {
			toast.error("Import failed", {
				description: "Please check your CSV format and try again.",
			});
		}
	}

	async function exportCSV() {
		const response = await fetch("/api/export/csv");
		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "applications-export.csv";
		a.click();
		URL.revokeObjectURL(url);
	}

	const hasData = !isLoading && !error && applications.length > 0;
	const isEmpty = !isLoading && !error && applications.length === 0;

	const renderStatusSelect = (
		app: ApplicationRecord,
		key: "step1Status" | "step2Status" | "step3Status",
		label: string,
		value: StepStatus,
	) => (
		<label className="space-y-1 text-left">
			<span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-textSoft">
				{label}
			</span>
			<select
				value={value}
				onChange={(e) =>
					inlineUpdate(app.id, key, e.target.value as StepStatus)
				}
				className={controlClass}
			>
				{Object.values(StepStatus).map((stepValue) => (
					<option key={stepValue} value={stepValue}>
						{stepValue}
					</option>
				))}
			</select>
		</label>
	);

	return (
		<AppShell>
			<div className="space-y-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div>
						<h1 className="text-2xl font-semibold text-textMain">
							Applications
						</h1>
						<p className="mt-1 text-sm text-textSoft">
							{applications.length} total applications
						</p>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
						<button
							onClick={() => setShowImport(!showImport)}
							className={neutralButtonClass}
						>
							<Upload size={16} />
							Import
						</button>
						<button onClick={exportCSV} className={neutralButtonClass}>
							<Download size={16} />
							Export
						</button>
						<Link href="/applications/new" className={primaryButtonClass}>
							<Plus size={16} />
							Add Application
						</Link>
					</div>
				</div>

				{showImport && (
					<div className={`${shellPanelClass} space-y-4 p-4 sm:p-6`}>
						<div className="flex items-start justify-between gap-3">
							<div>
								<h3 className="text-sm font-semibold text-textMain">
									Import CSV
								</h3>
								<p className="mt-1 text-sm text-textSoft">
									Paste CSV rows with a header row.
								</p>
							</div>
							<button
								onClick={() => setShowImport(false)}
								className="rounded-lg px-2 py-1 text-sm text-textSoft transition-colors hover:bg-surfaceAlt hover:text-textMain"
							>
								Close
							</button>
						</div>
						<textarea
							value={csvInput}
							onChange={(e) => setCsvInput(e.target.value)}
							placeholder="Paste CSV rows here including header"
							className="min-h-[120px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
						<div className="flex flex-col gap-2 sm:flex-row">
							<button onClick={importCSV} className={primaryButtonClass}>
								Import
							</button>
							<button
								onClick={() => setShowImport(false)}
								className={neutralButtonClass}
							>
								Cancel
							</button>
						</div>
					</div>
				)}

				<div className={`${shellPanelClass} space-y-4 p-4 sm:p-6`}>
					<div className="flex flex-col gap-3 lg:flex-row lg:items-center">
						<div className="flex-1">
							<input
								type="text"
								placeholder="Search by company, role, or location..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className={fieldClass}
							/>
						</div>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:items-center">
							<label className="flex items-center gap-2 text-sm text-textSoft">
								<Filter size={16} />
								<select
									value={status}
									onChange={(e) => setStatus(e.target.value)}
									className={controlClass}
								>
									{statusFilters.map((value) => (
										<option key={value} value={value}>
											{value === "all" ? "All Status" : value}
										</option>
									))}
								</select>
							</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className={controlClass}
							>
								<option value="dateApplied">Date Applied</option>
								<option value="company">Company</option>
								<option value="roleTitle">Role Title</option>
								<option value="createdAt">Created</option>
							</select>
							<select
								value={sortDirection}
								onChange={(e) =>
									setSortDirection(e.target.value as "asc" | "desc")
								}
								className={controlClass}
							>
								<option value="desc">Newest</option>
								<option value="asc">Oldest</option>
							</select>
						</div>
					</div>
				</div>

				{isLoading && (
					<div
						className={`${shellPanelClass} flex items-center gap-3 p-6 text-textSoft`}
					>
						<Loader2 size={18} className="animate-spin text-primary" />
						Loading applications...
					</div>
				)}

				{error && !isLoading && (
					<div className={`${shellPanelClass} flex flex-col gap-4 p-6`}>
						<div className="flex items-start gap-3">
							<AlertCircle className="mt-0.5 text-danger" size={20} />
							<div>
								<h3 className="text-sm font-semibold text-textMain">
									Couldn&apos;t load applications
								</h3>
								<p className="mt-1 text-sm text-textSoft">{error}</p>
							</div>
						</div>
						<button onClick={loadApplications} className={primaryButtonClass}>
							<RefreshCw size={16} />
							Retry
						</button>
					</div>
				)}

				{hasData && (
					<div className="space-y-3 md:hidden">
						{applications.map((app) => (
							<article key={app.id} className={`${shellPanelClass} p-4`}>
								<div className="flex items-start justify-between gap-3">
									<Link
										href={`/applications/${app.id}`}
										className="min-w-0 flex-1"
									>
										<p className="truncate text-base font-semibold text-textMain transition-colors hover:text-primary">
											{app.company}
										</p>
										<p className="mt-1 text-sm text-textSoft">
											{app.roleTitle}
										</p>
									</Link>
									<StatusBadge status={app.finalStatus} />
								</div>

								<div className="mt-4 grid grid-cols-2 gap-3 text-sm">
									<div className="rounded-xl bg-surface px-3 py-2">
										<p className="text-[10px] uppercase tracking-[0.18em] text-textSoft">
											Location
										</p>
										<p className="mt-1 text-textMain">{app.location || "—"}</p>
									</div>
									<div className="rounded-xl bg-surface px-3 py-2">
										<p className="text-[10px] uppercase tracking-[0.18em] text-textSoft">
											Applied
										</p>
										<p className="mt-1 text-textMain">
											{formatDate(app.dateApplied)}
										</p>
									</div>
									<div className="rounded-xl bg-surface px-3 py-2">
										<p className="text-[10px] uppercase tracking-[0.18em] text-textSoft">
											Days
										</p>
										<p className="mt-1 text-textMain">{app.daysSinceApply}</p>
									</div>
									<div className="rounded-xl bg-surface px-3 py-2">
										<p className="text-[10px] uppercase tracking-[0.18em] text-textSoft">
											Status
										</p>
										<p className="mt-1 text-textMain">{app.finalStatus}</p>
									</div>
								</div>

								<div className="mt-4 grid gap-3 sm:grid-cols-3">
									{renderStatusSelect(
										app,
										"step1Status",
										"Step 1",
										app.step1Status,
									)}
									{renderStatusSelect(
										app,
										"step2Status",
										"Step 2",
										app.step2Status,
									)}
									{renderStatusSelect(
										app,
										"step3Status",
										"Step 3",
										app.step3Status,
									)}
								</div>

								<div className="mt-4 flex flex-col gap-2 sm:flex-row">
									<Link
										href={`/applications/${app.id}`}
										className={neutralButtonClass}
									>
										Open details
									</Link>
									{app.applicationLink && (
										<a
											href={app.applicationLink}
											target="_blank"
											rel="noopener noreferrer"
											className={neutralButtonClass}
											title="Open application link"
											aria-label={`Open application link for ${app.company}`}
										>
											<ExternalLink size={16} />
											Posting
										</a>
									)}
									<button
										onClick={() => openEditApplication(app)}
										className={neutralButtonClass}
										title="Edit application"
										aria-label={`Edit ${app.company}`}
									>
										<Pencil size={16} />
										Edit
									</button>
									<button
										onClick={() => requestDeleteApplication(app)}
										className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-surfaceAlt"
										title="Delete application"
										aria-label={`Delete ${app.company}`}
									>
										<Trash2 size={16} />
										Delete
									</button>
								</div>
							</article>
						))}
					</div>
				)}

				{hasData && (
					<div className={`${shellPanelClass} hidden overflow-hidden md:block`}>
						<div className="overflow-x-auto">
							<table className="w-full min-w-[1200px] text-sm">
								<thead className="border-b border-border bg-surfaceAlt">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-textSoft">
											Company &amp; Role
										</th>
										<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-textSoft">
											Location
										</th>
										<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-textSoft">
											Date Applied
										</th>
										<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-textSoft">
											Days
										</th>
										<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-textSoft">
											Step 1
										</th>
										<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-textSoft">
											Step 2
										</th>
										<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-textSoft">
											Step 3
										</th>
										<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-textSoft">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-textSoft">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border">
									{applications.map((app) => (
										<tr
											key={app.id}
											className="transition-colors hover:bg-surface"
										>
											<td className="px-6 py-4">
												<Link
													href={`/applications/${app.id}`}
													className="block"
												>
													<p className="font-medium text-textMain transition-colors hover:text-primary">
														{app.company}
													</p>
													<p className="text-sm text-textSoft">
														{app.roleTitle}
													</p>
												</Link>
											</td>
											<td className="px-6 py-4 text-sm text-textSoft">
												{app.location || "—"}
											</td>
											<td className="px-6 py-4 text-sm text-textSoft">
												{formatDate(app.dateApplied)}
											</td>
											<td className="px-6 py-4 text-sm text-textSoft">
												{app.daysSinceApply}
											</td>
											<td className="px-6 py-4">
												<select
													value={app.step1Status}
													onChange={(e) =>
														inlineUpdate(
															app.id,
															"step1Status",
															e.target.value as StepStatus,
														)
													}
													className={controlClass}
												>
													{Object.values(StepStatus).map((stepValue) => (
														<option key={stepValue} value={stepValue}>
															{stepValue}
														</option>
													))}
												</select>
											</td>
											<td className="px-6 py-4">
												<select
													value={app.step2Status}
													onChange={(e) =>
														inlineUpdate(
															app.id,
															"step2Status",
															e.target.value as StepStatus,
														)
													}
													className={controlClass}
												>
													{Object.values(StepStatus).map((stepValue) => (
														<option key={stepValue} value={stepValue}>
															{stepValue}
														</option>
													))}
												</select>
											</td>
											<td className="px-6 py-4">
												<select
													value={app.step3Status}
													onChange={(e) =>
														inlineUpdate(
															app.id,
															"step3Status",
															e.target.value as StepStatus,
														)
													}
													className={controlClass}
												>
													{Object.values(StepStatus).map((stepValue) => (
														<option key={stepValue} value={stepValue}>
															{stepValue}
														</option>
													))}
												</select>
											</td>
											<td className="px-6 py-4">
												<StatusBadge status={app.finalStatus} />
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													{app.applicationLink && (
														<a
															href={app.applicationLink}
															target="_blank"
															rel="noopener noreferrer"
															className={iconButtonClass}
															title="Open application link"
															aria-label={`Open application link for ${app.company}`}
														>
															<ExternalLink size={16} />
														</a>
													)}
													<button
														onClick={() => openEditApplication(app)}
														className={iconButtonClass}
														title="Edit application"
														aria-label={`Edit ${app.company}`}
													>
														<Pencil size={16} />
													</button>
													<button
														onClick={() => requestDeleteApplication(app)}
														className={`${iconButtonClass} hover:text-danger`}
														title="Delete application"
														aria-label={`Delete ${app.company}`}
													>
														<Trash2 size={16} />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{isEmpty && (
					<div className={`${shellPanelClass} p-10 text-center`}>
						<p className="text-base font-medium text-textMain">
							No applications found
						</p>
						<p className="mt-1 text-sm text-textSoft">
							Try adjusting your filters or add a new application.
						</p>
						<div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
							<button onClick={loadApplications} className={neutralButtonClass}>
								<RefreshCw size={16} />
								Refresh
							</button>
							<Link href="/applications/new" className={primaryButtonClass}>
								<Plus size={16} />
								Add Application
							</Link>
						</div>
					</div>
				)}

				{editingApplication && editForm && (
					<div
						className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
						role="dialog"
						aria-modal="true"
						aria-labelledby="edit-application-title"
					>
						<div
							className={`${shellPanelClass} max-h-[90vh] w-full max-w-4xl overflow-hidden`}
						>
							<div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
								<div>
									<p className="text-xs font-medium uppercase tracking-wide text-textSoft">
										Edit application
									</p>
									<h2
										id="edit-application-title"
										className="mt-1 text-lg font-semibold text-textMain"
									>
										{editingApplication.company}
									</h2>
									<p className="text-sm text-textSoft">
										{editingApplication.roleTitle}
									</p>
								</div>
								<button
									type="button"
									onClick={closeEditApplication}
									className="rounded-lg p-1 text-textSoft transition-colors hover:bg-surfaceAlt hover:text-textMain"
									disabled={isEditSaving}
									aria-label="Close edit application"
								>
									<X size={18} />
								</button>
							</div>
							<form
								onSubmit={saveEditedApplication}
								className="max-h-[calc(90vh-6rem)] overflow-y-auto p-5 sm:p-6"
							>
								{editError && (
									<div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
										{editError}
									</div>
								)}
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<label className="space-y-1">
										<span className="block text-xs font-medium text-textSoft">
											Company
										</span>
										<input
											value={editForm.company}
											onChange={(event) =>
												updateEditForm("company", event.target.value)
											}
											required
											className={fieldClass}
											disabled={isEditSaving}
										/>
									</label>
									<label className="space-y-1">
										<span className="block text-xs font-medium text-textSoft">
											Role title
										</span>
										<input
											value={editForm.roleTitle}
											onChange={(event) =>
												updateEditForm("roleTitle", event.target.value)
											}
											required
											className={fieldClass}
											disabled={isEditSaving}
										/>
									</label>
									<label className="space-y-1">
										<span className="block text-xs font-medium text-textSoft">
											Location
										</span>
										<input
											value={editForm.location}
											onChange={(event) =>
												updateEditForm("location", event.target.value)
											}
											className={fieldClass}
											disabled={isEditSaving}
										/>
									</label>
									<label className="space-y-1">
										<span className="block text-xs font-medium text-textSoft">
											Application link
										</span>
										<input
											value={editForm.applicationLink}
											onChange={(event) =>
												updateEditForm("applicationLink", event.target.value)
											}
											className={fieldClass}
											disabled={isEditSaving}
										/>
									</label>
									<label className="space-y-1">
										<span className="block text-xs font-medium text-textSoft">
											Date applied
										</span>
										<input
											type="date"
											value={editForm.dateApplied}
											onChange={(event) =>
												updateEditForm("dateApplied", event.target.value)
											}
											required
											className={fieldClass}
											disabled={isEditSaving}
										/>
									</label>
									<label className="space-y-1">
										<span className="block text-xs font-medium text-textSoft">
											Contact person
										</span>
										<input
											value={editForm.contactPerson}
											onChange={(event) =>
												updateEditForm("contactPerson", event.target.value)
											}
											className={fieldClass}
											disabled={isEditSaving}
										/>
									</label>
									<label className="space-y-1">
										<span className="block text-xs font-medium text-textSoft">
											Contact info
										</span>
										<input
											value={editForm.contactInfo}
											onChange={(event) =>
												updateEditForm("contactInfo", event.target.value)
											}
											className={fieldClass}
											disabled={isEditSaving}
										/>
									</label>
									<label className="space-y-1">
										<span className="block text-xs font-medium text-textSoft">
											Salary
										</span>
										<input
											value={editForm.salary}
											onChange={(event) =>
												updateEditForm("salary", event.target.value)
											}
											className={fieldClass}
											disabled={isEditSaving}
										/>
									</label>
									<label className="space-y-1">
										<span className="block text-xs font-medium text-textSoft">
											Source
										</span>
										<input
											value={editForm.source}
											onChange={(event) =>
												updateEditForm("source", event.target.value)
											}
											className={fieldClass}
											disabled={isEditSaving}
										/>
									</label>
									<label className="space-y-1 md:col-span-2">
										<span className="block text-xs font-medium text-textSoft">
											Notes
										</span>
										<textarea
											value={editForm.notes}
											onChange={(event) =>
												updateEditForm("notes", event.target.value)
											}
											rows={4}
											className={fieldClass}
											disabled={isEditSaving}
										/>
									</label>
								</div>
								<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
									<button
										type="button"
										onClick={closeEditApplication}
										className={neutralButtonClass}
										disabled={isEditSaving}
									>
										Cancel
									</button>
									<button
										type="submit"
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
							</form>
						</div>
					</div>
				)}

				<ConfirmationModal
					isOpen={Boolean(applicationToDelete)}
					title="Delete application?"
					confirmLabel="Delete"
					isLoading={isDeleting}
					onCancel={closeDeleteConfirmation}
					onConfirm={confirmDeleteApplication}
				>
					This action cannot be undone.
				</ConfirmationModal>

				<div className={`${shellPanelClass} p-4 text-sm text-textSoft`}>
					Showing {applications.length} applications
				</div>
			</div>
		</AppShell>
	);
}
