import { NextRequest, NextResponse } from "next/server";
import {
	SESSION_COOKIE_NAME,
	verifySessionToken,
} from "@/lib/auth/session";

const publicPaths = ["/login", "/api/auth/login", "/api/auth/logout"];

function isPublicPath(pathname: string) {
	return publicPaths.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`),
	);
}

function redirectToLogin(request: NextRequest) {
	const loginUrl = new URL("/login", request.url);
	loginUrl.searchParams.set(
		"next",
		`${request.nextUrl.pathname}${request.nextUrl.search}`,
	);
	return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const session = await verifySessionToken(
		request.cookies.get(SESSION_COOKIE_NAME)?.value,
	);

	if (pathname === "/login" && session) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	if (isPublicPath(pathname)) {
		return NextResponse.next();
	}

	if (!session) {
		if (pathname.startsWith("/api/")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		return redirectToLogin(request);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map)$).*)",
	],
};
