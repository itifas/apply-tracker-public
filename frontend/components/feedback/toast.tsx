"use client";

import {
	AlertTriangle,
	CheckCircle2,
	Info,
	X,
	XCircle,
} from "lucide-react";
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type ToastType = "success" | "error" | "warning" | "info";

type ToastInput = {
	type?: ToastType;
	title: string;
	description?: ReactNode;
	duration?: number;
};

type ToastOptions = Omit<ToastInput, "type" | "title">;

type ToastItem = Required<Pick<ToastInput, "type" | "duration">> &
	Omit<ToastInput, "type" | "duration"> & {
		id: string;
	};

type ToastContextValue = {
	showToast: (toast: ToastInput) => string;
	dismissToast: (id: string) => void;
	success: (title: string, options?: ToastOptions) => string;
	error: (title: string, options?: ToastOptions) => string;
	warning: (title: string, options?: ToastOptions) => string;
	info: (title: string, options?: ToastOptions) => string;
};

type ToastStyle = {
	icon: typeof CheckCircle2;
	iconClass: string;
	borderClass: string;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<ToastType, ToastStyle> = {
	success: {
		icon: CheckCircle2,
		iconClass: "text-success",
		borderClass: "border-l-success",
	},
	error: {
		icon: XCircle,
		iconClass: "text-danger",
		borderClass: "border-l-danger",
	},
	warning: {
		icon: AlertTriangle,
		iconClass: "text-warning",
		borderClass: "border-l-warning",
	},
	info: {
		icon: Info,
		iconClass: "text-info",
		borderClass: "border-l-info",
	},
};

function ToastCard({
	toast,
	onDismiss,
}: {
	toast: ToastItem;
	onDismiss: (id: string) => void;
}) {
	const style = toastStyles[toast.type];
	const Icon = style.icon;

	useEffect(() => {
		if (toast.duration <= 0) {
			return;
		}

		const timer = window.setTimeout(() => {
			onDismiss(toast.id);
		}, toast.duration);

		return () => window.clearTimeout(timer);
	}, [onDismiss, toast.duration, toast.id]);

	return (
		<div
			className={`pointer-events-auto flex gap-3 rounded-xl border border-l-4 border-border ${style.borderClass} bg-card p-4 text-textMain shadow-panel`}
			role={toast.type === "error" ? "alert" : "status"}
		>
			<Icon className={`mt-0.5 shrink-0 ${style.iconClass}`} size={18} />
			<div className="min-w-0 flex-1">
				<p className="text-sm font-semibold">{toast.title}</p>
				{toast.description && (
					<div className="mt-1 max-h-48 overflow-y-auto text-sm leading-5 text-textSoft">
						{toast.description}
					</div>
				)}
			</div>
			<button
				type="button"
				onClick={() => onDismiss(toast.id)}
				className="shrink-0 rounded-lg p-1 text-textSoft transition-colors hover:bg-surfaceAlt hover:text-textMain"
				aria-label="Close notification"
			>
				<X size={16} />
			</button>
		</div>
	);
}

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const dismissToast = useCallback((id: string) => {
		setToasts((current) => current.filter((toast) => toast.id !== id));
	}, []);

	const showToast = useCallback((toast: ToastInput) => {
		const id =
			typeof crypto !== "undefined" && "randomUUID" in crypto
				? crypto.randomUUID()
				: `${Date.now()}-${Math.random().toString(36).slice(2)}`;

		setToasts((current) =>
			[
				...current,
				{
					...toast,
					id,
					type: toast.type ?? "info",
					duration: toast.duration ?? 5000,
				},
			].slice(-5),
		);

		return id;
	}, []);

	const value = useMemo<ToastContextValue>(
		() => ({
			showToast,
			dismissToast,
			success: (title, options) =>
				showToast({ ...options, title, type: "success" }),
			error: (title, options) =>
				showToast({ ...options, title, type: "error" }),
			warning: (title, options) =>
				showToast({ ...options, title, type: "warning" }),
			info: (title, options) => showToast({ ...options, title, type: "info" }),
		}),
		[dismissToast, showToast],
	);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[calc(100%-2rem)] max-w-md flex-col gap-3 sm:bottom-6 sm:right-6">
				{toasts.map((toast) => (
					<ToastCard
						key={toast.id}
						toast={toast}
						onDismiss={dismissToast}
					/>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error("useToast must be used within ToastProvider");
	}

	return context;
}
