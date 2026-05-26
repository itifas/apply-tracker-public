"use client";

import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

type ConfirmationModalProps = {
	isOpen: boolean;
	title: string;
	children: ReactNode;
	confirmLabel: string;
	cancelLabel?: string;
	isLoading?: boolean;
	onCancel: () => void;
	onConfirm: () => void;
};

export function ConfirmationModal({
	isOpen,
	title,
	children,
	confirmLabel,
	cancelLabel = "Cancel",
	isLoading = false,
	onCancel,
	onConfirm,
}: ConfirmationModalProps) {
	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirmation-modal-title"
		>
			<div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 text-textMain shadow-panel sm:p-6">
				<h2 id="confirmation-modal-title" className="text-lg font-semibold">
					{title}
				</h2>
				<div className="mt-2 text-sm leading-6 text-textSoft">{children}</div>
				<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
					<button
						type="button"
						onClick={onCancel}
						className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-textMain transition-colors hover:bg-surfaceAlt disabled:opacity-70"
						disabled={isLoading}
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="inline-flex items-center justify-center gap-2 rounded-xl bg-danger px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-70"
						disabled={isLoading}
					>
						{isLoading && <Loader2 size={16} className="animate-spin" />}
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
