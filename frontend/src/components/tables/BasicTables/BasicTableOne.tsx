import { useEffect, useState } from "react";

interface Job {
  id: number;
  title: string;
  description: string;
  schedule_interval: string;
  is_completed: boolean;
  last_run: string | null;
  next_run: string | null;
  created_at: string;
  updated_at: string;
}

export default function BasicTableOne() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    schedule_interval: "",
  });

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await fetch("http://localhost:8000/schedules/");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setError("Error loading jobs");
    } finally {
      setLoading(false);
    }
  }

  async function deleteJob(id: number) {
    try {
      const res = await fetch(`http://localhost:8000/schedules/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete job");
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  function openEditModal(job: Job) {
    setEditJob(job);
    setEditForm({
      title: job.title,
      description: job.description,
      schedule_interval: job.schedule_interval,
    });
    setOpenMenuId(null);
  }

  async function submitEditJob() {
    if (!editJob) return;
    try {
      const res = await fetch(`http://localhost:8000/schedules/${editJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update job");
      setEditJob(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  }

  // 🔎 Filter jobs
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.id.toString().includes(search)
  );

  // 📄 Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 text-white">
      <div className="p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // ✅ reset to page 1 on search
          }}
          placeholder="Search by Title or ID..."
          className="w-full max-w-xs px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500 text-white"
        />
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Schedule Interval</th>
              <th className="px-4 py-2">Completed</th>
              <th className="px-4 py-2">Last Run</th>
              <th className="px-4 py-2">Next Run</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Updated At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={10} className="text-center text-red-500 py-6">
                  {error}
                </td>
              </tr>
            ) : paginatedJobs.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-6">
                  No jobs found.
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job, idx) => (
                <tr key={job.id} className="border-b">
                  <td className="px-4 py-2">{job.id}</td>
                  <td className="px-4 py-2">{job.title}</td>
                  <td className="px-4 py-2">{job.description}</td>
                  <td className="px-4 py-2">{job.schedule_interval}</td>
                  <td className="px-4 py-2">
                    {job.is_completed ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2">{job.last_run || "-"}</td>
                  <td className="px-4 py-2">{job.next_run || "-"}</td>
                  <td className="px-4 py-2">
                    {new Date(job.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(job.updated_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === job.id ? null : job.id)
                      }
                      className="p-2 rounded hover:bg-gray-100"
                    >
                      ⋮
                    </button>
                    {openMenuId === job.id && (
                      <div
                        className={`absolute right-0 w-32 bg-black border rounded shadow-lg z-10
                          ${
                            idx === paginatedJobs.length - 1
                              ? "bottom-full mb-2"
                              : "mt-2"
                          }`}
                      >
                        <button
                          onClick={() => openEditModal(job)}
                          className="block w-full text-left px-4 py-2 hover:bg-green-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            deleteJob(job.id);
                            setOpenMenuId(null);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📌 Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 p-4 text-black">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                page === currentPage ? "bg-blue-600 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Job Modal */}
      {editJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
            <h2 className="text-lg font-semibold mb-4">Edit Job</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitEditJob();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Schedule Interval</label>
                <input
                  type="text"
                  value={editForm.schedule_interval}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      schedule_interval: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditJob(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
