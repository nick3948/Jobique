"use client"

import { useState } from "react";

export default function Settings() {
  const [reminderDays, setReminderDays] = useState(0);
  return (
    <div className="max-w-md bg-white shadow p-6 rounded">
      <h2 className="text-xl font-semibold mb-4">Reminder Settings</h2>
      <label className="block mb-2 font-medium">
        Default reminder delay (days)
      </label>
      <input
        type="number"
        min="1"
        className="border rounded w-full p-2"
        value={reminderDays}
        onChange={(e) => setReminderDays(Number(e.target.value))}
      />
    </div>
  );
}
