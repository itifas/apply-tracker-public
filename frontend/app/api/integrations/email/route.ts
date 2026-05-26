import { NextResponse } from "next/server";
import { emailIntegrationStubs } from "@/services/email/provider";

export const dynamic = "force-dynamic";

export async function GET() {
	const gmail = await emailIntegrationStubs.gmail.scanInbox();
	const outlook = await emailIntegrationStubs.outlook.scanInbox();
	return NextResponse.json({ gmail, outlook });
}
