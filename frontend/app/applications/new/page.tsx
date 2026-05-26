import Link from "next/link";
import { StepStatus } from "@prisma/client";
import { AppShell } from "@/components/layout/app-shell";
import { createApplicationAction } from "@/app/applications/actions";
import { ArrowLeft } from "lucide-react";

export default function NewApplicationPage() {
	return (
		<AppShell>
			<div className="mx-auto max-w-4xl space-y-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<Link
							href="/applications"
							className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-textSoft transition-colors hover:text-primary"
						>
							<ArrowLeft size={16} />
							Back to Applications
						</Link>
						<h1 className="text-2xl font-semibold text-textMain">
							Create Application
						</h1>
					</div>
				</div>
				<div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
					<h2 className="mb-4 text-lg font-semibold text-textMain">
						New Application
					</h2>
					<form
						action={createApplicationAction}
						className="grid grid-cols-1 gap-4 md:grid-cols-2"
					>
						<input
							name="company"
							placeholder="Company"
							required
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
						<input
							name="roleTitle"
							placeholder="Role title"
							required
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
						<input
							name="location"
							placeholder="Location"
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
						<input
							name="applicationLink"
							placeholder="Application link"
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
						<input
							name="dateApplied"
							type="date"
							required
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
						<input
							name="nextFollowUp"
							type="date"
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
						<input
							name="contactPerson"
							placeholder="Contact person"
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
						<input
							name="contactInfo"
							placeholder="Contact info"
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
						<input
							name="salary"
							placeholder="Salary"
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
						<input
							name="source"
							placeholder="Source"
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
						<select
							name="step1Status"
							defaultValue={StepStatus.Pending}
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						>
							{Object.values(StepStatus).map((value) => (
								<option key={value} value={value}>
									Step 1 - {value}
								</option>
							))}
						</select>
						<select
							name="step2Status"
							defaultValue={StepStatus.Pending}
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						>
							{Object.values(StepStatus).map((value) => (
								<option key={value} value={value}>
									Step 2 - {value}
								</option>
							))}
						</select>
						<select
							name="step3Status"
							defaultValue={StepStatus.Pending}
							className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						>
							{Object.values(StepStatus).map((value) => (
								<option key={value} value={value}>
									Step 3 - {value}
								</option>
							))}
						</select>
						<div className="md:col-span-2">
							<textarea
								name="notes"
								placeholder="Notes"
								rows={4}
								className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
							/>
						</div>
						<div className="md:col-span-2">
							<button
								type="submit"
								className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primaryHover md:w-auto"
							>
								Create Application
							</button>
						</div>
					</form>
				</div>
			</div>
		</AppShell>
	);
}
