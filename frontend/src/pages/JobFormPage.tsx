import {Link, useParams} from "react-router";
import {useState} from "react";

export default function JobFormPage(){
    const {id} = useParams();
    const isEdit = id !== undefined; // !== is NOT
    const [company , setCompany] = useState('');
    const [role, setRole] = useState('');
    const [appliedDate, setAppliedDate] = useState('');
    const [notes , setNotes] = useState('');
    const [status, setStatus] = useState('APPLIED');

    return (
        <form className="max-w-sm mx-auto mt-16 flex flex-col gap-3">
            <h1 className="text-2xl font-bold p-8">{isEdit ? "Edit job" : "Add job"}</h1>
            <input className="border rounded p-2" placeholder="Company" value={company}
                   onChange={(e) => setCompany(e.target.value)}/>
            <input className="border rounded p-2" placeholder="Role" value={role}
                   onChange={(e) => setRole(e.target.value)}/>
            <textarea className="border rounded p-2" placeholder="Notes" value={notes}
                   onChange={(e) => setNotes(e.target.value)}/>
            <input className="border rounded p-2" placeholder="Applied Date" type="date" value={appliedDate}
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
        </form>
    );
}
