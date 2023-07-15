'use client'
import Link from 'next/link'
import React, { useState } from "react";

export default function Page() {
    const [passwordError, setPasswordError] = useState("");

    async function register() {
        const response = await fetch("/api/Register", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                login: document.getElementById("username").value,
                password: document.getElementById("password").value,
                email: document.getElementById("email").value,
                phone: "",
                question1: "", answer1: "1",
                question2: "", answer2: "2",
                question3: "", answer3: "3"
            })
        });
    }

    function verifyPassword() {
        const password = document.getElementById("password").value;
        if(password.length >= 7) {
            if(!password.match(/[0-9]/g)) {
                setPasswordError("Password must have at least one number!");
            } else if(!password.match(/[A-Z]/g)) {
                setPasswordError("Password must have at least one upper case letter!");
            } else if(!password.match(/[!@#$%^&*]/g)) {
                setPasswordError("Password must have at least one special character!");
            } else if(password != document.getElementById("passwordConfirm").value) {
                setPasswordError("Passwords must match!");
            } else setPasswordError("");
        } else setPasswordError("Password must be at least 7 characters");
    }

    return (
        <div className="mt-5 block rounded-lg m-auto bg-slate-200 max-w-sm p-6 shadow-lg">
            <h3 className="font-bold text-center">Account Registration</h3>

            <div className="m-5">
                <label className="font-light" htmlFor="firstName">First Name</label>
                <p className="font-light w-full rounded-full text-slate-50 bg-red-400 pl-1 text-xs"></p>
                <input className="bg-opacity-0" type="text" id="firstName"/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="lastName">Last Name</label>
                <input className="bg-opacity-0" type="text" id="lastName"/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="username">Username</label>
                <input className="bg-opacity-0" type="text" id="username"/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="password">Password</label>
                <p className="font-light w-full rounded-full text-slate-50 bg-red-400 pl-1 text-xs">{passwordError}</p>
                <input className="bg-opacity-0" type="password" id="password" onChange={verifyPassword}/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="passwordConfirm">Re-enter Password</label>
                <input className="bg-opacity-0" type="password" id="passwordConfirm" onChange={verifyPassword}/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="email">Email Address</label>
                <input className="bg-opacity-0" type="text" id="email"/>
            </div>

            <div className = "text-center m-5 mb-0">
                <button onClick={register} className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Submit</button>
                <p className="mt-5">Already have an account? <Link className="text-emerald-400" href="/login">Login here!</Link></p>
            </div>
        </div>
    );
}