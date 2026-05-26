import { FinalStatus, StepStatus } from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";

type StatusInput = {
	step1Status: StepStatus;
	step2Status: StepStatus;
	step3Status: StepStatus;
	dateApplied: Date;
};

export function getDaysSinceApply(dateApplied: Date): number {
	return Math.max(differenceInCalendarDays(new Date(), dateApplied), 0);
}

export function computeFinalStatus(input: StatusInput): FinalStatus {
	const { step1Status, step2Status, step3Status, dateApplied } = input;
	const steps = [step1Status, step2Status, step3Status];
	const daysSinceApply = getDaysSinceApply(dateApplied);

	if (steps.includes(StepStatus.Rejected)) {
		return FinalStatus.Rejected;
	}

	if (steps.every((step) => step === StepStatus.Passed)) {
		return FinalStatus.OFFER;
	}

	if (steps.some((step) => step === StepStatus.Passed)) {
		return FinalStatus.Interviewing;
	}

	return daysSinceApply >= 30 ? FinalStatus.Ghosted : FinalStatus.Applied;
}

export function statusColorClass(status: StepStatus | FinalStatus): string {
	switch (status) {
		case StepStatus.Passed:
			return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
		case StepStatus.Pending:
			return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
		case StepStatus.Rejected:
		case FinalStatus.Rejected:
			return "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30";
		case FinalStatus.Ghosted:
			return "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30";
		case FinalStatus.OFFER:
			return "bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border-yellow-500/30";
		case FinalStatus.Interviewing:
			return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30";
		case FinalStatus.Applied:
		default:
			return "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30";
	}
}
