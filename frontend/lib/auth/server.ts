import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import {
	createSessionToken,
	SESSION_COOKIE_NAME,
	SESSION_MAX_AGE_SECONDS,
	verifySessionToken,
} from "@/lib/auth/session";

export async function getSessionPayload() {
	const token = cookies().get(SESSION_COOKIE_NAME)?.value;
	return verifySessionToken(token);
}

export async function getCurrentUserId() {
	const payload = await getSessionPayload();
	return payload?.userId ?? null;
}

export async function getCurrentUser() {
	const userId = await getCurrentUserId();
	if (!userId) {
		return null;
	}

	return prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			username: true,
			email: true,
			fullName: true,
			createdAt: true,
			updatedAt: true,
		},
	});
}

export async function setSessionCookie(userId: string) {
	const token = await createSessionToken(userId);

	cookies().set({
		name: SESSION_COOKIE_NAME,
		value: token,
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: SESSION_MAX_AGE_SECONDS,
	});
}

export function clearSessionCookie() {
	cookies().delete(SESSION_COOKIE_NAME);
}
