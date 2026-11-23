import type { Application, Reminder } from "@prisma/client";
import { ReminderType, StepStatus } from "@prisma/client";
import { addDays } from "date-fns";
import { normalizeStepStatus, parseRFC4180CSV } from "@/lib/csv";
import { toApplicationRecord, toReminderRecord } from "@/lib/mappers";
import { buildApplicationsCSV, buildDashboardSummary } from "@/lib/reports";
import { computeFinalStatus } from "@/lib/status/status";
import { buildReminderICS } from "@/services/calendar/ics";
import { calendarIntegrationStubs } from "@/services/calendar/ics";
import { emailIntegrationStubs } from "@/services/email/provider";
import {
	createId,
	DEMO_USER,
	DEMO_USER_ID,
	loadDB,
	saveDB,
	type DemoDB,
} from "./store";

// In-browser stand-in for the Next.js API routes, used by the static demo.
// Responses mirror the shapes returned by app/api/**/route.ts.

type Body = Record<string, unknown>;

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

function notFound(what: string) {
	return json({ error: `${what} not found` }, 404);
}

function file(content: string, type: string, filename: string) {
	return new Response(content, {
		status: 200,
		headers: {
			"Content-Type": type,
			"Content-Disposition": `attachment; filename=${filename}`,
		},
	});
}

function optionalString(value: unknown) {
	return value ? String(value) : null;
}

function validDate(value: unknown) {
	const date = new Date(String(value));
	return Number.isNaN(date.getTime()) ? null : date;
}

function stepStatus(value: unknown, fallback: StepStatus) {
	return value === undefined || value === null || value === ""
		? fallback
		: normalizeStepStatus(String(value));
}

function withFinalStatus(app: Application): Application {
	return { ...app, finalStatus: computeFinalStatus(app) };
}

function byDate<T>(get: (item: T) => Date, direction: "asc" | "desc" = "asc") {
	const sign = direction === "asc" ? 1 : -1;
	return (a: T, b: T) => sign * (get(a).getTime() - get(b).getTime());
}

function remindersWithApp(db: DemoDB, reminders: Reminder[]) {
	const apps = new Map(db.applications.map((app) => [app.id, app]));
	return reminders.flatMap((reminder) => {
		const application = apps.get(reminder.applicationId);
		return application ? [{ ...reminder, application }] : [];
	});
}

function listApplications(db: DemoDB, params: URLSearchParams) {
	const query = (params.get("q") ?? "").toLowerCase();
	const status = params.get("status") ?? "all";
	const sortBy = params.get("sortBy") ?? "dateApplied";
	const direction = params.get("sortDirection") === "asc" ? 1 : -1;

	const matches = db.applications.filter((app) => {
		if (status !== "all" && app.finalStatus !== status) {
			return false;
		}
		if (!query) {
			return true;
		}
		return [app.company, app.roleTitle, app.location, app.source].some(
			(value) => value?.toLowerCase().includes(query),
		);
	});

	const key = (
		["company", "roleTitle", "createdAt", "dateApplied"].includes(sortBy)
			? sortBy
			: "dateApplied"
	) as "company" | "roleTitle" | "createdAt" | "dateApplied";

	matches.sort((a, b) => {
		const left = a[key];
		const right = b[key];
		const result =
			left instanceof Date && right instanceof Date
				? left.getTime() - right.getTime()
				: String(left).localeCompare(String(right));
		return direction * result;
	});

	return json(matches.map(toApplicationRecord));
}

function createApplication(db: DemoDB, body: Body) {
	const company = String(body.company ?? "").trim();
	const roleTitle = String(body.roleTitle ?? "").trim();
	const dateApplied = validDate(body.dateApplied);
	if (!company || !roleTitle || !dateApplied) {
		return json(
			{ error: "Company, role title and a valid date applied are required." },
			400,
		);
	}

	const now = new Date();
	const application = withFinalStatus({
		id: createId(),
		userId: DEMO_USER_ID,
		company,
		roleTitle,
		location: optionalString(body.location),
		applicationLink: optionalString(body.applicationLink),
		dateApplied,
		contactPerson: optionalString(body.contactPerson),
		contactInfo: optionalString(body.contactInfo),
		salary: optionalString(body.salary),
		step1Status: stepStatus(body.step1Status, StepStatus.Pending),
		step2Status: stepStatus(body.step2Status, StepStatus.Pending),
		step3Status: stepStatus(body.step3Status, StepStatus.Pending),
		finalStatus: "Applied",
		nextFollowUp: body.nextFollowUp ? validDate(body.nextFollowUp) : null,
		notes: optionalString(body.notes),
		source: optionalString(body.source),
		createdAt: now,
		updatedAt: now,
	});

	db.applications.push(application);
	saveDB(db);
	return json(toApplicationRecord(application), 201);
}

