import {type FormEvent, useState} from "react";
import {Link, useNavigate} from "react-router";
import {api} from "../api.ts";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault(); //stops the page from reloading
        localStorage.removeItem("token");
        try { //try this; if it fails, catch shows the error
            const data = await api("/api/auth/login", {method: "POST", body: JSON.stringify({email, password})}); //JSON.stringify changes memory to json
            localStorage.setItem("token", data.token);
            navigate("/jobs");
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm flex flex-col gap-4" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold">Log in</h1>
            <input className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email" type="email"
                   value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Password" type="password"
                   value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium">Log In</button>
            {error && <p className="text-red-600">{error}</p>} {/*red error message*/}
            <Link className="text-sm text-blue-600 hover:underline text-center" to="/register">Register here</Link>
        </form>
        </div>
    );
}