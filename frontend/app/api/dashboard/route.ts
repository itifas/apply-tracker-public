import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth/server";
import { buildDashboardSummary } from "@/lib/reports";

export const dynamic = "force-dynamic";

export async function GET() {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const applications = await prisma.application.findMany({
		where: { userId },
		orderBy: { dateApplied: "asc" },
	});
	const reminders = await prisma.reminder.findMany({
		where: { completed: false, application: { userId } },
		include: { application: true },
		orderBy: { reminderDate: "asc" },
		take: 8,
	});

	return NextResponse.json(buildDashboardSummary(applications, reminders));
}
