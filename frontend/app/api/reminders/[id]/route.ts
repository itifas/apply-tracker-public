import { ReminderType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { toReminderRecord } from "@/lib/mappers";

export const dynamic = "force-dynamic";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const reminder = await prisma.reminder.findFirst({
		where: { id: params.id, application: { userId } },
		include: { application: true },
	});

	if (!reminder) {
		return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
	}

	const reminderDate = body.reminderDate
		? new Date(body.reminderDate)
		: reminder.reminderDate;
	if (body.reminderDate && Number.isNaN(reminderDate.getTime())) {
		return NextResponse.json(
			{ error: "Please provide a valid reminder date." },
			{ status: 400 },
		);
	}

	const reminderType = body.reminderType as ReminderType | undefined;
	const updated = await prisma.reminder.update({
		where: { id: reminder.id },
		data: {
			reminderDate,
			...(reminderType ? { reminderType } : {}),
			...(body.completed !== undefined
				? { completed: Boolean(body.completed) }
				: {}),
		},
	});

	return NextResponse.json({
		...toReminderRecord(updated),
		company: reminder.application.company,
		roleTitle: reminder.application.roleTitle,
	});
}
