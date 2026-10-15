import {type FormEvent, useState} from "react";
import { useNavigate } from "react-router";
import {api} from "../api.ts";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault(); //stops the page from reloading
        try { //try this; if it fails, catch shows the error
            await api("/api/auth/register", {method: "POST", body: JSON.stringify({email, password})});//JSON.stringify changes memory to json
            navigate("/login");
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return (
        <form className="max-w-sm mx-auto mt-16 flex flex-col gap-3" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold">Register</h1>
            <input className="border rounded p-2" placeholder="Email" type="email"
                   value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input className="border rounded p-2" placeholder="Password" type="password"
                   value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className="bg-blue-600 text-white rounded p-2">Register</button>
            {error && <p className="text-red-600">{error}</p>} {/*red error message*/}
        </form>
    );
}
