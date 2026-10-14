import { useState, useEffect } from 'react';
import type {Job, JobPage} from "../types.ts";
import { api } from "../api";
import {useNavigate} from "react-router";

export default function JobsPage(){
    const navigate = useNavigate();
    const [jobs , setJobs] = useState<Job[]>([]);


useEffect(() => {
    async function load(){
        const data: JobPage = await api ("/api/jobs");
        setJobs(data.content);
    }
    load();
}, []);

function handleLogout(){
    localStorage.removeItem("token");
    navigate("/login");
}

return (
    <div className="p-8">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <button className="bg-blue-600 text-white rounded p-2" onClick={handleLogout}>Logout</button>
    <ul>
        {jobs.map((job) => (
            <li key={job.id}>{job.company} - {job.role} - {job.status}</li>
            ))}
    </ul></div>
);
}