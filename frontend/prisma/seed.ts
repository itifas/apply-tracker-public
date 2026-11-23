import { PrismaClient, ReminderType } from "@prisma/client";
import { subDays } from "date-fns";
import { hashPassword } from "../lib/auth/password";
import { computeFinalStatus } from "../lib/status/status";
import { getSampleApplications } from "../lib/sample-data";

const prisma = new PrismaClient();

async function main() {
	const username = (process.env.SEED_USERNAME ?? "it").trim().toLowerCase();
	const email = process.env.SEED_EMAIL?.trim().toLowerCase() || null;
	const password = process.env.SEED_PASSWORD ?? "change-me-now";
	const fullName = process.env.SEED_FULL_NAME ?? "IT";
	const passwordHash = await hashPassword(password);

	const user = await prisma.user.upsert({
		where: { username },
		update: {
			email,
			fullName,
			passwordHash,
		},
		create: {
			username,
			email,
			fullName,
			passwordHash,
		},
	});

	await prisma.reminder.deleteMany();
	await prisma.application.deleteMany();
	await prisma.calendarConnection.deleteMany();
	await prisma.emailConnection.deleteMany();

	const appInputs = getSampleApplications();

	for (const appInput of appInputs) {
		const finalStatus = computeFinalStatus({
			step1Status: appInput.step1Status,
			step2Status: appInput.step2Status,
			step3Status: appInput.step3Status,
			dateApplied: appInput.dateApplied,
		});

		const created = await prisma.application.create({
			data: {
				...appInput,
				userId: user.id,
				finalStatus,
				nextFollowUp: subDays(new Date(), -3),
			},
		});

		await prisma.reminder.createMany({
			data: [
				{
					applicationId: created.id,
					reminderDate: subDays(appInput.dateApplied, -3),
					reminderType: ReminderType.FollowUp3Days,
					completed: false,
				},
				{
					applicationId: created.id,
					reminderDate: subDays(appInput.dateApplied, -7),
					reminderType: ReminderType.FollowUp7Days,
					completed: false,
				},
			],
		});
	}

	await prisma.calendarConnection.create({
		data: {
			provider: "ICS",
			syncEnabled: true,
		},
	});

	await prisma.emailConnection.createMany({
		data: [
			{ provider: "Gmail", accountEmail: "you@gmail.com", syncEnabled: false },
			{
				provider: "Outlook",
				accountEmail: "you@outlook.com",
				syncEnabled: false,
			},
		],
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		// eslint-disable-next-line no-console
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});
