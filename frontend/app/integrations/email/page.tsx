"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
	Mail,
	CheckCircle,
	AlertCircle,
	Zap,
	Shield,
	Clock,
} from "lucide-react";

type EmailData = {
	connected?: boolean;
	provider?: string;
	lastSync?: string;
	detectedCount?: number;
};

const sampleDetectedEmails = [
	{
		id: "1",
		company: "Google",
		subject: "Re: Software Engineering Intern - Next Steps",
		date: "2026-03-10",
		type: "Interview Invitation",
		confidence: "High",
		matched: true,
	},
	{
		id: "2",
		company: "Meta",
		subject: "Offer Letter - Frontend Developer Intern",
		date: "2026-03-08",
		type: "Offer",
		confidence: "High",
		matched: true,
	},
	{
		id: "3",
		company: "Stripe",
		subject: "Phone Screen Confirmation",
		date: "2026-03-05",
		type: "Interview Invitation",
		confidence: "Medium",
		matched: true,
	},
];

export default function EmailIntegrationPage() {
	const [data, setData] = useState<EmailData | null>(null);

	useEffect(() => {
		fetch("/api/integrations/email")
			.then((res) => res.json())
			.then(setData)
			.catch(() => setData(null));
	}, []);

	return (
		<AppShell>
			<div className="space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
						Email Integration
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						Automatically sync and detect application-related emails
					</p>
				</div>

				{/* Connection Status */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Gmail */}
					<div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-green-200 dark:border-green-800 p-6">
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
									<Mail
										className="text-green-600 dark:text-green-400"
										size={24}
									/>
								</div>
								<div>
									<p className="font-semibold text-gray-900 dark:text-gray-100">
										Gmail
									</p>
									<p className="text-sm text-green-600 flex items-center gap-1 mt-1">
										<CheckCircle size={14} />
										{data?.connected ? "Connected" : "Connected"}
									</p>
								</div>
							</div>
							<button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
								Disconnect
							</button>
						</div>
						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-gray-600 dark:text-gray-400">
									Account
								</span>
								<span className="font-medium text-gray-900 dark:text-gray-100">
									alex@university.edu
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-gray-600 dark:text-gray-400">
									Last synced
								</span>
								<span className="font-medium text-gray-900 dark:text-gray-100">
									{data?.lastSync ?? "2 hours ago"}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-gray-600 dark:text-gray-400">
									Emails detected
								</span>
								<span className="font-medium text-gray-900 dark:text-gray-100">
									{data?.detectedCount ?? 24}
								</span>
							</div>
						</div>
						<button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
							Sync Now
						</button>
					</div>

					{/* Outlook */}
					<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
									<Mail
										className="text-blue-600 dark:text-blue-400"
										size={24}
									/>
								</div>
								<div>
									<p className="font-semibold text-gray-900 dark:text-gray-100">
										Outlook
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
										<AlertCircle size={14} />
										Not connected
									</p>
								</div>
							</div>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
							Connect your Outlook account to sync application-related
							emails automatically.
						</p>
						<button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
							Connect Outlook
						</button>
					</div>
				</div>

				{/* AI Detection Features */}
				<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
					<div className="flex items-center gap-2 mb-6">
						<Zap className="text-yellow-500" size={24} />
						<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							AI-Powered Detection
						</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
							<CheckCircle
								className="text-blue-600 dark:text-blue-400 mb-2"
								size={20}
							/>
							<p className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
								Interview Invitations
							</p>
							<p className="text-xs text-gray-600 dark:text-gray-400">
								Automatically detect scheduling emails
							</p>
						</div>
						<div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
							<CheckCircle
								className="text-red-600 dark:text-red-400 mb-2"
								size={20}
							/>
							<p className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
								Rejections
							</p>
							<p className="text-xs text-gray-600 dark:text-gray-400">
								Identify and update status
							</p>
						</div>
						<div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
							<CheckCircle
								className="text-amber-600 dark:text-amber-400 mb-2"
								size={20}
							/>
							<p className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
								Offer Letters
							</p>
							<p className="text-xs text-gray-600 dark:text-gray-400">
								Recognize offer communications
							</p>
						</div>
					</div>
				</div>

				{/* Detected Emails */}
				<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
						Detected Application Emails
					</h2>
					<div className="space-y-3">
						{sampleDetectedEmails.map((email) => (
							<div
								key={email.id}
								className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
							>
								<div className="flex items-start gap-4 flex-1">
									<div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
										<Mail
											className="text-blue-600 dark:text-blue-400"
											size={20}
										/>
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1 flex-wrap">
											<p className="font-medium text-gray-900 dark:text-gray-100">
												{email.company}
											</p>
											<span
												className={`px-2 py-0.5 rounded-full text-xs font-medium ${
													email.type === "Offer"
														? "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
														: email.type ===
															  "Interview Invitation"
															? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
															: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
												}`}
											>
												{email.type}
											</span>
											<span
												className={`px-2 py-0.5 rounded-full text-xs ${
													email.confidence === "High"
														? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
														: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
												}`}
											>
												{email.confidence} confidence
											</span>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{email.subject}
										</p>
										<div className="flex items-center gap-2 mt-1">
											<Clock
												size={12}
												className="text-gray-400"
											/>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{email.date}
											</p>
											{email.matched && (
												<span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
													<CheckCircle size={12} />
													Auto-matched
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors">
										View
									</button>
									<button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-900 dark:text-gray-100">
										Update Status
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Privacy & Settings */}
				<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
					<div className="flex items-center gap-2 mb-4">
						<Shield className="text-blue-600" size={24} />
						<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							Privacy &amp; Settings
						</h2>
					</div>
					<div className="space-y-4">
						<div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
							<p className="text-sm text-blue-900 dark:text-blue-200 font-medium mb-2">
								Your privacy matters
							</p>
							<p className="text-xs text-blue-700 dark:text-blue-300">
								We only read emails related to job applications. All
								data is encrypted and stored securely. You can
								disconnect at any time and all synced data will be
								removed.
							</p>
						</div>

						<div className="space-y-3">
							{[
								{
									title: "Auto-update application status",
									desc: "Automatically update status based on detected emails",
									on: true,
								},
								{
									title: "Notify on new detections",
									desc: "Get notified when new application emails are detected",
									on: true,
								},
							].map((s) => (
								<div
									key={s.title}
									className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
								>
									<div>
										<p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
											{s.title}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{s.desc}
										</p>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											className="sr-only peer"
											defaultChecked={s.on}
										/>
										<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
									</label>
								</div>
							))}

							<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
								<div>
									<p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
										Sync frequency
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										How often to check for new emails
									</p>
								</div>
								<select className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
									<option>Every hour</option>
									<option>Every 3 hours</option>
									<option>Every 6 hours</option>
									<option>Daily</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AppShell>
	);
}
