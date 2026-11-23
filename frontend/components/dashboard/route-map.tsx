"use client";

import Link from "next/link";
import type { ApplicationRecord } from "@/types/application";
import { applicationHref } from "@/lib/demo/config";

export const STATIONS = ["Applied", "Screen", "Interview", "Final", "Offer"];
const LAST = STATIONS.length - 1;

type RouteEnd = "next" | "offer" | "rejected" | "ghosted";

type Route = {
	reached: number;
	end: RouteEnd;
	color: string;
	note: string;
};

const STATUS_COLOR: Record<string, string> = {
	Applied: "var(--line-applied)",
	Interviewing: "var(--line-interview)",
	OFFER: "var(--line-offer)",
	Rejected: "var(--line-rejected)",
	Ghosted: "var(--line-ghosted)",
};

// Order rows so the applications that need attention come first.
const STATUS_ORDER: Record<string, number> = {
	Interviewing: 0,
	OFFER: 1,
	Applied: 2,
	Ghosted: 3,
	Rejected: 4,
};

function days(count: number) {
	return `${count} ${count === 1 ? "day" : "days"}`;
}

export function routeFor(app: ApplicationRecord): Route {
	const steps = [app.step1Status, app.step2Status, app.step3Status];
	const color = STATUS_COLOR[app.finalStatus] ?? "var(--line-applied)";

	const rejectedAt = steps.indexOf("Rejected");
	if (rejectedAt !== -1) {
		return {
			reached: rejectedAt + 1,
			end: "rejected",
			color,
			note: `Ended at ${STATIONS[rejectedAt + 1].toLowerCase()}`,
		};
	}

	let passed = 0;
	while (passed < steps.length && steps[passed] === "Passed") {
		passed += 1;
	}

	if (passed === steps.length) {
		return { reached: LAST, end: "offer", color, note: "Offer received" };
	}

	if (app.finalStatus === "Ghosted") {
		return {
			reached: 0,
			end: "ghosted",
			color,
			note: `No reply in ${days(app.daysSinceApply)}`,
		};
	}

	return {
		reached: passed,
		end: "next",
		color,
		note: `Next: ${STATIONS[passed + 1].toLowerCase()}`,
	};
}

export function sortForRouteMap(apps: ApplicationRecord[]) {
	return [...apps].sort(
		(a, b) =>
			(STATUS_ORDER[a.finalStatus] ?? 9) - (STATUS_ORDER[b.finalStatus] ?? 9) ||
			a.daysSinceApply - b.daysSinceApply,
	);
}

const pct = (station: number) => `${(station / LAST) * 100}%`;

function Track({ route, row }: { route: Route; row: number }) {
	const { reached, end, color } = route;

	return (
		<div className="relative h-7" aria-hidden="true">
			{/* Unvisited route */}
			<div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-border" />

			{/* Travelled route */}
			{end === "ghosted" ? (
				<div
					className="route-segment absolute top-1/2 h-0 -translate-y-1/2 border-t-[3px] border-dotted"
					style={{
						left: 0,
						width: pct(1),
						borderColor: color,
						["--row" as string]: row,
					}}
				/>
			) : reached > 0 ? (
				<div
					className="route-segment absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full"
					style={{
						left: 0,
						width: pct(reached),
						background: color,
						["--row" as string]: row,
					}}
				/>
			) : null}

			{/* Upcoming stop */}
			{end === "next" && (
				<div
					className="absolute top-1/2 h-0 -translate-y-1/2 border-t-2 border-dashed"
					style={{
						left: pct(reached),
						width: `calc(${pct(1)})`,
						borderColor: color,
						opacity: 0.55,
					}}
				/>
			)}

			{/* Stations */}
			{STATIONS.map((_, index) => {
				const visited = index <= reached && end !== "ghosted";
				const isEnd = index === reached;
				const isNext = end === "next" && index === reached + 1;

				if (isEnd && end === "rejected") {
					return (
						<span
							key={index}
							className="absolute top-1/2 h-4 w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-sm"
							style={{ left: pct(index), background: color }}
						/>
					);
				}

				if (isEnd && end === "offer") {
					return (
						<span
							key={index}
							className="absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full"
							style={{
								left: pct(index),
								background: color,
								boxShadow: "0 0 0 3px var(--surface)",
							}}
						/>
					);
				}

				return (
					<span
						key={index}
						className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-surface ${
							isEnd && visited ? "h-3.5 w-3.5" : visited || isNext ? "h-3 w-3" : "h-2 w-2"
						}`}
						style={{
							left: pct(index),
							borderColor:
								visited || (end === "ghosted" && index === 0)
									? color
									: isNext
										? `color-mix(in srgb, ${color} 45%, var(--surface))`
										: "var(--border)",
							borderWidth: visited || isNext || index === 0 ? 2.5 : 2,
						}}
					/>
				);
			})}
		</div>
	);
}

export function RouteMap({
	applications,
	limit = 8,
}: {
	applications: ApplicationRecord[];
	limit?: number;
}) {
	const rows = sortForRouteMap(applications).slice(0, limit);

	return (
		<div>
			<div
				className="hidden grid-cols-[minmax(170px,230px)_1fr_150px] gap-6 pb-3 text-[13px] text-textSoft md:grid"
				aria-hidden="true"
			>
				<span />
				<div className="relative mx-4 h-5">
					{STATIONS.map((station, index) => (
						<span
							key={station}
							className="absolute -translate-x-1/2 whitespace-nowrap"
							style={{ left: pct(index) }}
						>
							{station}
						</span>
					))}
				</div>
				<span />
			</div>

			<ul className="divide-y divide-border border-t border-border">
				{rows.map((app, row) => {
					const route = routeFor(app);
					const progress =
						route.end === "offer"
							? "reached the offer stage"
							: route.end === "rejected"
								? `was rejected at the ${STATIONS[route.reached].toLowerCase()} stage`
								: route.end === "ghosted"
									? "has had no reply"
									: `is at the ${STATIONS[route.reached].toLowerCase()} stage`;

					return (
						<li key={app.id}>
							<Link
								href={applicationHref(app.id)}
								className="grid grid-cols-1 items-center gap-x-6 gap-y-2 rounded-md px-1 py-3.5 outline-none transition-colors hover:bg-surfaceAlt focus-visible:ring-2 focus-visible:ring-primary md:grid-cols-[minmax(170px,230px)_1fr_150px]"
							>
								<span className="min-w-0">
									<span className="block truncate font-bold text-textMain">
										{app.company}
									</span>
									<span className="block truncate text-sm text-textSoft">
										{app.roleTitle}
									</span>
								</span>
								<span className="mx-4 block">
									<Track route={route} row={row} />
									<span className="sr-only">
										{app.company} {progress}.
									</span>
								</span>
								<span
									className="text-sm font-semibold md:text-right"
									style={{
										color:
											route.end === "next" ? "var(--text-soft)" : route.color,
									}}
								>
									{route.note}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
