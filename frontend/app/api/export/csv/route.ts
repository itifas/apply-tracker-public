import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDaysSinceApply } from "@/lib/status/status";
import { getCurrentUserId } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

// Escape CSV field according to RFC 4180
function escapeCSVField(value: string): string {
	if (/[",\r\n]/.test(value)) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

export async function GET() {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const applications = await prisma.application.findMany({
		where: { userId },
		orderBy: { dateApplied: "desc" },
	});

	const headers = [
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
		].map(escapeCSVField).join(","),
	);

	const csv = [headers.map(escapeCSVField).join(","), ...rows].join("\n");

	return new NextResponse(csv, {
		status: 200,
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": "attachment; filename=applications-export.csv",
		},
	});
}
