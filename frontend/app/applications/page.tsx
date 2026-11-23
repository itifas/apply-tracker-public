import { Suspense } from "react";
import { ApplicationsView } from "@/components/applications/applications-view";

export default function ApplicationsPage() {
	// useSearchParams in ApplicationsView needs a Suspense boundary for static export.
	return (
		<Suspense fallback={null}>
			<ApplicationsView />
		</Suspense>
	);
}
