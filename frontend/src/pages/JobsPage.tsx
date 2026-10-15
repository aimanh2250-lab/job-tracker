import { useState, useEffect } from 'react';
import type {Job, JobPage} from "../types.ts";
import { api } from "../api";
import {useNavigate} from "react-router";

export default function JobsPage(){
    const navigate = useNavigate();
    const [jobs , setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sort , setSort] = useState('appliedDate,desc');
    const [page , setPage] = useState(0);
    const [totalPages , setTotalPages] = useState(0);

useEffect(() => { //reloads whenever search, status or sort change or page
    async function load(){
        const params = new URLSearchParams();
        params.set("q", search); //add the search text (?q=)
        params.set("sort", sort); //add the chosen order (?sort=)
        params.set('page', String(page)); //which page to load (?page=)
        if (status){ //only if a status is chosen, add ?status=
            params.set("status", status);
        }
        const data:JobPage = await api("/api/jobs?" + params.toString());
        setJobs(data.content);
        setTotalPages(data.page.totalPages); //remember how many pages there are

    }
    load();
}, [search , status , sort , page]);

function handleLogout(){ //log out: forget the token and go to login
    localStorage.removeItem("token");
    navigate("/login");
}

return (
    <div className="p-8">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <button className="bg-blue-600 text-white rounded p-2" onClick={handleLogout}>Logout</button> {/* logout button */}
        <input className = "border rounded p-2" placeholder="Search company or role" type="search" /* search function */
               value={search} onChange={(e) => {setSearch(e.target.value); setPage(0);}}/>
        <select className="border rounded p-2"
                value={status} onChange={(e) => {setStatus(e.target.value); setPage(0);}}> {/* filter by status */}
            <option value="">All Status</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
        </select>
        <select className="border rounded p-2" /* choose the order (newest, oldest, A-Z) */
                value={sort} onChange={(e) => {setSort(e.target.value); setPage(0);}}>
            <option value="appliedDate,desc">Newest First</option>
            <option value="appliedDate,asc">Oldest First</option>
            <option value="company,asc">Company A - Z</option>
        </select>
    <ul>
        {jobs.map((job) => ( /* for EACH job in the jobs box*/
            <li key={job.id}>{job.company} - {job.role} - {job.status}</li> /* what the line shows */
            ))}
    </ul>
        <button className="bg-sky-500 hover:bg-sky-700 text-white rounded p-2 disabled:opacity-50"
                onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button> {/* go back one page; faded on the first page */}
        <span className="mx-2">Page {page + 1} of {totalPages} {/* show Page X of Y */}</span>
        <button className="bg-sky-500 hover:bg-sky-700 text-white rounded p-2 disabled:opacity-50"
                onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>Next</button> {/* go forward one page; faded on the last page */}
    </div>

);
}