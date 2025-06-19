import React, { useState } from "react";

interface ShareModalProps {
  jobIds: number[];
  onClose: () => void;
}

export default function ShareModal({ jobIds, onClose }: ShareModalProps) {
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Sharing with", recipient, "jobIds:", jobIds);
      const response = await fetch("/api/jobs/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipient, jobIds }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to share jobs");
      } else {
        setSuccess(true);
        setRecipient("");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Check the console for more details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Share Jobs</h2>
        <input
          type="text"
          placeholder="Recipient email or username"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          disabled={loading}
          className="w-full border px-4 py-2 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleShare}
            disabled={loading || !recipient}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">Jobs shared successfully!</p>}
      </div>
    </div>
  );
}
