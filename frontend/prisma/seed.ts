import { PrismaClient, ReminderType, StepStatus } from "@prisma/client";
import { subDays } from "date-fns";
import { hashPassword } from "../lib/auth/password";
import { computeFinalStatus } from "../lib/status/status";

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

	const appInputs = [
		{
			company: "Microsoft",
			roleTitle: "Software Engineering Intern",
			location: "Redmond, WA",
			applicationLink: "https://careers.microsoft.com",
			dateApplied: subDays(new Date(), 5),
			contactPerson: "Taylor Reed",
			contactInfo: "taylor.reed@microsoft.com",
			salary: "$42/hr",
			step1Status: StepStatus.Passed,
			step2Status: StepStatus.Pending,
			step3Status: StepStatus.Pending,
			notes: "Phone screen completed.",
			source: "LinkedIn",
		},
		{
			company: "Google",
			roleTitle: "SWE Intern",
			location: "Mountain View, CA",
			applicationLink: "https://careers.google.com",
			dateApplied: subDays(new Date(), 12),
			contactPerson: "Avery Kim",
			contactInfo: "avery.kim@google.com",
			salary: "$48/hr",
			step1Status: StepStatus.Passed,
			step2Status: StepStatus.Passed,
			step3Status: StepStatus.Passed,
			notes: "Final round done.",
			source: "Referral",
		},
		{
			company: "Amazon",
			roleTitle: "Applied Scientist Intern",
			location: "Seattle, WA",
			applicationLink: "https://www.amazon.jobs",
			dateApplied: subDays(new Date(), 9),
			contactPerson: "Morgan Lee",
			contactInfo: "morgan.lee@amazon.com",
			salary: "$46/hr",
			step1Status: StepStatus.Rejected,
			step2Status: StepStatus.Pending,
			step3Status: StepStatus.Pending,
			notes: "Rejected after OA.",
			source: "Company Site",
		},
		{
			company: "Stripe",
			roleTitle: "Backend Intern",
			location: "Remote",
			applicationLink: "https://stripe.com/jobs",
			dateApplied: subDays(new Date(), 31),
			contactPerson: "Jordan Miles",
			contactInfo: "jordan.miles@stripe.com",
			salary: "$55/hr",
			step1Status: StepStatus.Pending,
			step2Status: StepStatus.Pending,
			step3Status: StepStatus.Pending,
			notes: "No updates yet.",
			source: "AngelList",
		},
		{
			company: "Meta",
			roleTitle: "Data Engineering Intern",
			location: "Menlo Park, CA",
			applicationLink: "https://www.metacareers.com",
			dateApplied: subDays(new Date(), 2),
			contactPerson: "Chris Patel",
			contactInfo: "chris.patel@meta.com",
			salary: "$52/hr",
			step1Status: StepStatus.Pending,
			step2Status: StepStatus.Pending,
			step3Status: StepStatus.Pending,
			notes: "Applied recently.",
			source: "Handshake",
		},
		{
			company: "Airbnb",
			roleTitle: "Full Stack Intern",
			location: "San Francisco, CA",
			applicationLink: "https://careers.airbnb.com",
			dateApplied: subDays(new Date(), 18),
			contactPerson: "Nina Chen",
			contactInfo: "nina.chen@airbnb.com",
			salary: "$50/hr",
			step1Status: StepStatus.Passed,
			step2Status: StepStatus.Passed,
			step3Status: StepStatus.Pending,
			notes: "Waiting for final panel.",
			source: "LinkedIn",
		},
	];

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
