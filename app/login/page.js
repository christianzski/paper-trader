'use client'
import Link from 'next/link'

export default function Page() {
    async function login() {
        const response = await fetch("/login", {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify( {"user": "user", "password": "password"})
        });
    }

    return (
        <div className="mt-5 block rounded-lg m-auto bg-slate-200 max-w-sm p-6 shadow-lg">
            <h3 className="font-bold text-center">Login</h3>

            <div className="m-5">
                <label className="font-light" htmlFor="username">Username</label>
                <input className="bg-opacity-0" type="text" id="username"/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="username">Password</label>
                <input className="bg-opacity-0" type="password" id="password"/>
            </div>


            <div className = "text-center m-5 mb-0">
                <button onClick={() => login()} className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Submit</button>
                <p className="mt-5">Don't have an account? <Link className="text-emerald-400" href="/register">Sign up</Link></p>
            </div>
        </div>
    );
}