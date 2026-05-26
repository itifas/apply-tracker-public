import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/feedback/toast";

export const metadata: Metadata = {
	title: "Jobs Tracker",
	description: "Desktop-first personal jobs application tracker",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" data-palette="indigo-aurora" suppressHydrationWarning>
			<body>
				<ThemeProvider>
					<ToastProvider>{children}</ToastProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
