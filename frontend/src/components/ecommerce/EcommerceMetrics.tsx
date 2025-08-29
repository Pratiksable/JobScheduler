import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
  const [totalJobs, setTotalJobs] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  // just an example, you can calculate changes however you want
  const [jobsChange, setJobsChange] = useState(0);
  const [completedChange, setCompletedChange] = useState(0);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("http://localhost:8000/schedules/");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();

        if (Array.isArray(data)) {
          setTotalJobs(data.length);
          setCompletedJobs(data.filter((job) => job.is_completed).length);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading metrics...</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Total Jobs Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Jobs
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalJobs}
            </h4>
          </div>
          <Badge color={jobsChange >= 0 ? "success" : "error"}>
            {jobsChange >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(jobsChange)}%
          </Badge>
        </div>
      </div>
      {/* Completed Jobs Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Completed Jobs
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {completedJobs}
            </h4>
          </div>
          <Badge color={completedChange >= 0 ? "success" : "error"}>
            {completedChange >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(completedChange)}%
          </Badge>
        </div>
      </div>
    </div>
  );
}
