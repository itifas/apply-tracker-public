import { ReminderType } from "@prisma/client";
import { addDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toReminderRecord } from "@/lib/mappers";
import { getCurrentUserId } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function GET() {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const reminders = await prisma.reminder.findMany({
		where: { application: { userId } },
		include: { application: true },
		orderBy: { reminderDate: "asc" },
	});

	return NextResponse.json(
		reminders.map((reminder) => ({
			...toReminderRecord(reminder),
			company: reminder.application.company,
			roleTitle: reminder.application.roleTitle,
		})),
	);
}

export async function POST(request: NextRequest) {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const application = await prisma.application.findFirst({
		where: { id: body.applicationId, userId },
		select: { id: true },
	});
	if (!application) {
		return NextResponse.json(
			{ error: "Application not found" },
			{ status: 404 },
		);
	}

	const reminder = await prisma.reminder.create({
		data: {
			applicationId: application.id,
			reminderDate: new Date(body.reminderDate),
			reminderType: body.reminderType,
			completed: false,
		},
	});

	return NextResponse.json(toReminderRecord(reminder), { status: 201 });
}

export async function PUT() {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const applications = await prisma.application.findMany({ where: { userId } });

	for (const app of applications) {
		const presets: Array<{ reminderType: ReminderType; days: number }> = [
			{ reminderType: ReminderType.FollowUp3Days, days: 3 },
			{ reminderType: ReminderType.FollowUp7Days, days: 7 },
			{ reminderType: ReminderType.FollowUp14Days, days: 14 },
			{ reminderType: ReminderType.Ghosted30Days, days: 30 },
		];

		for (const preset of presets) {
			const reminderDate = addDays(app.dateApplied, preset.days);
			await prisma.reminder.upsert({
				where: {
					id: `${app.id}-${preset.reminderType}`,
				},
				create: {
					id: `${app.id}-${preset.reminderType}`,
					applicationId: app.id,
					reminderDate,
					reminderType: preset.reminderType,
					completed: false,
				},
				update: { reminderDate },
			});
		}
	}

	return NextResponse.json({ success: true });
}