const textFields = [
	"company",
	"roleTitle",
	"location",
	"applicationLink",
	"contactPerson",
	"contactInfo",
	"salary",
	"notes",
	"source",
] as const;

function updateApplication(db: DemoDB, id: string, body: Body) {
	const index = db.applications.findIndex((app) => app.id === id);
	if (index === -1) {
		return notFound("Application");
	}

	const existing = db.applications[index];
	const updated: Application = { ...existing, updatedAt: new Date() };

	for (const field of textFields) {
		if (body[field] !== undefined) {
			const value = String(body[field]);
			if (field === "company" || field === "roleTitle") {
				updated[field] = value;
			} else {
				updated[field] = value || null;
			}
		}
	}

	if (body.dateApplied) {
		updated.dateApplied = validDate(body.dateApplied) ?? existing.dateApplied;
	}
	if (body.nextFollowUp !== undefined) {
		updated.nextFollowUp = body.nextFollowUp
			? validDate(body.nextFollowUp)
			: null;
	}
	updated.step1Status = stepStatus(body.step1Status, existing.step1Status);
	updated.step2Status = stepStatus(body.step2Status, existing.step2Status);
	updated.step3Status = stepStatus(body.step3Status, existing.step3Status);

	db.applications[index] = withFinalStatus(updated);
	saveDB(db);
	return json(toApplicationRecord(db.applications[index]));
}

function deleteApplication(db: DemoDB, id: string) {
	if (!db.applications.some((app) => app.id === id)) {
		return notFound("Application");
	}
	db.applications = db.applications.filter((app) => app.id !== id);
	db.reminders = db.reminders.filter((r) => r.applicationId !== id);
	saveDB(db);
	return json({ success: true });
}

function listReminders(db: DemoDB) {
	const sorted = [...db.reminders].sort(byDate((r) => r.reminderDate));
	return json(
		remindersWithApp(db, sorted).map(({ application, ...reminder }) => ({
			...toReminderRecord(reminder),
			company: application.company,
			roleTitle: application.roleTitle,
		})),
	);
}

function isReminderType(value: unknown): value is ReminderType {
	return Object.values(ReminderType).includes(value as ReminderType);
}

function createReminder(db: DemoDB, body: Body) {
	if (!db.applications.some((app) => app.id === body.applicationId)) {
		return notFound("Application");
	}
	const reminderDate = validDate(body.reminderDate);
	if (!reminderDate || !isReminderType(body.reminderType)) {
		return json({ error: "Please provide a valid date and type." }, 400);
	}

	const reminder: Reminder = {
		id: createId(),
		applicationId: String(body.applicationId),
		reminderDate,
		reminderType: body.reminderType,
		completed: false,
		createdAt: new Date(),
	};
	db.reminders.push(reminder);
	saveDB(db);
	return json(toReminderRecord(reminder), 201);
}

function generateAutoReminders(db: DemoDB) {
	const presets = [
		[ReminderType.FollowUp3Days, 3],
		[ReminderType.FollowUp7Days, 7],
		[ReminderType.FollowUp14Days, 14],
		[ReminderType.Ghosted30Days, 30],
	] as const;

	for (const app of db.applications) {
		for (const [reminderType, days] of presets) {
			const id = `${app.id}-${reminderType}`;
			const reminderDate = addDays(app.dateApplied, days);
			const existing = db.reminders.find((r) => r.id === id);
			if (existing) {
				existing.reminderDate = reminderDate;
			} else {
				db.reminders.push({
					id,
					applicationId: app.id,
					reminderDate,
					reminderType,
					completed: false,
					createdAt: new Date(),
				});
			}
		}
	}
	saveDB(db);
	return json({ success: true });
}

function updateReminder(db: DemoDB, id: string, body: Body, complete: boolean) {
	const reminder = db.reminders.find((r) => r.id === id);
	const application = db.applications.find(
		(app) => app.id === reminder?.applicationId,
	);
	if (!reminder || !application) {
		return notFound("Reminder");
	}

	if (complete) {
		reminder.completed = body.completed === undefined ? true : Boolean(body.completed);
		saveDB(db);
		return json({ id: reminder.id, completed: reminder.completed });
	}

	if (body.reminderDate) {
		const date = validDate(body.reminderDate);
		if (!date) {
			return json({ error: "Please provide a valid reminder date." }, 400);
		}
		reminder.reminderDate = date;
	}
	if (isReminderType(body.reminderType)) {
		reminder.reminderType = body.reminderType;
	}
	if (body.completed !== undefined) {
		reminder.completed = Boolean(body.completed);
	}
	saveDB(db);
	return json({
		...toReminderRecord(reminder),
		company: application.company,
		roleTitle: application.roleTitle,
	});
}

