import {Link, useParams} from "react-router";
import {type FormEvent, useEffect, useState} from "react";
import {api} from "../api.ts";
import {useNavigate} from "react-router";
import type {Job} from "../types.ts";

export default function JobFormPage(){
    const {id} = useParams();
    const isEdit = id !== undefined; // !== is NOT
    const [company , setCompany] = useState('');
    const [role, setRole] = useState('');
    const [appliedDate, setAppliedDate] = useState('');
    const [notes , setNotes] = useState('');
    const [status, setStatus] = useState('APPLIED');
    const [error, setError] = useState('');
    const navigate = useNavigate();

useEffect(() =>{
    async function load(){
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
            if (isEdit){
                await api("/api/jobs/" + id, {method: "PUT", body:body});
            } else {
                await api("/api/jobs", { method: "POST", body: body });
            }
            navigate("/jobs");
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return (
        <form className="max-w-sm mx-auto mt-16 flex flex-col gap-3" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold p-8">{isEdit ? "Edit job" : "Add job"}</h1>
            <input className="border rounded p-2" placeholder="Company" value={company} required={true}
                   onChange={(e) => setCompany(e.target.value)}/>
            <input className="border rounded p-2" placeholder="Role" value={role} required={true}
                   onChange={(e) => setRole(e.target.value)}/>
            <textarea className="border rounded p-2" placeholder="Notes" value={notes}
                   onChange={(e) => setNotes(e.target.value)}/>
            <input className="border rounded p-2" placeholder="Applied Date" type="date" value={appliedDate} required={true}
                   onChange={(e) => setAppliedDate(e.target.value)}/>
            <select className="border rounded p-2" value={status}
                    onChange={(e) => setStatus(e.target.value)}> {/* filter by status */}
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
            </select>
            <button className="bg-blue-600 text-white rounded p-2">Save</button>
            <Link to="/jobs">Cancel</Link>
            {error && <p className="text-red-600">{error}</p>} {/*red error message*/}
        </form>
    );
}
