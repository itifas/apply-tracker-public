import { NextResponse } from "next/server";
import { calendarIntegrationStubs } from "@/services/calendar/ics";

export const dynamic = "force-dynamic";

export async function GET() {
	const google = await calendarIntegrationStubs.google.syncReminders();
	const outlook = await calendarIntegrationStubs.outlook.syncReminders();
	return NextResponse.json({ google, outlook, ics: { connected: true } });
}
