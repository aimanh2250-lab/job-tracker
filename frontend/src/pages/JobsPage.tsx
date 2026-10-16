import {useState, useEffect} from 'react';
import type {Job, JobPage} from "../types.ts";
import {api} from "../api";
import {Link, useNavigate} from "react-router";

export default function JobsPage() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('appliedDate,desc');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => { //reloads whenever search, status or sort change or page
        async function load() {
            const params = new URLSearchParams();
            params.set("q", search); //add the search text (?q=)
            params.set("sort", sort); //add the chosen order (?sort=)
            params.set('page', String(page)); //which page to load (?page=)
            if (status) { //only if a status is chosen, add ?status=
                params.set("status", status);
            }
            const data: JobPage = await api("/api/jobs?" + params.toString());
            setTotalElements(data.page.totalElements);
            setJobs(data.content);
            setTotalPages(data.page.totalPages); //remember how many pages there are

        }

        load();
    }, [search, status, sort, page]); //watch list : if any of this change then react runs the effect and reload the job list

    function handleLogout() { //log out: forget the token and go to login
        localStorage.removeItem("token");
        navigate("/login");
    }

    async function handleDelete(id: number) { //delete jobs method
        if (window.confirm("Do you want to delete this job?")) {
            await api("/api/jobs/" + id, {method: "DELETE"});
            setJobs(jobs.filter((job) => job.id !== id)); //keep everything excepts one that removed
        }
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto p-4 sm:p-8">
                <header className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">My Jobs</h1>
                        <p className="text-sm text-gray-500">{totalElements} applications</p>
                    </div>

                    <div className="flex gap-2">
                        <button className="bg-blue-600 text-white rounded p-2" onClick={handleLogout}>Logout</button>
                        {/* logout button */}
                        <Link className="bg-blue-600 text-white rounded p-2" to="/jobs/new">Add job</Link>
                    </div>
                </header>
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
                    <input /* search function */
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                        placeholder="Search company or role"
                        type="search"
                        value={search} onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(0);
                    }}/>
                    <select //status dropdown
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={status} onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(0);
                    }}> {/* filter by status */}
                        <option value="">All Status</option>
                        <option value="APPLIED">Applied</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    <select /* choose the order (newest, oldest, A-Z) */
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={sort} onChange={(e) => {
                        setSort(e.target.value);
                        setPage(0);
                    }}>
                        <option value="appliedDate,desc">Newest First</option>
                        <option value="appliedDate,asc">Oldest First</option>
                        <option value="company,asc">Company A - Z</option>
                    </select>
                </div>
                <ul>
                    {jobs.map((job) => ( /* for EACH job in the jobs box*/
                        <li key={job.id}>{job.company} - {job.role} - {job.status}
                            <Link className="text-blue-600 underline ml-2" to={"/jobs/" + job.id + "/edit"}>Edit</Link>
                            <button className="text-red-600 underline ml-2"
                                    onClick={() => handleDelete(job.id)}>Delete
                            </button>
                        </li>/* what the line shows */
                    ))}
                </ul>
                <button className="bg-sky-500 hover:bg-sky-700 text-white rounded p-2 disabled:opacity-50"
                        onClick={() => setPage(page - 1)} disabled={page === 0}>Previous
                </button>
                {/* go back one page; faded on the first page */}
                <span className="mx-2">Page {page + 1} of {totalPages} {/* show Page X of Y */}</span>
                <button className="bg-sky-500 hover:bg-sky-700 text-white rounded p-2 disabled:opacity-50"
                        onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>Next
                </button>
                {/* go forward one page; faded on the last page */}
            </div>
        </div>

    );
}