"use client";

import { useParams } from "next/navigation";
import { ApplicationDetail } from "@/components/applications/application-detail";

export default function ApplicationDetailPage() {
	const params = useParams<{ id: string }>();
	return <ApplicationDetail id={params.id} />;
}
