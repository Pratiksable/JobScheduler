import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";

export default function DefaultInputs() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    schedule_interval: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.schedule_interval) {
      setError("All fields are required.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/schedules/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Failed to create job");
      setSuccess("Job created successfully!");
      setForm({ title: "", description: "", schedule_interval: "" });
    } catch {
      setError("Error creating job. Please try again.");
    }
  };

  return (
    <ComponentCard title="Create Job">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Weekly Report"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g. Send project status report to the manager"
            className="w-full p-2 border rounded dark:bg-dark-900"
            required
          />
        </div>
        <div>
          <Label htmlFor="schedule_interval">Schedule Interval</Label>
          <Input
            type="text"
            id="schedule_interval"
            name="schedule_interval"
            value={form.schedule_interval}
            onChange={handleChange}
            placeholder="e.g. 5 18 27 8 *"
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <button
          type="submit"
          className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
        >
          Create Job
        </button>
      </form>
    </ComponentCard>
  );
}
