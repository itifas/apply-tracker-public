import { AppShell } from "@/components/layout/app-shell";

export default function Loading() {
  return (
    <AppShell>
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-28 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
