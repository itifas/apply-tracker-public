export type EmailSyncResult = {
	provider: "gmail" | "outlook";
	connected: boolean;
	message: string;
	parsedSignals: Array<"interview" | "rejection" | "offer">;
};

export const emailIntegrationStubs = {
	gmail: {
		// TODO: Implement read-only Gmail API integration for mailbox scanning.
		async scanInbox(): Promise<EmailSyncResult> {
			return {
				provider: "gmail",
				connected: false,
				message: "Gmail integration scaffold is in place; API not configured.",
				parsedSignals: [],
			};
		},
	},
	outlook: {
		// TODO: Implement read-only Microsoft Graph mail integration.
		async scanInbox(): Promise<EmailSyncResult> {
			return {
				provider: "outlook",
				connected: false,
				message:
					"Outlook integration scaffold is in place; API not configured.",
				parsedSignals: [],
			};
		},
	},
};
