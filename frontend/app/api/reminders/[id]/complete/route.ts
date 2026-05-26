import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth/server";

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
		select: { id: true },
	});
	if (!reminder) {
		return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
	}

	const updated = await prisma.reminder.update({
		where: { id: reminder.id },
		data: { completed: body.completed ?? true },
	});

	return NextResponse.json({
		id: updated.id,
		completed: updated.completed,
	});
}
