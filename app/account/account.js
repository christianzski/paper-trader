'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from "react";

export default function Account( {user}) {
    const router = useRouter();
    const [error, setError] = useState("");

    async function logout() {
        await fetch("/api/logout", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "login": user.loginId
                
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
    }

    return (
        <div className="flex flex-col center">
        
            <div className = "text-center m-5 mb-0">

                <div>
                    <button className="rounded-full p-1 bg-gray-300 hover:bg-gray-400 text-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 h-20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                        </svg>
                    </button>
                    <p className ="p-2"> {user.loginId} </p>
                    <p className ="p-2">{user.firstName} {user.lastName} </p>
                    <p className ="p-2">Balance ${user.wallet} </p>
                </div>
                
                <button onClick={() => logout()} className="animate w-30 bg-red-500 hover:bg-red-400 rounded-full py-2 px-10 no-underline">Logout</button>
            </div>

            <p className = "text-red-500 text-center">{error}</p>
        </div>
    );
}