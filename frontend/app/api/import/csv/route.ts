import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseRFC4180CSV, normalizeStepStatus } from "@/lib/csv";
import { computeFinalStatus } from "@/lib/status/status";
import { getCurrentUserId } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

interface ImportSummary {
	created: number;
	skipped: number;
	errors: Array<{ lineNumber: number; reason: string }>;
}

function isValidDate(dateString: string): boolean {
	if (!dateString) return false;
	const date = new Date(dateString);
	return !isNaN(date.getTime());
}

export async function POST(request: NextRequest) {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const csvData: string = body.csvData ?? "";
	const parseResult = parseRFC4180CSV(csvData);

	const summary: ImportSummary = {
		created: 0,
		skipped: 0,
		errors: [...parseResult.errors],
	};

	for (let i = 0; i < parseResult.rows.length; i++) {
		const row = parseResult.rows[i];
		const lineNumber = i + 2; // +1 for header, +1 for 1-indexing

		// Validate required fields
		if (!row.company || !row.roleTitle || !row.dateApplied) {
			summary.skipped += 1;
			summary.errors.push({
				lineNumber,
				reason: "Missing required fields: company, roleTitle, and/or dateApplied",
			});
			continue;
		}

		// Validate dateApplied
		if (!isValidDate(row.dateApplied)) {
			summary.skipped += 1;
			summary.errors.push({
				lineNumber,
				reason: `Invalid dateApplied: "${row.dateApplied}" is not a valid date`,
			});
			continue;
		}

		// Validate nextFollowUp if provided
		if (row.nextFollowUp && !isValidDate(row.nextFollowUp)) {
			summary.skipped += 1;
			summary.errors.push({
				lineNumber,
				reason: `Invalid nextFollowUp: "${row.nextFollowUp}" is not a valid date`,
			});
			continue;
		}

		try {
			const dateApplied = new Date(row.dateApplied);
			const step1Status = normalizeStepStatus(row.step1Status);
			const step2Status = normalizeStepStatus(row.step2Status);
			const step3Status = normalizeStepStatus(row.step3Status);

			await prisma.application.create({
				data: {
					userId,
					company: row.company,
					roleTitle: row.roleTitle,
					location: row.location || null,
					applicationLink: row.applicationLink || null,
					dateApplied,
					contactPerson: row.contactPerson || null,
					contactInfo: row.contactInfo || null,
					salary: row.salary || null,
					step1Status,
					step2Status,
					step3Status,
					finalStatus: computeFinalStatus({
						step1Status,
						step2Status,
						step3Status,
						dateApplied,
					}),
					notes: row.notes || null,
					source: row.source || null,
					nextFollowUp: row.nextFollowUp ? new Date(row.nextFollowUp) : null,
				},
			});

			summary.created += 1;
		} catch (error) {
			summary.skipped += 1;
			summary.errors.push({
				lineNumber,
				reason: `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
			});
		}
	}

	return NextResponse.json(summary);
}
