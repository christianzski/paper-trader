'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from "react";

export default function Page() {
    const router = useRouter();
    const [error, setError] = useState("");

    async function login(event) {
        event.preventDefault();

        await fetch("/api/Login", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "login": document.getElementById("username").value,
                "password": document.getElementById("password").value
            })
        }).then(async response => {
            const data = await response.json();

            if(data["message"] == 'Success') {
                //router.push('/');
                window.location.href = "/";
            } else {
                setError("Invalid username or password.");
            }
        }).catch(error => {
            setError("A server error has occurred.");
        });

        return false;
    }

    return (
        <div className="mt-5 block rounded-lg m-auto bg-slate-200 max-w-sm p-6 shadow-lg drop-shadow-lg">
            <h3 className="font-bold text-center">Login</h3>

            <form onSubmit={login}>

            <div className="m-5">
                <label className="font-light" htmlFor="username">Username</label>
                <input className="bg-opacity-0" type="text" id="username"/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="username">Password</label>
                <input className="bg-opacity-0" type="password" id="password"/>
            </div>


            <div className = "text-center m-5 mb-0">
                <button type="submit" className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Submit</button>
                <p className="mt-5">Don't have an account? <Link className="text-emerald-400" href="/register">Sign up</Link></p>
            </div>

            <p className = "text-red-500 text-center">{error}</p>
            </form>
        </div>
    );
}