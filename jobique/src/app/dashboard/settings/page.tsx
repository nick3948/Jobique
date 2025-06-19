import { useState } from "react";

export default function SettingsPage() {
  const [reminderDays, setReminderDays] = useState<number>(2);

  const saveReminderPreference = async () => {
    await fetch("/api/settings/reminders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reminderDays }),
    });
  };

  return (
    <div>
      <h1>Settings</h1>
      <label htmlFor="reminderDays">Reminder Days</label>
      <input
        id="reminderDays"
        type="number"
        value={reminderDays}
        onChange={(e) => setReminderDays(Number(e.target.value))}
      />
      <button
        onClick={saveReminderPreference}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}