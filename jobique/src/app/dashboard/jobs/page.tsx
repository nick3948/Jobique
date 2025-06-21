"use client";

import ShareModal from "@/components/ui/ShareModal";
import { useEffect, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import React from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  pay?: string;
  h1bSponsor: boolean;
  link: string;
  status: string;
  applied_date: string;
  notes?: string;
  tags: string[];
  resources: string[];
  shared?: boolean;
}

export default function JobsPage() {
  const [showModal, setShowModal] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    pay: "",
    h1bSponsor: false,
    link: "",
    status: "Saved",
    applied_date: "",
    notes: "",
    tags: "",
    resources: "",
  });
  const [editJobId, setEditJobId] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [jobIdInFocus, setJobIdInFocus] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const JOBS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastJob = currentPage * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  const filteredJobs = jobs.filter(
    (job) =>
      (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "All Statuses" || job.status === statusFilter)
  );
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const groupedJobs = filteredJobs.reduce((groups, job) => {
    const dateKey = job.applied_date
      ? isYesterday(new Date(job.applied_date))
        ? "Yesterday"
        : isToday(new Date(job.applied_date))
        ? "Today"
        : format(new Date(job.applied_date), "MM/dd/yyyy")
      : "Not Yet Applied!";
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(job);
    return groups;
  }, {} as Record<string, Job[]>);

  const sortedGroupedJobs = Object.keys(groupedJobs)
    .sort((a, b) => {
      const parseDate = (key: string) => {
        if (key === "Today") return new Date();
        if (key === "Yesterday") return new Date(Date.now() - 86400000);
        return new Date(key);
      };
      return parseDate(b).getTime() - parseDate(a).getTime();
    })
    .reduce((sorted, key) => {
      sorted[key] = groupedJobs[key];
      return sorted;
    }, {} as Record<string, Job[]>);

  const groupedJobsRes = sortedGroupedJobs;
  interface Contact {
    id?: number;
    name: string;
    linkedin: string;
    tags: string;
    notes?: string;
    email?: string;
    jobId?: number;
  }

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    linkedin: "",
    tags: "",
    notes: "",
  });
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const fetchJobs = async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
  };

  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchJobs();
    if (showContactModal) {
      fetchContacts();
    }
  }, [showContactModal]);

  useEffect(() => {
    const tableTop = document.getElementById("job-table")?.offsetTop;
    if (tableTop) window.scrollTo({ top: tableTop - 100, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutsideCheckboxes = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isCheckbox = target.closest('input[type="checkbox"]');
      const isLabel = target.closest("label");

      if (!isCheckbox && !isLabel) {
        setSelectedJobIds([]);
      }
    };

    document.addEventListener("click", handleClickOutsideCheckboxes);
    return () => {
      document.removeEventListener("click", handleClickOutsideCheckboxes);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      ...form,
      applied_date: form.applied_date
        ? new Date(form.applied_date + "T00:00")
        : null,
      tags: form.tags.split(",").map((t) => t.trim()),
      resources: form.resources.split(",").map((r) => r.trim()),
      ...(editJobId !== null && { id: editJobId }),
    };

    const url = editJobId ? `/api/jobs/${editJobId}` : "/api/jobs";
    const method = editJobId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setIsSubmitting(false);

    if (res.ok) {
      setShowModal(false);
      setForm({
        title: "",
        company: "",
        location: "",
        pay: "",
        h1bSponsor: false,
        link: "",
        status: "Applied",
        applied_date: "",
        notes: "",
        tags: "",
        resources: "",
      });
      fetchJobs();
    } else {
      alert("Failed to save job entry");
    }
    setEditJobId(null);
  };
  const fetchContacts = async () => {
    if (!jobIdInFocus) return;
    const res = await fetch(`/api/contacts/job/${jobIdInFocus}`);
    const data = await res.json();
    setContacts(data);
  };
  return (
    <div className="mt-5 px-4 py-6 h-[calc(100vh-90px)] overflow-hidden flex flex-col">
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Tracker</h1>
          <p className="text-gray-600 mt-1">
            Manage and optimize your job applications, documents, and
            follow-ups.
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by role or company..."
              className="w-full sm:w-64 px-4 py-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-md text-sm text-gray-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Saved</option>
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Rejected</option>
              <option>Offered</option>
            </select>
          </div>
          <button
            className="px-5 py-2 bg-violet-600 text-white rounded-md"
            onClick={() => setShowModal(true)}
          >
            + New Job Entry
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Add New Job</h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Job Title"
                className="border p-2 rounded"
              />
              <input
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Company"
                className="border p-2 rounded"
              />
              <input
                required
                value={form.link}
                type="url"
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="Job Link"
                className="border p-2 rounded"
              />
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Location"
                className="border p-2 rounded"
              />
              <input
                value={form.pay}
                onChange={(e) => setForm({ ...form, pay: e.target.value })}
                placeholder="Pay"
                className="border p-2 rounded"
              />
              <select
                required
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border p-2 rounded"
              >
                <option>Saved</option>
                <option>Applied</option>
                <option>In Progress</option>
                <option>Interviewing</option>
                <option>Offered</option>
                <option>Rejected</option>
              </select>
              <input
                type="date"
                value={form.applied_date}
                onChange={(e) =>
                  setForm({ ...form, applied_date: e.target.value })
                }
                className="border p-2 rounded"
              />
              <select
                required
                title="h1b sponsored?"
                value={form.h1bSponsor ? "Yes" : "No"}
                onChange={(e) =>
                  setForm({ ...form, h1bSponsor: e.target.value === "Yes" })
                }
                className="border p-2 rounded"
              >
                <option>No</option>
                <option>Yes</option>
              </select>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Notes"
                className="col-span-2 border p-2 rounded"
                rows={3}
              ></textarea>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Tags (comma separated)"
                className="col-span-2 border p-2 rounded"
              />
              <input
                value={form.resources}
                onChange={(e) =>
                  setForm({ ...form, resources: e.target.value })
                }
                placeholder="Resources (comma separated URLs)"
                className="col-span-2 border p-2 rounded"
              />
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditJobId(null);
                  }}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex gap-3 mb-3">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50 cursor-pointer"
          disabled={selectedJobIds.length === 0}
          onClick={async () => {
            try {
              const res = await fetch("/api/jobs", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedJobIds }),
              });

              if (res.ok) {
                setSelectedJobIds([]);
                fetchJobs();
              } else {
                const errorText = await res.text();
                alert("Failed to delete selected jobs: " + errorText);
              }
            } catch (err) {
              console.error("Fetch DELETE error:", err);
              alert("Something went wrong.");
            }
          }}
        >
          Delete Selected
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50 cursor-pointer"
          disabled={selectedJobIds.length !== 1}
          onClick={() => {
            const jobToEdit = jobs.find((j) => j.id === selectedJobIds[0]);
            if (jobToEdit) {
              setForm({
                title: jobToEdit.title,
                company: jobToEdit.company,
                location: jobToEdit.location,
                pay: jobToEdit.pay ?? "",
                h1bSponsor: jobToEdit.h1bSponsor,
                link: jobToEdit.link,
                status: jobToEdit.status,
                applied_date: jobToEdit.applied_date
                  ? new Date(jobToEdit.applied_date).toISOString().split("T")[0]
                  : "",
                notes: jobToEdit.notes ?? "",
                tags: jobToEdit.tags.join(", "),
                resources: jobToEdit.resources.join(", "),
              });
              setEditJobId(jobToEdit.id);
              setShowModal(true);
            }
          }}
        >
          Edit Selected
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
          disabled={selectedJobIds.length === 0}
          onClick={() => setShowShareModal(true)}
        >
          Share
        </button>
      </div>
      <div className="flex-1 overflow-y-auto border rounded-md max-h-[70vh]">
        <table
          id="job-table"
          className="min-w-full table-auto border border-gray-300"
        >
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="border px-4 py-2">
                <input
                  className="auto-uncheck"
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedJobIds(jobs.map((j) => j.id));
                    } else {
                      setSelectedJobIds([]);
                    }
                  }}
                  checked={
                    selectedJobIds.length === jobs.length && jobs.length > 0
                  }
                />
              </th>
              <th className="border px-4 py-2">Job Title</th>
              <th className="border px-4 py-2">Company</th>
              <th className="border px-4 py-2">Job Link</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Pay</th>
              <th className="border px-4 py-2">H1B?</th>
              <th className="border px-4 py-2">Applied Date</th>
              <th className="border px-4 py-2">Tags</th>
              <th className="border px-4 py-2">Resources</th>
              <th className="border px-4 py-2">Contacts</th>
              <th className="border px-4 py-2">Notes</th>
              <th className="border px-4 py-2">Type</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={14} className="text-center py-4 text-gray-500">
                  No job applications found. Start by adding one!
                </td>
              </tr>
            ) : (
              Object.entries(groupedJobsRes).map(([dateLabel, jobsForDate]) => (
                <React.Fragment key={dateLabel}>
                  <tr>
                    <td
                      colSpan={14}
                      className="bg-gray-200 font-semibold px-4 py-2"
                    >
                      {dateLabel}
                    </td>
                  </tr>
                  {jobsForDate.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedJobIds.includes(job.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedJobIds((prev) => [...prev, job.id]);
                            } else {
                              setSelectedJobIds((prev) =>
                                prev.filter((id) => id !== job.id)
                              );
                            }
                          }}
                        />
                      </td>
                      <td className="border px-4 py-2">{job.title}</td>
                      <td className="border px-4 py-2">{job.company}</td>
                      <td className="border px-4 py-2 text-blue-600 underline">
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Link
                        </a>
                      </td>
                      <td className="border px-4 py-2">{job.status}</td>
                      <td className="border px-4 py-2">{job.location}</td>
                      <td className="border px-4 py-2">{job.pay}</td>
                      <td className="border px-4 py-2">
                        {job.h1bSponsor ? "Yes" : "No"}
                      </td>
                      <td className="border px-4 py-2">
                        {job.applied_date
                          ? new Date(job.applied_date).toLocaleDateString(
                              "en-CA"
                            )
                          : "Not specified"}
                      </td>
                      <td className="border px-4 py-2">
                        {job.tags.join(", ")}
                      </td>
                      <td className="border px-4 py-2">
                        {job.resources.join(", ")}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="text-sm text-blue-600 hover:underline"
                          onClick={() => {
                            setJobIdInFocus(job.id);
                            setShowContactModal(true);
                          }}
                        >
                          Contacts
                        </button>
                      </td>
                      <td className="border px-4 py-2">{job.notes}</td>
                      <td className="border px-4 py-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            job.shared
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {job.shared ? "Shared" : "Created"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2">
          Page {currentPage} of {Math.ceil(filteredJobs.length / JOBS_PER_PAGE)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
                ? prev + 1
                : prev
            )
          }
          disabled={
            currentPage === Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
          }
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {showShareModal && (
        <ShareModal
          jobIds={selectedJobIds}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showContactModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Contacts for{" "}
                {(() => {
                  const job = jobs.find((j) => j.id === jobIdInFocus);
                  return job ? `${job.title} @ ${job.company}` : "Selected Job";
                })()}
              </h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="mt-6 py-3">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => setShowNewContactForm(true)}
              >
                + Add New Contact
              </button>
            </div>
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <p className="text-gray-500">No contacts added yet.</p>
              ) : (
                contacts.map((contact, idx) => (
                  <div key={idx} className="border p-3 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <a
                          href={contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm"
                        >
                          LinkedIn
                        </a>
                        <div className="mt-1 text-sm text-gray-600">
                          Tags:{" "}
                          {contact.tags
                            ?.split(",")
                            .map((tag: string, i: number) => (
                              <span
                                key={i}
                                className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mr-1"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                      <div className="space-x-2">
                        <button
                          className="text-yellow-600 text-sm cursor-pointer"
                          onClick={() => {
                            setEditingContact(contact);
                            setNewContact({
                              name: contact.name,
                              linkedin: contact.linkedin,
                              tags: contact.tags,
                              notes: contact.notes || "",
                            });
                            setShowNewContactForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 text-sm cursor-pointer"
                          onClick={async () => {
                            const res = await fetch("/api/contacts", {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: contact.id }),
                            });
                            if (res.ok) {
                              await fetchContacts();
                            } else {
                              alert("Failed to delete contact");
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {contact.notes && (
                      <p className="mt-2 text-sm text-gray-700">
                        Note: {contact.notes}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {showNewContactForm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-60">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (isSubmittingContact) return;
                      setIsSubmittingContact(true);

                      const method = editingContact ? "PUT" : "POST";
                      const url = editingContact
                        ? `/api/contacts/${editingContact.id}`
                        : "/api/contacts";

                      const res = await fetch(url, {
                        method,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          ...newContact,
                          email: "",
                          jobId: jobIdInFocus,
                        }),
                      });

                      setIsSubmittingContact(false);

                      if (res.ok) {
                        setNewContact({
                          name: "",
                          linkedin: "",
                          tags: "",
                          notes: "",
                        });
                        setEditingContact(null);
                        setShowNewContactForm(false);
                        await fetchContacts();
                      } else if (res.status === 400) {
                        alert(
                          "This contact already exists for the selected job."
                        );
                      } else {
                        alert("Failed to save contact");
                      }
                    }}
                  >
                    <h3 className="text-lg font-bold mb-4">
                      {editingContact ? "Edit Contact" : "Add New Contact"}
                    </h3>
                    <input
                      required
                      type="text"
                      className="w-full border p-2 rounded mb-3"
                      placeholder="Name"
                      value={newContact.name}
                      onChange={(e) =>
                        setNewContact({ ...newContact, name: e.target.value })
                      }
                    />
                    <input
                      required
                      type="url"
                      className="w-full border p-2 rounded mb-3"
                      placeholder="LinkedIn URL"
                      value={newContact.linkedin}
                      onChange={(e) =>
                        setNewContact({
                          ...newContact,
                          linkedin: e.target.value,
                        })
                      }
                    />
                    <input
                      className="w-full border p-2 rounded mb-3"
                      placeholder="Tags (comma separated)"
                      value={newContact.tags}
                      onChange={(e) =>
                        setNewContact({ ...newContact, tags: e.target.value })
                      }
                    />
                    <textarea
                      className="w-full border p-2 rounded mb-4"
                      placeholder="Notes (optional)"
                      value={newContact.notes}
                      onChange={(e) =>
                        setNewContact({ ...newContact, notes: e.target.value })
                      }
                    ></textarea>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewContactForm(false);
                          setEditingContact(null);
                        }}
                        className="px-3 py-1 text-sm bg-gray-300 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingContact}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded disabled:opacity-50"
                      >
                        Save Contact
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
