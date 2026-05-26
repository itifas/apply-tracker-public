import { FinalStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { format } from "date-fns";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth/server";

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

	const total = applications.length;
	const interviewing = applications.filter(
		(item) => item.finalStatus === FinalStatus.Interviewing,
	).length;
	const rejected = applications.filter(
		(item) => item.finalStatus === FinalStatus.Rejected,
	).length;
	const offers = applications.filter(
		(item) => item.finalStatus === FinalStatus.OFFER,
	).length;
	const ghosted = applications.filter(
		(item) => item.finalStatus === FinalStatus.Ghosted,
	).length;

	const byMonthMap = applications.reduce<Record<string, number>>((acc, app) => {
		const key = format(app.dateApplied, "yyyy-MM");
		acc[key] = (acc[key] ?? 0) + 1;
		return acc;
	}, {});

	const pipeline = [
		{
			name: "Applied",
			value: applications.filter((a) => a.finalStatus === FinalStatus.Applied)
				.length,
		},
		{ name: "Interviewing", value: interviewing },
		{ name: "Offer", value: offers },
		{ name: "Rejected", value: rejected },
		{ name: "Ghosted", value: ghosted },
	];

	const activity = applications
		.slice(-6)
		.reverse()
		.map((app) => ({
			id: app.id,
			company: app.company,
			roleTitle: app.roleTitle,
			finalStatus: app.finalStatus,
			createdAt: app.createdAt.toISOString(),
		}));

	return NextResponse.json({
		metrics: {
			totalApplications: total,
			interviewing,
			rejected,
			offers,
			ghosted,
			successRate:
				total === 0 ? 0 : Number(((offers / total) * 100).toFixed(1)),
		},
		charts: {
			pipeline,
			applicationsOverTime: Object.entries(byMonthMap).map(
				([month, count]) => ({ month, count }),
			),
			ghostedTrend: Object.entries(byMonthMap).map(([month]) => ({
				month,
				count: applications.filter(
					(app) =>
						format(app.dateApplied, "yyyy-MM") === month &&
						app.finalStatus === FinalStatus.Ghosted,
				).length,
			})),
		},
		upcomingReminders: reminders.map((reminder) => ({
			id: reminder.id,
			company: reminder.application.company,
			roleTitle: reminder.application.roleTitle,
			reminderDate: reminder.reminderDate.toISOString(),
			reminderType: reminder.reminderType,
		})),
		recentActivity: activity,
	});
}
