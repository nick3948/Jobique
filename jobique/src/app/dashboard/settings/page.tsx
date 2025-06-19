"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [reminderDays, setReminderDays] = useState<number>(2);

  // Fetch current setting from DB when page loads
  useEffect(() => {
    const fetchReminderDays = async () => {
      try {
        const res = await fetch("/api/settings/reminders");
        const data = await res.json();
        setReminderDays(data.reminderDays ?? 2);
      } catch (err) {
        console.error("Failed to fetch reminderDays", err);
      }
    };

    fetchReminderDays();
  }, []);

  const saveReminderPreference = async () => {
    try {
      await fetch("/api/settings/reminders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminderDays }),
      });
    } catch (err) {
      console.error("Failed to save reminderDays", err);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      <div className="mb-4">
        <label
          htmlFor="reminderDays"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Reminder Days
        </label>
        <input
          id="reminderDays"
          type="number"
          value={reminderDays}
          onChange={(e) => setReminderDays(Number(e.target.value))}
          className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <button
        onClick={saveReminderPreference}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </>
  );
}
