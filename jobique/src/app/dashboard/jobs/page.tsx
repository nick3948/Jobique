"use client";

import ShareModal from "@/components/ui/ShareModal";
import { useEffect, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Tag,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Share2,
  MoreHorizontal,
  ExternalLink,
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  Upload,
  Loader2,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  resumeUrl?: string;
  shared?: boolean;
}

export default function JobsPage() {
  const { user } = useUser();
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
    resumeUrl: "",
  });
  const [editJobId, setEditJobId] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [jobIdInFocus, setJobIdInFocus] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [showStatusSelect, setShowStatusSelect] = useState(false);

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

  const groupedJobs = currentJobs.reduce((groups, job) => {
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

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("Saved");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [messageParams, setMessageParams] = useState<{
    contactName: string;
    jobTitle: string;
    company: string;
  } | null>(null);
  const [messageCache, setMessageCache] = useState<Record<string, string>>({});



  const handleAutoFill = async () => {
    if (!form.link) return;
    setIsExtracting(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.link }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => {
          const newTitle = data.title || prev.title;
          return {
            ...prev,
            title: newTitle,
            company: data.company || prev.company,
            location: data.location || prev.location,
            notes: prev.notes,
            tags: data.tags && Array.isArray(data.tags) ? data.tags.join(", ") : prev.tags,
          };
        });
      } else {
        toast.error(data.error || "Could not extract details. Please fill manually.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Extraction failed.");
    }
    setIsExtracting(false);
  };

  const handleGenerateMessage = async (contact: Contact) => {
    const job = jobs.find((j) => j.id === jobIdInFocus);
    if (!job) return;

    const cacheKey = `${job.id}-${contact.id || contact.name}`;

    setMessageParams({
      contactName: contact.name,
      jobTitle: job.title,
      company: job.company,
    });
    setShowMessageModal(true);

    if (messageCache[cacheKey]) {
      setGeneratedMessage(messageCache[cacheKey]);
      setIsGeneratingMessage(false);
      return;
    }

    setGeneratedMessage("");
    setIsGeneratingMessage(true);

    try {
      const res = await fetch("/api/ai/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          contactName: contact.name,
          contactRole: "",
          userName: user?.fullName || user?.firstName || "Me",
          tone: "Professional",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedMessage(data.message);
        setMessageCache((prev) => ({ ...prev, [cacheKey]: data.message }));
      } else {
        setGeneratedMessage("Error: " + data.error);
      }
    } catch (e) {
      setGeneratedMessage("Failed to generate message.");
    }
    setIsGeneratingMessage(false);
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get Presigned URL
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2. Upload to S3
      const uploadRes = await fetch(data.signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("Upload failed");

      // 3. Save URL to form
      setForm((prev) => ({ ...prev, resumeUrl: data.fileUrl }));
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload resume");
    }
    setIsUploading(false);
  };

  const handleViewResume = async (fileUrl: string) => {
    try {
      const res = await fetch("/api/upload/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
      });
      const data = await res.json();
      if (data.signedUrl) {
        window.open(data.signedUrl, "_blank");
      } else {
        toast.error("Failed to get secure link");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error opening resume");
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedJobIds }),
      });

      if (res.ok) {
        setSelectedJobIds([]);
        fetchJobs();
        setShowDeleteModal(false);
      } else {
        const errorText = await res.text();
        toast.error("Failed to delete selected jobs: " + errorText);
      }
    } catch (err) {
      console.error("Fetch DELETE error:", err);
      toast.error("Something went wrong.");
    }
    setIsDeleting(false);
  };

  const handleBulkStatusUpdate = async () => {
    if (isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      const applied_date = bulkStatus === "Saved" ? null : new Date();
      const res = await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedJobIds, status: bulkStatus, applied_date }),
      });

      if (res.ok) {
        setShowStatusModal(false);
        setBulkStatus("Saved");
        setSelectedJobIds([]);
        await fetchJobs();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Something went wrong");
    }
    setIsUpdatingStatus(false);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      ...form,
      applied_date:
        form.status === "Saved"
          ? null
          : form.applied_date
            ? new Date(form.applied_date + "T00:00")
            : new Date(),
      tags: form.tags.split(",").map((t) => t.trim()),
      resources: form.resources.split(",").map((r) => r.trim()),
      ...(editJobId !== null && { id: editJobId }),
    };
    let oldStatus: string | null = null;
    if (editJobId !== null) {
      const existingJob = jobs.find((job) => job.id === editJobId);
      oldStatus = existingJob?.status ?? null;
    }
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
        status: "Saved",
        applied_date: "",
        notes: "",
        tags: "",
        resources: "",
        resumeUrl: "",
      });
      fetchJobs();
      if (
        form.status === "Applied" &&
        (editJobId === null || oldStatus !== "Applied")
      ) {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 300,
          spread: 360,
          startVelocity: 60,
          ticks: 200,
          origin: { x: 0.5, y: 0.5 },
        });
      }
    } else {
      toast.error("Failed to save job entry");
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Job Tracker</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Manage and optimize your job applications, documents, and follow-ups.
          </p>
        </div>

        {/* Modern Toolbar */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm w-48 focus:w-64 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <div className="relative">
            <div
              className="relative flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg py-2 pl-3 pr-4 transition-colors border border-transparent focus-within:border-blue-100 focus-within:ring-2 focus-within:ring-blue-100"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <Filter className="text-gray-400 w-4 h-4" />
              <span className="text-sm text-gray-700 min-w-[5rem] font-medium">{statusFilter}</span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {showStatusDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowStatusDropdown(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-30 overflow-hidden py-1"
                  >
                    {["All Statuses", "Saved", "Applied", "Interviewing", "Rejected", "Offered"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2
                           ${statusFilter === status ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}
                         `}
                      >
                        {status === "All Statuses" ? (
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                        ) : (
                          <div className={`w-2 h-2 rounded-full 
                             ${status === "Saved" ? "bg-gray-400" :
                              status === "Applied" ? "bg-green-400" :
                                status === "Interviewing" ? "bg-yellow-400" :
                                  status === "Rejected" ? "bg-red-400" :
                                    "bg-orange-400"
                            }
                           `} />
                        )}
                        {status}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            className="ml-2 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition-all text-sm font-medium shadow-md hover:shadow-lg active:scale-95"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4" />
            New Job
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
              <div className="flex gap-2">
                <input
                  required
                  value={form.link}
                  type="url"
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="Job Link"
                  className="border p-2 rounded flex-1"
                />
                <button
                  type="button"
                  onClick={handleAutoFill}
                  disabled={isExtracting || !form.link}
                  className="bg-teal-600 text-white px-3 py-2 rounded hover:bg-teal-700 disabled:opacity-50 text-sm whitespace-nowrap"
                >
                  {isExtracting ? "..." : "Auto-fill"}
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`flex items-center gap-2 px-3 py-2 border rounded cursor-pointer w-full hover:bg-gray-50 transition-colors ${form.resumeUrl ? 'border-green-200 bg-green-50' : ''}`}
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    ) : (
                      <Upload className={`w-4 h-4 ${form.resumeUrl ? 'text-green-600' : 'text-gray-500'}`} />
                    )}
                    <span className={`text-sm ${form.resumeUrl ? 'text-green-700' : 'text-gray-600'}`}>
                      {form.resumeUrl ? "Resume Attached" : "Upload Resume (PDF)"}
                    </span>
                  </label>
                  {form.resumeUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ ...form, resumeUrl: "" });
                        toast.success("Resume removed successfully!");
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

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
              <div className="relative">
                <div
                  className="border p-2 rounded flex items-center justify-between cursor-pointer bg-white hover:border-gray-400 transition-colors"
                  onClick={() => setShowStatusSelect(!showStatusSelect)}
                >
                  <span className={`flex items-center gap-2 text-sm font-medium
                    ${form.status === "Saved" ? "text-gray-600" :
                      form.status === "Applied" ? "text-green-600" :
                        form.status === "Interviewing" ? "text-yellow-600" :
                          form.status === "Offered" ? "text-orange-600" :
                            form.status === "Rejected" ? "text-red-600" :
                              "text-blue-600"
                    }`}>
                    <div className={`w-2 h-2 rounded-full
                      ${form.status === "Saved" ? "bg-gray-400" :
                        form.status === "Applied" ? "bg-green-400" :
                          form.status === "Interviewing" ? "bg-yellow-400" :
                            form.status === "Offered" ? "bg-orange-400" :
                              form.status === "Rejected" ? "bg-red-400" :
                                "bg-blue-400"
                      }`} />
                    {form.status}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showStatusSelect ? "rotate-180" : ""}`} />
                </div>
                <AnimatePresence>
                  {showStatusSelect && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowStatusSelect(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden"
                      >
                        {["Saved", "Applied", "In Progress", "Interviewing", "Offered", "Rejected"].map((status) => (
                          <div
                            key={status}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center justify-between
                              ${form.status === status ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}
                            `}
                            onClick={() => {
                              setForm({ ...form, status });
                              setShowStatusSelect(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full
                                ${status === "Saved" ? "bg-gray-400" :
                                  status === "Applied" ? "bg-green-400" :
                                    status === "Interviewing" ? "bg-yellow-400" :
                                      status === "Offered" ? "bg-orange-400" :
                                        status === "Rejected" ? "bg-red-400" :
                                          "bg-blue-400"
                                }`} />
                              {status}
                            </div>
                            {form.status === status && <Check className="w-4 h-4" />}
                          </div>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">
                  H1B Sponsors?
                </label>
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
              </div>
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
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                  disabled={isSubmitting}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedJobIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 mb-4 p-2 bg-blue-50/50 backdrop-blur-sm border border-blue-100 rounded-xl"
          >
            <span className="text-sm font-medium text-blue-700 px-3">
              {selectedJobIds.length} Selected
            </span>
            <div className="h-6 w-px bg-blue-200"></div>

            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>

            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
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
                    resumeUrl: jobToEdit.resumeUrl || "",
                  });
                  setEditJobId(jobToEdit.id);
                  setShowModal(true);
                }
              }}
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>

            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setShowShareModal(true)}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>

            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              onClick={() => setShowStatusModal(true)}
            >
              <MoreHorizontal className="w-4 h-4" />
              Change Status
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-6 pb-20">
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Briefcase className="w-12 h-12 opacity-20 mb-3" />
            <p>No jobs found.</p>
          </div>
        ) : (
          Object.entries(groupedJobsRes).map(([dateLabel, jobsForDate]) => (
            <div key={dateLabel} className="space-y-3">
              <div className="px-1 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50/95 py-2 backdrop-blur-sm z-10">
                {dateLabel}
              </div>
              {jobsForDate.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.99] transition-transform"
                  onClick={() => {
                    setJobIdInFocus(job.id);
                    setEditJobId(job.id);
                    // setShowModal(true); 
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{job.title}</h3>
                      <p className="text-gray-600 text-sm mt-0.5">{job.company}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${job.status === "Applied" ? "bg-green-100 text-green-700 border-green-200" :
                      job.status === "Rejected" ? "bg-red-100 text-red-700 border-red-200" :
                        job.status === "Interviewing" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                          job.status === "Offered" ? "bg-orange-100 text-orange-700 border-orange-200" :
                            "bg-gray-100 text-gray-700 border-gray-200"
                      }`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                        {tag}
                      </span>
                    ))}
                    {job.tags.length > 3 && <span className="text-[10px] text-gray-400">+{job.tags.length - 3}</span>}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                    <div className="flex items-center text-xs text-gray-400 gap-1">
                      <MapPin className="w-3 h-3" /> {job.location || "Remote"}
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={job.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-full text-blue-600 hover:bg-blue-100" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      {job.resumeUrl && (
                        <button
                          className="p-2 bg-gray-50 rounded-full text-purple-600 hover:bg-purple-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewResume(job.resumeUrl!);
                          }}
                          title="View Resume"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="p-2 bg-gray-50 rounded-full text-amber-600 hover:bg-amber-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setForm({
                            title: job.title,
                            company: job.company,
                            location: job.location,
                            pay: job.pay ?? "",
                            h1bSponsor: job.h1bSponsor,
                            link: job.link,
                            status: job.status,
                            applied_date: job.applied_date ? new Date(job.applied_date).toISOString().split("T")[0] : "",
                            notes: job.notes ?? "",
                            tags: job.tags.join(", "),
                            resources: job.resources.join(", "),
                            resumeUrl: job.resumeUrl || "",
                          });
                          setEditJobId(job.id);
                          setShowModal(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 bg-gray-50 rounded-full text-red-600 hover:bg-red-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJobIds([job.id]);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <div className="hidden md:flex flex-1 border rounded-xl flex-grow overflow-hidden shadow-sm bg-white border-gray-200 flex flex-col">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table
            id="job-table"
            className="min-w-full table-auto text-left"
          >
            <thead className="glass-header sticky top-0 z-10 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                <th className="px-6 py-3">Job Title ({filteredJobs.length})</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Applied</th>
                <th className="px-6 py-3">Links/Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Briefcase className="w-8 h-8 opacity-20" />
                      <p>No job applications found. Start by adding one!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                Object.entries(groupedJobsRes).map(([dateLabel, jobsForDate]) => (
                  <React.Fragment key={dateLabel}>
                    <tr>
                      <td
                        colSpan={7}
                        className="bg-gray-50/50 px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {dateLabel}
                      </td>
                    </tr>
                    {jobsForDate.map((job) => (
                      <tr
                        key={job.id}
                        className={`group transition-colors ${job.status === "Applied"
                          ? "bg-green-100/60 hover:bg-green-100"
                          : job.status === "In Progress"
                            ? "bg-blue-100/60 hover:bg-blue-100"
                            : job.status === "Interviewing"
                              ? "bg-yellow-100/60 hover:bg-yellow-100"
                              : job.status === "Offered"
                                ? "bg-orange-100/60 hover:bg-orange-100"
                                : job.status === "Rejected"
                                  ? "bg-red-100/60 hover:bg-red-100"
                                  : "bg-white hover:bg-gray-50"
                          }`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity checked:opacity-100"
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
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {job.title}
                            {job.shared && (
                              <div className="bg-blue-100 p-1 rounded-full group/shared relative cursor-help">
                                <Users className="w-3 h-3 text-blue-600" />
                                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/shared:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                  Shared with you
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 mt-1">
                            {job.tags.map((tag, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 flex items-center gap-1">
                                <Tag className="w-3 h-3" /> {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700">
                          {job.company}
                          {job.h1bSponsor && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100">H1B</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm whitespace-nowrap inline-block ${job.status === "Applied" ? "bg-green-200 text-green-800 border-green-300" :
                            job.status === "Rejected" ? "bg-red-200 text-red-800 border-red-300" :
                              job.status === "Interviewing" ? "bg-yellow-200 text-yellow-800 border-yellow-300" :
                                job.status === "Offered" ? "bg-orange-200 text-orange-900 border-orange-300" :
                                  "bg-gray-200 text-gray-700 border-gray-300"
                            }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm flex flex-col gap-1">
                          <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</div>
                          {job.pay && <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.pay}</div>}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <Calendar className="w-3 h-3" />
                            {job.applied_date
                              ? new Date(job.applied_date).toLocaleDateString("en-CA", { month: 'short', day: 'numeric' })
                              : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            {job.resumeUrl && (
                              <button
                                onClick={() => handleViewResume(job.resumeUrl!)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="View Resume"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              className="text-gray-400 hover:text-purple-600 transition-colors relative"
                              onClick={() => {
                                setJobIdInFocus(job.id);
                                setShowContactModal(true);
                              }}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
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
        <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstJob + 1} to {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-700 px-2">
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
              className="p-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        {showShareModal && (
          <ShareModal
            jobIds={selectedJobIds}
            onClose={() => setShowShareModal(false)}
          />
        )}

        {showStatusModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
              <h2 className="text-xl font-bold mb-4">Change Status</h2>
              <p className="mb-4 text-gray-600">
                Update status for {selectedJobIds.length} selected job(s).
              </p>
              <select
                className="w-full border p-2 rounded mb-6"
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
              >
                <option>Saved</option>
                <option>Applied</option>
                <option>In Progress</option>
                <option>Interviewing</option>
                <option>Offered</option>
                <option>Rejected</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkStatusUpdate}
                  disabled={isUpdatingStatus}
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {isUpdatingStatus ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
              <h2 className="text-xl font-bold text-red-600 mb-4">Delete Jobs?</h2>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-bold">{selectedJobIds.length}</span> job(s)?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
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
                            className="text-purple-600 text-sm cursor-pointer hover:font-bold"
                            onClick={() => handleGenerateMessage(contact)}
                          >
                            ✨ Draft Message
                          </button>
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
                                toast.error("Failed to delete contact");
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
                          toast.error(
                            "This contact already exists for the selected job."
                          );
                        } else {
                          toast.error("Failed to save contact");
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

        {showMessageModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                Draft Message for {messageParams?.contactName}
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Generated Message
                </label>
                <textarea
                  className="w-full border p-2 rounded h-40"
                  value={isGeneratingMessage ? "Generating..." : generatedMessage}
                  readOnly
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedMessage);
                    toast.success("Message copied to clipboard!");
                  }}
                  disabled={isGeneratingMessage || !generatedMessage}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
