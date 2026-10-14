import { useState, useEffect } from 'react';
import type {Job, JobPage} from "../types.ts";
import { api } from "../api";

export default function JobsPage(){
const [jobs , setJobs] = useState<Job[]>([]);

useEffect(() => {
    async function load(){
        const data: JobPage = await api ("/api/jobs");
        setJobs(data.content);
    }
    load();
}, []);

return (
    <div className="p-8">
        <h1 className="text-2xl font-bold">My Jobs</h1>

    <ul>
        {jobs.map((job) => (
            <li key={job.id}>{job.company} - {job.role} - {job.status}</li>
            ))}
    </ul></div>
);
}