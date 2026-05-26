import { NextRequest, NextResponse } from "next/server";
import { StepStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { toApplicationRecord } from "@/lib/mappers";
import { computeFinalStatus } from "@/lib/status/status";
import { getCurrentUserId } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function GET(
	_: NextRequest,
	{ params }: { params: { id: string } },
) {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const app = await prisma.application.findFirst({
		where: { id: params.id, userId },
	});
	if (!app) {
		return NextResponse.json(
			{ error: "Application not found" },
			{ status: 404 },
		);
	}

	return NextResponse.json(toApplicationRecord(app));
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const existing = await prisma.application.findFirst({
		where: { id: params.id, userId },
	});

	if (!existing) {
		return NextResponse.json(
			{ error: "Application not found" },
			{ status: 404 },
		);
	}

	const step1Status = (body.step1Status as StepStatus) ?? existing.step1Status;
	const step2Status = (body.step2Status as StepStatus) ?? existing.step2Status;
	const step3Status = (body.step3Status as StepStatus) ?? existing.step3Status;
	const dateApplied = body.dateApplied
		? new Date(body.dateApplied)
		: existing.dateApplied;

	const finalStatus = computeFinalStatus({
		step1Status,
		step2Status,
		step3Status,
		dateApplied,
	});

	const updated = await prisma.application.update({
		where: { id: existing.id },
		data: {
			...(body.company !== undefined ? { company: String(body.company) } : {}),
			...(body.roleTitle !== undefined
				? { roleTitle: String(body.roleTitle) }
				: {}),
			...(body.location !== undefined
				? { location: String(body.location) || null }
				: {}),
			...(body.applicationLink !== undefined
				? { applicationLink: String(body.applicationLink) || null }
				: {}),
			...(body.contactPerson !== undefined
				? { contactPerson: String(body.contactPerson) || null }
				: {}),
			...(body.contactInfo !== undefined
				? { contactInfo: String(body.contactInfo) || null }
				: {}),
			...(body.salary !== undefined
				? { salary: String(body.salary) || null }
				: {}),
			...(body.notes !== undefined ? { notes: String(body.notes) || null } : {}),
			...(body.source !== undefined ? { source: String(body.source) || null } : {}),
			dateApplied,
			step1Status,
			step2Status,
			step3Status,
			finalStatus,
			...(body.nextFollowUp !== undefined
				? {
						nextFollowUp: body.nextFollowUp
							? new Date(body.nextFollowUp)
							: null,
					}
				: {}),
		},
	});

	return NextResponse.json(toApplicationRecord(updated));
}

export async function DELETE(
	_: NextRequest,
	{ params }: { params: { id: string } },
) {
	const userId = await getCurrentUserId();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const existing = await prisma.application.findFirst({
		where: { id: params.id, userId },
		select: { id: true },
	});
	if (!existing) {
		return NextResponse.json(
			{ error: "Application not found" },
			{ status: 404 },
		);
	}

	await prisma.application.delete({ where: { id: existing.id } });
	return NextResponse.json({ success: true });
}
