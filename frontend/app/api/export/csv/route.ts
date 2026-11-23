import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth/server";
import { buildApplicationsCSV } from "@/lib/reports";

export const dynamic = "force-dynamic";

export async function GET() {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const applications = await prisma.application.findMany({
		where: { userId },
		orderBy: { dateApplied: "desc" },
	});

	return new NextResponse(buildApplicationsCSV(applications), {
		status: 200,
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": "attachment; filename=applications-export.csv",
		},
	});
}
