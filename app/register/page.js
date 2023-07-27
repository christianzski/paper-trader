'use client'
import Link from 'next/link'
import React, { Fragment, useState } from "react";

import { Listbox, Transition} from '@headlessui/react'
import { CheckIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'
import {  } from '@heroicons/react/20/solid'
import SecurityQuestion from './security';

const q1 = [
    { id: 1, name: 'What city were you born in?', unavailable: false },
    { id: 2, name: 'What is your oldest sibling’s middle name?', unavailable: false },
    { id: 3, name: 'What was the first concert you attended?', unavailable: false },
];

const q2 = [
    { id: 1, name: 'What was the make and model of your first car?', unavailable: false },
    { id: 2, name: 'In what city or town did your parents meet?', unavailable: false },
    { id: 3, name: 'What is the name of your favorite pet?', unavailable: false },
];

const q3 = [
    { id: 1, name: 'What was your favorite food as a child?', unavailable: false },
    { id: 2, name: 'What was your mother\'s maiden name?', unavailable: false },
    { id: 3, name: 'What is your favorite movie?', unavailable: false },
];

export default function Page() {
    const [input, setInput] = useState({
        username: "", password: "",
        firstName: "", lastName: "",
        passwordConfirm: "", email: "",

        security1: "", security2: "", security3: ""
    });

    const [page, setPage] = useState(0);
    const [passwordError, setPasswordError] = useState("");

    async function next() {
        let inputs = input;
        inputs["username"] = document.getElementById("username").value;
        inputs["password"] = document.getElementById("password").value;
        inputs["firstName"] = document.getElementById("firstName").value;
        inputs["lastName"] = document.getElementById("lastName").value;

        inputs["passwordConfirm"] = document.getElementById("passwordConfirm").value;
        inputs["email"] = document.getElementById("email").value;

        setInput(inputs);

        setPage(1);
    }

    async function previous() {
        let inputs = input;

        inputs["security1"] = document.getElementById("security1").value;
        inputs["security2"] = document.getElementById("security2").value;
        inputs["security3"] = document.getElementById("security3").value;

        setInput(inputs);

        setPage(0);
    }

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
        } else {
            setPasswordError("Password must be at least 7 characters");
        }
    }

    return (
        <div className="mt-5 block rounded-lg m-auto bg-slate-200 max-w-sm p-6 shadow-lg">
            { (page == 0) ? (<></>) :
            (<button onClick={previous} className="animate bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full">
                <ChevronLeftIcon
                className="h-5 w-5 text-gray-900"
                aria-hidden="true"
                />
            </button>)}
            <h3 className="font-bold text-center">Account Registration</h3>


            { (page == 0) ? (<>
            <div className="m-5">
                <label className="font-light" htmlFor="firstName">First Name</label>
                <p className="font-light w-full rounded-full text-slate-50 bg-red-400 pl-1 text-xs"></p>
                <input className="bg-opacity-0" type="text" id="firstName" defaultValue={`${input["firstName"]}`}/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="lastName">Last Name</label>
                <input className="bg-opacity-0" type="text" id="lastName" defaultValue={`${input["lastName"]}`}/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="username">Username</label>
                <input className="bg-opacity-0" type="text" id="username" defaultValue={`${input["username"]}`}/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="password">Password</label>
                <input className="bg-opacity-0" type="password" id="password" onChange={verifyPassword} defaultValue={`${input["password"]}`}/>
                <p className="font-light w-full text-slate-50 pl-1 text-xs">{passwordError}</p>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="passwordConfirm">Re-enter Password</label>
                <input className="bg-opacity-0" type="password" id="passwordConfirm" onChange={verifyPassword} defaultValue={`${input["passwordConfirm"]}`}/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="email">Email Address</label>
                <input className="bg-opacity-0" type="text" id="email" defaultValue={`${input["email"]}`}/>
            </div>

            <div className = "text-center m-5 mb-0">
                <button onClick={next} className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Next</button>
                <p className="mt-5">Already have an account? <Link className="text-emerald-400" href="/login">Login here!</Link></p>
            </div>
            </>):

            (<div>
                <h3 className="font-bold text-center">Security Questions</h3>
                <div className="m-5">
                    <label className="font-light" htmlFor="q1">Security Question #1</label>
                    <SecurityQuestion data={q1}/>
            
                    <label className="font-light mt-2" htmlFor="firstName">Security Answer</label>
                    <p className="font-light w-full rounded-full text-slate-50 bg-red-400 pl-1 text-xs"></p>
                    <input placeholder="Your answer..." className="bg-opacity-0" type="text" id="security1" defaultValue={`${input["security1"]}`}/>
                </div>

                <div className="m-5">
                    <label className="font-light" htmlFor="q2">Security Question #2</label>
                    <SecurityQuestion data={q2}/>
            
                    <label className="font-light mt-2" htmlFor="firstName">Security Answer</label>
                    <p className="font-light w-full rounded-full text-slate-50 bg-red-400 pl-1 text-xs"></p>
                    <input placeholder="Your answer..." className="bg-opacity-0" type="text" id="security2" defaultValue={`${input["security2"]}`}/>
                </div>

                <div className="m-5">
                    <label className="font-light" htmlFor="q3">Security Question #3</label>
                    <SecurityQuestion data={q3}/>
            
                    <label className="font-light mt-2" htmlFor="firstName">Security Answer</label>
                    <p className="font-light w-full rounded-full text-slate-50 bg-red-400 pl-1 text-xs"></p>
                    <input placeholder="Your answer..." className="bg-opacity-0" type="text" id="security3" defaultValue={`${input["security3"]}`}/>
                </div>
                
                <button onClick={register} className="animate w-64 block m-auto text-center bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Register</button>
            </div>)}

        </div>
    );
}