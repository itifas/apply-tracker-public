import { Application, Reminder } from "@prisma/client";
import { getDaysSinceApply } from "./status/status";
import { ApplicationRecord, ReminderRecord } from "@/types/application";

export function toApplicationRecord(
	application: Application,
): ApplicationRecord {
	return {
		id: application.id,
		company: application.company,
		roleTitle: application.roleTitle,
		location: application.location,
		applicationLink: application.applicationLink,
		contactPerson: application.contactPerson,
		contactInfo: application.contactInfo,
		salary: application.salary,
		step1Status: application.step1Status,
		step2Status: application.step2Status,
		step3Status: application.step3Status,
		finalStatus: application.finalStatus,
		notes: application.notes,
		source: application.source,
		daysSinceApply: getDaysSinceApply(application.dateApplied),
		dateApplied: application.dateApplied.toISOString(),
		nextFollowUp: application.nextFollowUp?.toISOString() ?? null,
		createdAt: application.createdAt.toISOString(),
		updatedAt: application.updatedAt.toISOString(),
	};
}

export function toReminderRecord(reminder: Reminder): ReminderRecord {
	return {
		...reminder,
		reminderDate: reminder.reminderDate.toISOString(),
		createdAt: reminder.createdAt.toISOString(),
	};
}
