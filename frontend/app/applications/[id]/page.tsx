"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/applications/status-badge";
import { formatDate } from "@/lib/utils/date";
import { ApplicationRecord } from "@/types/application";
import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	DollarSign,
	ExternalLink,
	FileText,
	Loader2,
	Mail,
	Phone,
	RefreshCw,
} from "lucide-react";

type ReminderSummary = {
	id: string;
	reminderDate: string;
	reminderType: string;
	completed: boolean;
};

const panelClass = "rounded-2xl border border-border bg-card shadow-sm";
const neutralButtonClass =
	"inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-textMain transition-colors hover:bg-surfaceAlt";
const primaryButtonClass =
	"inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primaryHover";

export default function ApplicationDetailPage() {
	const params = useParams<{ id: string }>();
	const [application, setApplication] = useState<ApplicationRecord | null>(
		null,
	);
	const [reminders, setReminders] = useState<ReminderSummary[]>([]);
	const [pageState, setPageState] = useState<
		"loading" | "ready" | "not-found" | "error"
	>("loading");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		let cancelled = false;

		async function loadDetails() {
			if (!params.id) {
				setPageState("not-found");
				return;
			}

			setPageState("loading");
			setErrorMessage("");
			setApplication(null);
			setReminders([]);

			try {
				const response = await fetch(`/api/applications/${params.id}`);

				if (response.status === 404) {
					if (!cancelled) {
						setPageState("not-found");
					}
					return;
				}

				if (!response.ok) {
					throw new Error("Unable to load application details.");
				}

				const data = (await response.json()) as ApplicationRecord;

				if (cancelled) {
					return;
				}

				setApplication(data);
				setPageState("ready");

				fetch("/api/reminders")
					.then((remindersResponse) => remindersResponse.json())
					.then(
						(
							items: Array<{
								id: string;
								reminderDate: string;
								reminderType: string;
								completed: boolean;
								applicationId: string;
							}>,
						) => {
							if (!cancelled) {
								setReminders(
									items.filter((item) => item.applicationId === params.id),
								);
							}
						},
					)
					.catch(() => {
						if (!cancelled) {
							setReminders([]);
						}
					});
			} catch {
				if (!cancelled) {
					setErrorMessage("We couldn\'t load this application right now.");
					setPageState("error");
				}
			}
		}

		void loadDetails();

		return () => {
			cancelled = true;
		};
	}, [params.id]);

	if (pageState === "loading") {
		return (
			<AppShell>
				<div
					className={`${panelClass} flex items-center gap-3 p-6 text-textSoft`}
				>
					<Loader2 size={18} className="animate-spin text-primary" />
					Loading application details...
				</div>
			</AppShell>
		);
	}

	if (pageState === "error") {
		return (
			<AppShell>
				<div className={`${panelClass} space-y-4 p-6`}>
					<div className="flex items-start gap-3">
						<AlertCircle className="mt-0.5 text-danger" size={20} />
						<div>
							<h1 className="text-lg font-semibold text-textMain">
								Couldn&apos;t load application
							</h1>
							<p className="mt-1 text-sm text-textSoft">{errorMessage}</p>
						</div>
					</div>
					<div className="flex flex-col gap-2 sm:flex-row">
						<button
							onClick={() => window.location.reload()}
							className={primaryButtonClass}
						>
							<RefreshCw size={16} />
							Retry
						</button>
						<Link href="/applications" className={neutralButtonClass}>
							<ArrowLeft size={16} />
							Back to Applications
						</Link>
					</div>
				</div>
			</AppShell>
		);
	}

	if (pageState === "not-found") {
		return (
			<AppShell>
				<div className={`${panelClass} space-y-4 p-6`}>
					<div className="flex items-start gap-3">
						<AlertCircle className="mt-0.5 text-textSoft" size={20} />
						<div>
							<h1 className="text-lg font-semibold text-textMain">
								Application not found
							</h1>
							<p className="mt-1 text-sm text-textSoft">
								The requested application does not exist or was removed.
							</p>
						</div>
					</div>
					<Link href="/applications" className={neutralButtonClass}>
						<ArrowLeft size={16} />
						Back to Applications
					</Link>
				</div>
			</AppShell>
		);
	}

	if (!application) {
		return null;
	}

	return (
		<AppShell>
			<div className="space-y-6">
				<div className="space-y-4">
					<Link
						href="/applications"
						className="inline-flex items-center gap-2 text-sm font-medium text-textSoft transition-colors hover:text-primary"
					>
						<ArrowLeft size={16} />
						Back to Applications
					</Link>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div>
							<h1 className="text-2xl font-semibold text-textMain">
								{application.company}
							</h1>
							<p className="mt-1 text-lg text-textSoft">
								{application.roleTitle}
							</p>
							<div className="mt-3 flex flex-wrap items-center gap-2">
								<StatusBadge status={application.finalStatus} size="md" />
								{application.applicationLink && (
									<a
										href={application.applicationLink}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primaryHover"
									>
										View posting
										<ExternalLink size={14} />
									</a>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
					<div className="space-y-6 xl:col-span-2">
						<div className={`${panelClass} p-5 sm:p-6`}>
							<h2 className="mb-4 text-lg font-semibold text-textMain">
								Application Details
							</h2>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="rounded-xl bg-surface px-4 py-3">
									<p className="text-xs font-semibold uppercase tracking-[0.18em] text-textSoft">
										Location
									</p>
									<p className="mt-2 text-sm font-medium text-textMain">
										{application.location || "—"}
									</p>
								</div>
								<div className="rounded-xl bg-surface px-4 py-3">
									<p className="text-xs font-semibold uppercase tracking-[0.18em] text-textSoft">
										Date Applied
									</p>
									<p className="mt-2 text-sm font-medium text-textMain">
										{formatDate(application.dateApplied)}
									</p>
								</div>
								<div className="rounded-xl bg-surface px-4 py-3">
									<p className="text-xs font-semibold uppercase tracking-[0.18em] text-textSoft">
										Days Since Apply
									</p>
									<p className="mt-2 text-sm font-medium text-textMain">
										{application.daysSinceApply} days
									</p>
								</div>
								{application.salary && (
									<div className="rounded-xl bg-surface px-4 py-3">
										<p className="text-xs font-semibold uppercase tracking-[0.18em] text-textSoft">
											Salary
										</p>
										<p className="mt-2 text-sm font-medium text-textMain">
											{application.salary}
										</p>
									</div>
								)}
								{application.nextFollowUp && (
									<div className="rounded-xl bg-surface px-4 py-3">
										<p className="text-xs font-semibold uppercase tracking-[0.18em] text-textSoft">
											Next Follow-up
										</p>
										<p className="mt-2 text-sm font-medium text-textMain">
											{formatDate(application.nextFollowUp)}
										</p>
									</div>
								)}
								{application.source && (
									<div className="rounded-xl bg-surface px-4 py-3">
										<p className="text-xs font-semibold uppercase tracking-[0.18em] text-textSoft">
											Source
										</p>
										<p className="mt-2 text-sm font-medium text-textMain">
											{application.source}
										</p>
									</div>
								)}
							</div>
						</div>

						<div className={`${panelClass} p-5 sm:p-6`}>
							<h2 className="mb-4 text-lg font-semibold text-textMain">
								Interview Stages
							</h2>
							<div className="space-y-3">
								{[
									{
										num: 1,
										label: "Screen",
										desc: "Initial recruiter screen",
										status: application.step1Status,
									},
									{
										num: 2,
										label: "Technical",
										desc: "Technical interview round",
										status: application.step2Status,
									},
									{
										num: 3,
										label: "Final",
										desc: "Final round interview",
										status: application.step3Status,
									},
								].map((stage) => (
									<div
										key={stage.num}
										className="flex flex-col gap-3 rounded-xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
									>
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card font-semibold text-textMain">
												{stage.num}
											</div>
											<div>
												<p className="font-medium text-textMain">
													{stage.label}
												</p>
												<p className="text-xs text-textSoft">{stage.desc}</p>
											</div>
										</div>
										<StatusBadge status={stage.status} size="md" />
									</div>
								))}
							</div>
						</div>

						<div className={`${panelClass} p-5 sm:p-6`}>
							<div className="mb-4 flex items-center gap-2">
								<FileText className="text-textSoft" size={20} />
								<h2 className="text-lg font-semibold text-textMain">Notes</h2>
							</div>
							{application.notes ? (
								<p className="text-sm leading-relaxed text-textSoft">
									{application.notes}
								</p>
							) : (
								<p className="text-sm italic text-textSoft">
									No notes added yet
								</p>
							)}
						</div>

						<div className={`${panelClass} p-5 sm:p-6`}>
							<h2 className="mb-4 text-lg font-semibold text-textMain">
								Timeline
							</h2>
							<div className="space-y-4">
								<div className="flex gap-4">
									<div className="flex flex-col items-center">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-surfaceAlt text-info">
											<Calendar size={16} />
										</div>
										<div className="mt-2 h-full w-0.5 bg-border" />
									</div>
									<div className="flex-1 pb-4">
										<p className="text-sm font-medium text-textMain">
											Application Submitted
										</p>
										<p className="mt-1 text-xs text-textSoft">
											{formatDate(application.dateApplied)}
										</p>
									</div>
								</div>

								{application.step1Status === "Passed" && (
									<div className="flex gap-4">
										<div className="flex flex-col items-center">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-surfaceAlt text-success">
												<Calendar size={16} />
											</div>
											<div className="mt-2 h-full w-0.5 bg-border" />
										</div>
										<div className="flex-1 pb-4">
											<p className="text-sm font-medium text-textMain">
												Screen Passed
											</p>
											<p className="mt-1 text-xs text-textSoft">
												Advanced to next round
											</p>
										</div>
									</div>
								)}

								{reminders.map((reminder) => (
									<div key={reminder.id} className="flex gap-4">
										<div className="flex flex-col items-center">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-surfaceAlt text-warning">
												<Calendar size={16} />
											</div>
										</div>
										<div className="flex-1 pb-4">
											<p className="text-sm font-medium text-textMain">
												{reminder.reminderType}
											</p>
											<p className="mt-1 text-xs text-textSoft">
												{formatDate(reminder.reminderDate)} —{" "}
												{reminder.completed ? "Completed" : "Pending"}
											</p>
										</div>
									</div>
								))}

								{application.nextFollowUp && (
									<div className="flex gap-4">
										<div className="flex flex-col items-center">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-surfaceAlt text-warning">
												<Calendar size={16} />
											</div>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-textMain">
												Follow-up Scheduled
											</p>
											<p className="mt-1 text-xs text-textSoft">
												{formatDate(application.nextFollowUp)}
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div className={`${panelClass} p-5 sm:p-6`}>
							<h2 className="mb-4 text-lg font-semibold text-textMain">
								Contact
							</h2>
							{application.contactPerson || application.contactInfo ? (
								<div className="space-y-3">
									{application.contactPerson && (
										<div>
											<p className="mb-1 text-xs text-textSoft">
												Contact Person
											</p>
											<p className="text-sm font-medium text-textMain">
												{application.contactPerson}
											</p>
										</div>
									)}
									{application.contactInfo && (
										<div>
											<p className="mb-1 text-xs text-textSoft">Contact Info</p>
											<div className="flex items-center gap-2">
												{application.contactInfo.includes("@") ? (
													<>
														<Mail size={14} className="text-textSoft" />
														<a
															href={`mailto:${application.contactInfo}`}
															className="text-sm font-medium text-primary transition-colors hover:text-primaryHover"
														>
															{application.contactInfo}
														</a>
													</>
												) : (
													<>
														<Phone size={14} className="text-textSoft" />
														<a
															href={`tel:${application.contactInfo}`}
															className="text-sm font-medium text-primary transition-colors hover:text-primaryHover"
														>
															{application.contactInfo}
														</a>
													</>
												)}
											</div>
										</div>
									)}
								</div>
							) : (
								<p className="text-sm italic text-textSoft">
									No contact information added
								</p>
							)}
						</div>

						{application.salary && (
							<div className={`${panelClass} p-5 sm:p-6`}>
								<div className="mb-4 flex items-center gap-2">
									<DollarSign className="text-success" size={20} />
									<h2 className="text-lg font-semibold text-textMain">
										Compensation
									</h2>
								</div>
								<p className="text-2xl font-semibold text-textMain">
									{application.salary}
								</p>
							</div>
						)}

						<div className={`${panelClass} p-5 sm:p-6`}>
							<h2 className="mb-4 text-lg font-semibold text-textMain">
								Quick Actions
							</h2>
							<div className="flex flex-col gap-2">
								<Link href="/reminders" className={primaryButtonClass}>
									Set Reminder
								</Link>
								<button className={neutralButtonClass}>Add Note</button>
								<button className={neutralButtonClass}>Update Status</button>
							</div>
						</div>

						<div className={`${panelClass} p-5 sm:p-6`}>
							<h2 className="mb-4 text-lg font-semibold text-textMain">
								Attachments
							</h2>
							<div className="space-y-2 py-6 text-center">
								<FileText className="mx-auto text-textSoft" size={32} />
								<p className="text-sm text-textSoft">No attachments</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AppShell>
	);
}
