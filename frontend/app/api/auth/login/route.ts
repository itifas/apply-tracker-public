import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
	username: z.string().trim().min(1),
	password: z.string().min(1),
});

export async function POST(request: NextRequest) {
	const parsed = loginSchema.safeParse(await request.json().catch(() => ({})));
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Username and password are required." },
			{ status: 400 },
		);
	}

	const login = parsed.data.username.trim().toLowerCase();
	const user = await prisma.user.findFirst({
		where: {
			OR: [{ username: login }, { email: login }],
		},
		select: {
			id: true,
			username: true,
			email: true,
			fullName: true,
			passwordHash: true,
		},
	});

	const validPassword = user
		? await verifyPassword(parsed.data.password, user.passwordHash)
		: false;

	if (!user || !validPassword) {
		return NextResponse.json(
			{ error: "Invalid username or password." },
			{ status: 401 },
		);
	}

	await setSessionCookie(user.id);

	return NextResponse.json({
		user: {
			id: user.id,
			username: user.username,
			email: user.email,
			fullName: user.fullName,
		},
	});
}
