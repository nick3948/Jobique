"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Resource {
  id: number;
  label: string;
  url: string;
  note?: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState({ label: "", url: "", note: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchResources = async () => {
    const res = await fetch("/api/resources");
    const data = await res.json();
    setResources(data);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setIsSubmitting(false);
    if (res.ok) {
      setForm({ label: "", url: "", note: "" });
      fetchResources();
      setShowModal(false);
    } else {
      toast.error("Failed to save resource");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const res = await fetch("/api/resources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds }),
    });
    if (res.ok) {
      setSelectedIds([]);
      fetchResources();
    } else {
      toast.error("Failed to delete resources");
    }
  };

  return (
    <div className="p-6 mt-5">
      <h1 className="text-2xl font-bold mb-4">Resources</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add New Resource
        </button>
        <button
          onClick={handleDeleteSelected}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Selected
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Resource</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Label"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                required
                type="url"
                placeholder="Link"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Note (optional)"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {resources.map((r) => (
          <div key={r.id} className="p-4 border rounded flex items-start gap-4">
            <input
              type="checkbox"
              checked={selectedIds.includes(r.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds([...selectedIds, r.id]);
                } else {
                  setSelectedIds(selectedIds.filter((id) => id !== r.id));
                }
              }}
            />
            <div>
              <h2 className="font-semibold text-lg">{r.label}</h2>
              <a
                href={r.url}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {r.url}
              </a>
              {r.note && <p className="mt-2 text-gray-600">{r.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