function importCSV(db: DemoDB, body: Body) {
	const parsed = parseRFC4180CSV(String(body.csvData ?? ""));
	const summary = { created: 0, skipped: 0, errors: [...parsed.errors] };

	parsed.rows.forEach((row, index) => {
		const lineNumber = index + 2;
		const dateApplied = validDate(row.dateApplied);
		if (!row.company || !row.roleTitle || !row.dateApplied) {
			summary.skipped += 1;
			summary.errors.push({
				lineNumber,
				reason:
					"Missing required fields: company, roleTitle, and/or dateApplied",
			});
			return;
		}
		if (!dateApplied) {
			summary.skipped += 1;
			summary.errors.push({
				lineNumber,
				reason: `Invalid dateApplied: "${row.dateApplied}" is not a valid date`,
			});
			return;
		}
		if (row.nextFollowUp && !validDate(row.nextFollowUp)) {
			summary.skipped += 1;
			summary.errors.push({
				lineNumber,
				reason: `Invalid nextFollowUp: "${row.nextFollowUp}" is not a valid date`,
			});
			return;
		}

		const now = new Date();
		db.applications.push(
			withFinalStatus({
				id: createId(),
				userId: DEMO_USER_ID,
				company: row.company,
				roleTitle: row.roleTitle,
				location: row.location || null,
				applicationLink: row.applicationLink || null,
				dateApplied,
				contactPerson: row.contactPerson || null,
				contactInfo: row.contactInfo || null,
				salary: row.salary || null,
				step1Status: normalizeStepStatus(row.step1Status),
				step2Status: normalizeStepStatus(row.step2Status),
				step3Status: normalizeStepStatus(row.step3Status),
				finalStatus: "Applied",
				nextFollowUp: row.nextFollowUp ? validDate(row.nextFollowUp) : null,
				notes: row.notes || null,
				source: row.source || null,
				createdAt: now,
				updatedAt: now,
			}),
		);
		summary.created += 1;
	});

	saveDB(db);
	return json(summary);
}

function dashboard(db: DemoDB) {
	const applications = [...db.applications].sort(byDate((a) => a.dateApplied));
	const upcoming = remindersWithApp(
		db,
		db.reminders
			.filter((r) => !r.completed)
			.sort(byDate((r) => r.reminderDate))
			.slice(0, 8),
	);
	return json(buildDashboardSummary(applications, upcoming));
}

export async function handleDemoRequest(
	method: string,
	path: string,
	params: URLSearchParams,
	body: Body,
): Promise<Response> {
	// Refresh derived statuses (e.g. Ghosted after 30 days) on every request.
	const db = loadDB();
	db.applications = db.applications.map(withFinalStatus);

	const segments = path.replace(/^\/api\//, "").split("/").filter(Boolean);
	const [resource, id, action] = segments;
	const route = `${method} ${resource}${id ? "/:id" : ""}${action ? `/${action}` : ""}`;

	switch (route) {
		case "GET auth/:id":
			return id === "me" ? json({ user: DEMO_USER }) : notFound("Route");
		case "POST auth/:id":
			return json(id === "login" ? { user: DEMO_USER } : { success: true });

		case "GET applications":
			return listApplications(db, params);
		case "POST applications":
			return createApplication(db, body);
		case "GET applications/:id": {
			const app = db.applications.find((item) => item.id === id);
			return app ? json(toApplicationRecord(app)) : notFound("Application");
		}
		case "PUT applications/:id":
			return updateApplication(db, id, body);
		case "DELETE applications/:id":
			return deleteApplication(db, id);

		case "GET reminders":
			return listReminders(db);
		case "POST reminders":
			return createReminder(db, body);
		case "PUT reminders":
			return generateAutoReminders(db);
		case "PATCH reminders/:id":
			return updateReminder(db, id, body, false);
		case "PATCH reminders/:id/complete":
			return updateReminder(db, id, body, true);

		case "GET dashboard":
			return dashboard(db);
		case "POST import/:id":
			return importCSV(db, body);
		case "GET export/:id": {
			if (id === "csv") {
				const apps = [...db.applications].sort(
					byDate((a) => a.dateApplied, "desc"),
				);
				return file(
					buildApplicationsCSV(apps),
					"text/csv",
					"applications-export.csv",
				);
			}
			const reminders = remindersWithApp(
				db,
				db.reminders
					.filter((r) => !r.completed)
					.sort(byDate((r) => r.reminderDate)),
			);
			return file(
				buildReminderICS(reminders),
				"text/calendar",
				"jobs-tracker-reminders.ics",
			);
		}
		case "GET integrations/:id":
			return json(
				id === "email"
					? {
							gmail: await emailIntegrationStubs.gmail.scanInbox(),
							outlook: await emailIntegrationStubs.outlook.scanInbox(),
						}
					: {
							google: await calendarIntegrationStubs.google.syncReminders(),
							outlook: await calendarIntegrationStubs.outlook.syncReminders(),
							ics: { connected: true },
						},
			);
		default:
			return json({ error: "Not available in the demo" }, 404);
	}
}
