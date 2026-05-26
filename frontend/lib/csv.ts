import { StepStatus } from "@prisma/client";

type CSVRow = Record<string, string>;

export interface CSVParseResult {
	rows: CSVRow[];
	errors: Array<{ lineNumber: number; reason: string }>;
}

// RFC 4180 compliant CSV parser with proper quoted field handling
function parseCSVLine(line: string): string[] {
	const fields: string[] = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		const nextChar = line[i + 1];

		if (char === '"') {
			if (inQuotes && nextChar === '"') {
				// Escaped quote
				current += '"';
				i++; // Skip next quote
			} else {
				// Toggle quote state
				inQuotes = !inQuotes;
			}
		} else if (char === "," && !inQuotes) {
			// Unquoted comma = field separator
			fields.push(current.trim());
			current = "";
		} else {
			current += char;
		}
	}

	// Add final field
	fields.push(current.trim());
	return fields;
}

export function parseSimpleCSV(input: string): CSVRow[] {
	const result = parseRFC4180CSV(input);
	return result.rows;
}

export function parseRFC4180CSV(input: string): CSVParseResult {
	const lines = input.trim().split(/\r?\n/);
	if (lines.length < 2) {
		return { rows: [], errors: [] };
	}

	const headers = parseCSVLine(lines[0]);
	const rows: CSVRow[] = [];
	const errors: Array<{ lineNumber: number; reason: string }> = [];

	for (let i = 1; i < lines.length; i++) {
		try {
			const values = parseCSVLine(lines[i]);
			const row = headers.reduce<CSVRow>((acc, header, index) => {
				acc[header] = values[index] ?? "";
				return acc;
			}, {});
			rows.push(row);
		} catch (err) {
			errors.push({
				lineNumber: i + 1, // 1-indexed
				reason: `CSV parsing error: ${err instanceof Error ? err.message : "Unknown error"}`,
			});
		}
	}

	return { rows, errors };
}

export function normalizeStepStatus(value: string): StepStatus {
	if (value === StepStatus.Passed) {
		return StepStatus.Passed;
	}

	if (value === StepStatus.Rejected) {
		return StepStatus.Rejected;
	}

	return StepStatus.Pending;
}
