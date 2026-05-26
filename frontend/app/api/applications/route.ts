import { NextRequest, NextResponse } from "next/server";
import { StepStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { toApplicationRecord } from "@/lib/mappers";
import { computeFinalStatus } from "@/lib/status/status";
import { getCurrentUserId } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

const sortableFields = [
	"dateApplied",
	"company",
	"roleTitle",
	"createdAt",
] as const;

export async function GET(request: NextRequest) {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get("q") ?? "";
	const status = searchParams.get("status") ?? "all";
	const sortBy = searchParams.get("sortBy") as
		| (typeof sortableFields)[number]
		| null;
	const sortDirection =
		searchParams.get("sortDirection") === "asc" ? "asc" : "desc";

	const applications = await prisma.application.findMany({
		where: {
			userId,
			...(query
				? {
						OR: [
							{ company: { contains: query, mode: "insensitive" } },
							{ roleTitle: { contains: query, mode: "insensitive" } },
							{ location: { contains: query, mode: "insensitive" } },
							{ source: { contains: query, mode: "insensitive" } },
						],
					}
				: {}),
			...(status !== "all" ? { finalStatus: status as never } : {}),
		},
		orderBy: {
			[sortableFields.includes(sortBy ?? "dateApplied")
				? (sortBy ?? "dateApplied")
				: "dateApplied"]: sortDirection,
		},
	});

	return NextResponse.json(applications.map(toApplicationRecord));
}

export async function POST(request: NextRequest) {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();

	const dateApplied = new Date(body.dateApplied);
	const step1Status = (body.step1Status as StepStatus) ?? StepStatus.Pending;
	const step2Status = (body.step2Status as StepStatus) ?? StepStatus.Pending;
	const step3Status = (body.step3Status as StepStatus) ?? StepStatus.Pending;

	const finalStatus = computeFinalStatus({
		step1Status,
		step2Status,
		step3Status,
		dateApplied,
	});

	const created = await prisma.application.create({
		data: {
			userId,
			company: body.company,
			roleTitle: body.roleTitle,
			location: body.location || null,
			applicationLink: body.applicationLink || null,
			dateApplied,
			contactPerson: body.contactPerson || null,
			contactInfo: body.contactInfo || null,
			salary: body.salary || null,
			step1Status,
			step2Status,
			step3Status,
			finalStatus,
			nextFollowUp: body.nextFollowUp ? new Date(body.nextFollowUp) : null,
			notes: body.notes || null,
			source: body.source || null,
		},
	});

	return NextResponse.json(toApplicationRecord(created), { status: 201 });
}
