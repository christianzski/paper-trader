'use client'
import Link from 'next/link'
import React, { useState } from "react";

export default function Page() {
    const [error, setError] = useState("");

    async function verify() {
        let code = "";
        for(let i = 1; i <= 6; ++i) {
            code += document.getElementById("n" + i)?.value;
        }

        const response = await fetch("/api/verification", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( {"token": code})
        }).then(async response => {
            const data = await response.json();

            if(data["status"] == 'Success') {
                window.location.href = "/";
            } else {
                setError("Invalid token.");
            }
        }).catch(error => {
            setError("A server error has occurred.");
        });
    }

    function validate(event) {
        const key = event.keyCode || event.charCode;
        event.target.value = event.target.value.substr(0, 1);

        if(key == 8 && event.target.value.length == 0) {
            if(event.target.previousElementSibling) {
                event.target.previousElementSibling.focus();
            }
        } else if(event.target.value.length > 0 && event.target.nextElementSibling) {
            event.target.nextElementSibling.focus();
        }
    }

    return (
        <div className="mt-5 block rounded-lg m-auto bg-slate-200 max-w-sm p-6 shadow-lg">
            <h3 className="font-bold text-center">Email Verification</h3>
            <p className="font-bold text-center">Please copy and paste the verification code sent to your email.</p>

            <div className="m-5 mt-10 mb-10 flex justify-between">
                <input className="bg-opacity-0 p-0 w-6 text-center inline" type="text" pattern="[0-9]" id="n1" onChange={validate} onKeyDown={validate} maxLength="1"/>
                <input className="bg-opacity-0 p-0 w-6 text-center inline" type="text" pattern="[0-9]" id="n2" onChange={validate} onKeyDown={validate} maxLength="1"/>
                <input className="bg-opacity-0 p-0 w-6 text-center inline" type="text" pattern="[0-9]" id="n3" onChange={validate} onKeyDown={validate} maxLength="1"/>
                <input className="bg-opacity-0 p-0 w-6 text-center inline" type="text" pattern="[0-9]" id="n4" onChange={validate} onKeyDown={validate} maxLength="1"/>
                <input className="bg-opacity-0 p-0 w-6 text-center inline" type="text" pattern="[0-9]" id="n5" onChange={validate} onKeyDown={validate} maxLength="1"/>
                <input className="bg-opacity-0 p-0 w-6 text-center inline" type="text" pattern="[0-9]" id="n6" onChange={validate} onKeyDown={validate} maxLength="1"/>
            </div>

            <div className = "text-center m-5 mb-0 mt-10">
                <button onClick={() => verify()} className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Submit</button>
                <p className = "text-red-500 text-center">{error}</p>
                <p className="mt-5">Didn't receive an email? <Link className="text-emerald-400" href="/">Click here</Link> to resend</p>
            </div>
        </div>
    );
}