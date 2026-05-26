import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildReminderICS } from "@/services/calendar/ics";
import { getCurrentUserId } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function GET() {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const reminders = await prisma.reminder.findMany({
		where: { completed: false, application: { userId } },
		include: {
			application: {
				select: {
					id: true,
					company: true,
					roleTitle: true,
					location: true,
					applicationLink: true,
					dateApplied: true,
					contactPerson: true,
					contactInfo: true,
					notes: true,
					finalStatus: true,
					step1Status: true,
					step2Status: true,
					step3Status: true,
				},
			},
		},
		orderBy: { reminderDate: "asc" },
	});

	const ics = buildReminderICS(reminders);

	return new NextResponse(ics, {
		status: 200,
		headers: {
			"Content-Type": "text/calendar",
			"Content-Disposition": "attachment; filename=jobs-tracker-reminders.ics",
		},
	});
}
