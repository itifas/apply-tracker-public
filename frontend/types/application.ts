import { FinalStatus, ReminderType, StepStatus } from "@prisma/client";

export type ApplicationRecord = {
	id: string;
	company: string;
	roleTitle: string;
	location: string | null;
	applicationLink: string | null;
	dateApplied: string;
	daysSinceApply: number;
	contactPerson: string | null;
	contactInfo: string | null;
	salary: string | null;
	step1Status: StepStatus;
	step2Status: StepStatus;
	step3Status: StepStatus;
	finalStatus: FinalStatus;
	nextFollowUp: string | null;
	notes: string | null;
	source: string | null;
	createdAt: string;
	updatedAt: string;
};

export type ReminderRecord = {
	id: string;
	applicationId: string;
	reminderDate: string;
	reminderType: ReminderType;
	completed: boolean;
	createdAt: string;
};

export type DashboardMetrics = {
	totalApplications: number;
	interviewing: number;
	rejected: number;
	offers: number;
	ghosted: number;
	successRate: number;
};
