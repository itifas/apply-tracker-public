"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Calendar, Download } from "lucide-react";

export default function CalendarIntegrationPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/integrations/calendar")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  async function exportICS() {
    const response = await fetch("/api/export/ics");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jobs-tracker-reminders.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Calendar Integration</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sync your reminders with external calendars</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Provider Status</h2>
          <pre className="overflow-auto rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">{JSON.stringify(data, null, 2)}</pre>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            .ics export is fully functional. Google/Outlook are scaffold stubs for future OAuth integration.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Export</h2>
          <button onClick={exportICS} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <Download size={16} />
            Export .ics File
          </button>
        </div>
      </div>
    </AppShell>
  );
}
