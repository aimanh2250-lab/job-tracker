import {Link, useParams} from "react-router";
import {type FormEvent, useEffect, useState} from "react";
import {api} from "../api.ts";
import {useNavigate} from "react-router";
import type {Job} from "../types.ts";

export default function JobFormPage() {
    const {id} = useParams();
    const isEdit = id !== undefined; // !== is NOT
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [appliedDate, setAppliedDate] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('APPLIED');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function load() {
            if (!isEdit) return;
            const job: Job = await api("/api/jobs/" + id);
            setCompany(job.company);
            setRole(job.role);
            setAppliedDate(job.appliedDate);
            setStatus(job.status);
            setNotes(job.notes ?? "");
        }

        load();
    }, [id, isEdit]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault(); //stops the page from reloading
        try { //try this; if it fails, catch shows the error
            const body = JSON.stringify({company, role, notes, appliedDate, status});//JSON.stringify changes memory to json
            if (isEdit) {
                await api("/api/jobs/" + id, {method: "PUT", body: body});
            } else {
                await api("/api/jobs", {method: "POST", body: body});
            }
            navigate("/jobs");
        } catch (err) {
            setError((err as Error).message);
        }
    }

    async function handleUpload() {
        if (!resumeFile) {
            setError("Please choose a PDF or DOCX file first");
            return;
        }
        const formData = new FormData();
        formData.append("file", resumeFile);
        try {
            await api("/api/jobs/" + id + "/resume", {method: "POST", body: formData});
            setMessage("Resume uploaded");
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <form className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm flex flex-col gap-4"
                  onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold">{isEdit ? "Edit job" : "Add job"}</h1>
                <input
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company" value={company} required={true}
                    onChange={(e) => setCompany(e.target.value)}/>
                <input
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Role" value={role} required={true}
                    onChange={(e) => setRole(e.target.value)}/>
                <textarea
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Notes" value={notes}
                    onChange={(e) => setNotes(e.target.value)}/>
                {!isEdit && (
                    <p className="text-sm text-gray-500">Save the job first, then you can upload a resume from Edit.</p>
                )}
                {isEdit && (
                    <div className="flex items-center gap-2">
                        <input type="file" accept=".pdf,.docx" className="text-sm"
                               onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}/>
                        <button type="button" onClick={handleUpload}
                                className="bg-gray-700 hover:bg-gray-800 text-white text-sm rounded-lg px-3 py-1"> Upload
                            Resume
                        </button>
                        {message && <p className="text-green-600">{message}</p>}
                    </div>
                )}
                <input
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Applied Date" type="date" value={appliedDate}
                    required={true}
                    onChange={(e) => setAppliedDate(e.target.value)}/>
                <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}> {/* choose the status */}
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                </select>
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium">Save</button>
                <Link className="text-sm text-gray-500 hover:underline text-center" to="/jobs">Cancel</Link>
                {error && <p className="text-red-600">{error}</p>} {/*red error message*/}
            </form>
        </div>
    );
}
