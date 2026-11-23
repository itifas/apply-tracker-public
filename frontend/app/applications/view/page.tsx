"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ApplicationDetail } from "@/components/applications/application-detail";

// Query-string version of /applications/[id], used by the static demo build.
function ApplicationDetailFromQuery() {
	const searchParams = useSearchParams();
	return <ApplicationDetail id={searchParams.get("id")} />;
}

export default function ApplicationViewPage() {
	return (
		<Suspense fallback={null}>
			<ApplicationDetailFromQuery />
		</Suspense>
	);
}
