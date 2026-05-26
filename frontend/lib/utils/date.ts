import { format, isValid, parseISO } from "date-fns";

export function formatDate(date: Date | string | null | undefined): string {
	if (!date) {
		return "-";
	}

	const parsed = typeof date === "string" ? parseISO(date) : date;
	if (!isValid(parsed)) {
		return "-";
	}

	return format(parsed, "MMM d, yyyy");
}
