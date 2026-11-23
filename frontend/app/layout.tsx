import type { Metadata } from "next";
import "@fontsource-variable/overpass";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/feedback/toast";
import { DemoFetchInstaller } from "@/components/demo/demo-mode";

export const metadata: Metadata = {
	title: "Apply Tracker",
	description: "Track job applications, interview stages and follow-ups.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" data-palette="wayfinding" suppressHydrationWarning>
			<body>
				<DemoFetchInstaller />
				<ThemeProvider>
					<ToastProvider>{children}</ToastProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
