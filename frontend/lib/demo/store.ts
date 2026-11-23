import type { Application, Reminder } from "@prisma/client";
import { ReminderType } from "@prisma/client";
import { addDays } from "date-fns";
import { getSampleApplications } from "@/lib/sample-data";
import { computeFinalStatus } from "@/lib/status/status";
import { isDesktop } from "./config";

export const DEMO_USER_ID = "demo-user";
export const DEMO_USER = {
	id: DEMO_USER_ID,
	username: "demo",
	email: null,
	fullName: "Demo User",
};

const STORAGE_KEY = "apply-tracker-demo-v1";

export type DemoDB = {
	applications: Application[];
	reminders: Reminder[];
};

let memoryDB: DemoDB | null = null;

export function createId() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}
	return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

function seed(): DemoDB {
	if (isDesktop) {
		return { applications: [], reminders: [] };
	}

	const now = new Date();
	const applications: Application[] = [];
	const reminders: Reminder[] = [];

	for (const input of getSampleApplications(now)) {
		const application: Application = {
			id: createId(),
			userId: DEMO_USER_ID,
			...input,
			finalStatus: computeFinalStatus(input),
			nextFollowUp: addDays(now, 3),
			createdAt: input.dateApplied,
			updatedAt: input.dateApplied,
		};
		applications.push(application);

		for (const [days, reminderType] of [
			[3, ReminderType.FollowUp3Days],
			[7, ReminderType.FollowUp7Days],
		] as const) {
			reminders.push({
				id: createId(),
				applicationId: application.id,
				reminderDate: addDays(input.dateApplied, days),
				reminderType,
				completed: false,
				createdAt: now,
			});
		}
	}

	return { applications, reminders };
}

const dateKeys = new Set([
	"dateApplied",
	"nextFollowUp",
	"createdAt",
	"updatedAt",
	"reminderDate",
]);

function revive(key: string, value: unknown) {
	return dateKeys.has(key) && typeof value === "string"
		? new Date(value)
		: value;
}

export function loadDB(): DemoDB {
	if (memoryDB) {
		return memoryDB;
	}

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (raw) {
			memoryDB = JSON.parse(raw, revive) as DemoDB;
			return memoryDB;
		}
	} catch {
		// Storage unavailable or corrupt: fall back to fresh sample data.
	}

	memoryDB = seed();
	saveDB(memoryDB);
	return memoryDB;
}

export function saveDB(db: DemoDB) {
	memoryDB = db;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
	} catch {
		// Private mode or full storage: keep data in memory for this visit.
	}
}

export function resetDB() {
	memoryDB = null;
	try {
		window.localStorage.removeItem(STORAGE_KEY);
	} catch {
		// ignore
	}
}
