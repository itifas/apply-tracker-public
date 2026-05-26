export const SESSION_COOKIE_NAME = "jobs_tracker_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionPayload = {
	userId: string;
	issuedAt: number;
	expiresAt: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getAuthSecret() {
	const secret = process.env.AUTH_SECRET;
	if (secret) {
		return secret;
	}

	if (process.env.NODE_ENV === "production") {
		return "";
	}

	return "jobs-tracker-development-session-secret";
}

function base64UrlEncode(input: string | Uint8Array) {
	const bytes = typeof input === "string" ? encoder.encode(input) : input;
	let binary = "";

	for (let index = 0; index < bytes.length; index += 0x8000) {
		binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
	}

	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/g, "");
}

function base64UrlDecodeToString(input: string) {
	const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized.padEnd(
		normalized.length + ((4 - (normalized.length % 4)) % 4),
		"=",
	);
	const binary = atob(padded);
	const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
	return decoder.decode(bytes);
}

function constantTimeEqual(left: string, right: string) {
	if (left.length !== right.length) {
		return false;
	}

	let result = 0;
	for (let index = 0; index < left.length; index += 1) {
		result |= left.charCodeAt(index) ^ right.charCodeAt(index);
	}

	return result === 0;
}

async function sign(value: string) {
	const secret = getAuthSecret();
	if (!secret) {
		return "";
	}

	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
	return base64UrlEncode(new Uint8Array(signature));
}

export async function createSessionToken(userId: string) {
	const now = Date.now();
	const payload: SessionPayload = {
		userId,
		issuedAt: now,
		expiresAt: now + SESSION_MAX_AGE_SECONDS * 1000,
	};
	const encodedPayload = base64UrlEncode(JSON.stringify(payload));
	const signature = await sign(encodedPayload);

	return `${encodedPayload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined) {
	if (!token) {
		return null;
	}

	const [encodedPayload, signature] = token.split(".");
	if (!encodedPayload || !signature) {
		return null;
	}

	const expectedSignature = await sign(encodedPayload);
	if (!expectedSignature || !constantTimeEqual(signature, expectedSignature)) {
		return null;
	}

	try {
		const payload = JSON.parse(
			base64UrlDecodeToString(encodedPayload),
		) as SessionPayload;

		if (
			typeof payload.userId !== "string" ||
			typeof payload.expiresAt !== "number" ||
			payload.expiresAt < Date.now()
		) {
			return null;
		}

		return payload;
	} catch {
		return null;
	}
}
