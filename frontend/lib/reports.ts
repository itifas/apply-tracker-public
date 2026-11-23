import { Application, FinalStatus, ReminderType } from "@prisma/client";
import { format } from "date-fns";
import { getDaysSinceApply } from "@/lib/status/status";

// Shared by the API routes and the browser demo so both return the same data.

function escapeCSVField(value: string): string {
	if (/[",\r\n]/.test(value)) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

const csvHeaders = [
	"id",
	"company",
	"roleTitle",
	"location",
	"applicationLink",
	"dateApplied",
	"daysSinceApply",
	"contactPerson",
	"contactInfo",
	"salary",
	"step1Status",
	"step2Status",
	"step3Status",
	"finalStatus",
	"nextFollowUp",
	"notes",
	"source",
	"createdAt",
	"updatedAt",
];

export function buildApplicationsCSV(applications: Application[]): string {
	const rows = applications.map((app) =>
		[
			app.id,
			app.company,
			app.roleTitle,
			app.location ?? "",
			app.applicationLink ?? "",
			app.dateApplied.toISOString(),
			getDaysSinceApply(app.dateApplied).toString(),
			app.contactPerson ?? "",
			app.contactInfo ?? "",
			app.salary ?? "",
			app.step1Status,
			app.step2Status,
			app.step3Status,
			app.finalStatus,
			app.nextFollowUp?.toISOString() ?? "",
			app.notes ?? "",
			app.source ?? "",
			app.createdAt.toISOString(),
			app.updatedAt.toISOString(),
		]
			.map(escapeCSVField)
			.join(","),
	);

	return [csvHeaders.map(escapeCSVField).join(","), ...rows].join("\n");
}

type UpcomingReminder = {
	id: string;
	reminderDate: Date;
	reminderType: ReminderType;
	application: { company: string; roleTitle: string };
};

// `applications` must be sorted by dateApplied ascending.
export function buildDashboardSummary(
	applications: Application[],
	upcomingReminders: UpcomingReminder[],
) {
	const countStatus = (status: FinalStatus) =>
		applications.filter((item) => item.finalStatus === status).length;

	const total = applications.length;
	const interviewing = countStatus(FinalStatus.Interviewing);
	const rejected = countStatus(FinalStatus.Rejected);
	const offers = countStatus(FinalStatus.OFFER);
	const ghosted = countStatus(FinalStatus.Ghosted);

	const byMonth = new Map<string, { count: number; ghosted: number }>();
	for (const app of applications) {
		const key = format(app.dateApplied, "yyyy-MM");
		const entry = byMonth.get(key) ?? { count: 0, ghosted: 0 };
		entry.count += 1;
		if (app.finalStatus === FinalStatus.Ghosted) {
			entry.ghosted += 1;
		}
		byMonth.set(key, entry);
	}

	return {
		metrics: {
			totalApplications: total,
			interviewing,
			rejected,
			offers,
			ghosted,
			successRate:
				total === 0 ? 0 : Number(((offers / total) * 100).toFixed(1)),
		},
		charts: {
			pipeline: [
				{ name: "Applied", value: countStatus(FinalStatus.Applied) },
				{ name: "Interviewing", value: interviewing },
				{ name: "Offer", value: offers },
				{ name: "Rejected", value: rejected },
				{ name: "Ghosted", value: ghosted },
			],
			applicationsOverTime: Array.from(byMonth, ([month, entry]) => ({
				month,
				count: entry.count,
			})),
			ghostedTrend: Array.from(byMonth, ([month, entry]) => ({
				month,
				count: entry.ghosted,
			})),
		},
		upcomingReminders: upcomingReminders.map((reminder) => ({
			id: reminder.id,
			company: reminder.application.company,
			roleTitle: reminder.application.roleTitle,
			reminderDate: reminder.reminderDate.toISOString(),
			reminderType: reminder.reminderType,
		})),
		recentActivity: applications
			.slice(-6)
			.reverse()
			.map((app) => ({
				id: app.id,
				company: app.company,
				roleTitle: app.roleTitle,
				finalStatus: app.finalStatus,
				createdAt: app.createdAt.toISOString(),
			})),
	};
}
