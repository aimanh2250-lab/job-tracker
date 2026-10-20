import {useState, useEffect} from 'react';
import type {Job, JobPage, Status} from "../types.ts";
import {api, downloadFile} from "../api";
import {Link, useNavigate} from "react-router";

const statusColors : Record<Status, string> = {
    APPLIED: "bg-blue-100 text-blue-700",
    INTERVIEW: "bg-amber-100 text-amber-700",
    OFFER: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
}

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
            setTotalElements(totalElements - 1);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto p-4 sm:p-8">
                <header className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">My Jobs</h1>
                        <p className="text-sm text-gray-500">{totalElements} {totalElements === 1 ? "application" : "applications"}</p>
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
                {jobs.length === 0 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
                        <p>No Jobs Found</p>
                        <Link className="text-blue-600 underline" to="/jobs/new">Add job</Link>
                    </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => ( /* for EACH job in the jobs box*/
                        <div key={job.id}
                             className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition flex flex-col">
                            <div className="flex items-start justify-between gap-2">
                                <h2 className="font-semibold text-lg">{job.company}</h2>
                                <span
                                    className={"text-xs font-medium px-2 py-1 rounded-full " + statusColors[job.status]}>{job.status}</span>
                            </div>
                            <p className="text-gray-600">{job.role}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Applied {new
                            Date(job.appliedDate).toLocaleDateString("en-GB", {
                                day:
                                    "numeric", month: "short", year: "numeric"
                            })}
                            </p>
                            {job.notes && <p className="text-sm text-gray-500 italic mt-2">{job.notes}</p>}
                            <div className="mt-auto pt-4 flex justify-end gap-3">
                                <Link className="text-blue-600 underline ml-2"
                                      to={"/jobs/" + job.id + "/edit"}>Edit</Link>
                                {job.hasResume && (
                                <button className="text-gray-700 underline ml-2"
                                        onClick={() => downloadFile("/api/jobs/" + job.id + "/resume", "resume-" + job.company)}>Resume
                                </button>
                                )}
                                <button className="text-red-600 underline ml-2"
                                        onClick={() => handleDelete(job.id)}>Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                <button className="bg-sky-500 hover:bg-sky-700 text-white rounded p-2 disabled:opacity-50"
                        onClick={() => setPage(page - 1)} disabled={page === 0}>Previous
                </button>
                {/* go back one page; faded on the first page */}
                <span className="mx-2">Page {page + 1} of {totalPages} {/* show Page X of Y */}</span>
                <button className="bg-sky-500 hover:bg-sky-700 text-white rounded p-2 disabled:opacity-50"
                        onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>Next
                </button> {/* go forward one page; faded on the last page */}
                </div>
                )}
            </div>
        </div>

    );
}