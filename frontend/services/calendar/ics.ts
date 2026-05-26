import { format } from "date-fns";

type ReminderWithApplication = {
	id: string;
	reminderDate: Date;
	reminderType: string;
	application: {
		id: string;
		company: string;
		roleTitle: string;
		location: string | null;
		applicationLink: string | null;
		dateApplied: Date;
		contactPerson: string | null;
		contactInfo: string | null;
		notes: string | null;
		finalStatus: string;
		step1Status: string;
		step2Status: string;
		step3Status: string;
	};
};

function escapeICS(value: string): string {
	return value
		.replace(/\\/g, "\\\\")
		.replace(/,/g, "\\,")
		.replace(/;/g, "\\;")
		.replace(/\n/g, "\\n");
}

export function buildReminderICS(reminders: ReminderWithApplication[]): string {
	const header = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Jobs Tracker//EN",
		"CALSCALE:GREGORIAN",
	];

	const body = reminders.map((reminder) => {
		const app = reminder.application;
		const start = format(new Date(reminder.reminderDate), "yyyyMMdd");
		const stamp = format(new Date(), "yyyyMMdd'T'HHmmss'X'");

		// Build summary: "Follow up: {company} — {roleTitle}"
		const summary = escapeICS(
			`Follow up: ${app.company} — ${app.roleTitle}`,
		);

		// Build rich description
		const descriptionParts: string[] = [
			`Company: ${app.company}`,
			`Role: ${app.roleTitle}`,
			`Reminder Type: ${reminder.reminderType}`,
			`Application Date: ${format(new Date(app.dateApplied), "yyyy-MM-dd")}`,
			`Final Status: ${app.finalStatus}`,
			`Step 1: ${app.step1Status}`,
			`Step 2: ${app.step2Status}`,
			`Step 3: ${app.step3Status}`,
		];

		if (app.applicationLink) {
			descriptionParts.push(`Application Link: ${app.applicationLink}`);
		}

		if (app.contactPerson) {
			descriptionParts.push(`Contact Person: ${app.contactPerson}`);
		}

		if (app.contactInfo) {
			descriptionParts.push(`Contact Info: ${app.contactInfo}`);
		}

		if (app.notes) {
			descriptionParts.push(`Notes: ${app.notes}`);
		}

		const description = escapeICS(descriptionParts.join("\n"));

		const eventLines = [
			"BEGIN:VEVENT",
			`UID:${reminder.id}@internship-tracker.local`,
			`DTSTAMP:${stamp}`,
			`DTSTART;VALUE=DATE:${start}`,
			`SUMMARY:${summary}`,
			`DESCRIPTION:${description}`,
		];

		if (app.location) {
			eventLines.push(`LOCATION:${escapeICS(app.location)}`);
		}

		eventLines.push("END:VEVENT");

		return eventLines.join("\r\n");
	});

	return [...header, ...body, "END:VCALENDAR"].join("\r\n");
}

export const calendarIntegrationStubs = {
	google: {
		// TODO: Add OAuth flow and token persistence for Google Calendar sync.
		async syncReminders() {
			return {
				connected: false,
				message: "Google Calendar integration is scaffolded only.",
			};
		},
	},
	outlook: {
		// TODO: Add Microsoft Graph OAuth and calendar write API integration.
		async syncReminders() {
			return {
				connected: false,
				message: "Outlook Calendar integration is scaffolded only.",
			};
		},
	},
};
