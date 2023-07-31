'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from "react";

import { XMarkIcon } from '@heroicons/react/20/solid'

export default function Page() {
    const router = useRouter();

    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [sent, setSent] = useState(false);
    const [validated, setValidated] = useState(false);
    const [reset, setReset] = useState(false);

    const [passwordError, setPasswordError] = useState("");

    async function sendCode() {
        let token = "";
        for(let i = 1; i <= 6; ++i) {
            token += document.getElementById("n" + i)?.value;
        }

        const response = await fetch("/api/verification", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "reset": true,
                "token": token,
                "email": email
            })
        }).then(async response => {
            const data = await response.json();

            if(data["status"] == 'valid') {
                setError("");
                setCode(token);
                setValidated(true);
            } else {
                setError("Invalid code");
            }
        }).catch(error => {
            setError("A server error has occurred.");
        });
    }

    async function resetPassword() {
        const response = await fetch("/api/verification?reset=true", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "reset": true,
                "token": code,
                "email": email,
                "password": document.getElementById("password").value
            })
        }).then(async response => {
            const data = await response.json();

            if(data["status"] == 'reset') {
                setReset(true);
                setTimeout(function() {
                    router.push('/login');
                }, 2500);
            } else {
                setError("An error has occurred.");
            }
        }).catch(error => {
            setError("A server error has occurred.");
        });
    }

    async function sendReset(event) {
        event.preventDefault();

        await fetch("/api/forgot-password", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": document.getElementById("email").value
            })
        }).then(async response => {
            const data = await response.json();
            if(data["status"] !== "sent") {
                setError("A server error has occurred.");
            } else {
                setEmail(document.getElementById("email").value);
                setSent(true);
                setError("");
            }
        }).catch(error => {
            setError("A server error has occurred.");
        });

        return false;
    }

    function verifyPassword() {
        let error = "";

        const password = document.getElementById("password").value;
        if(password.length >= 7) {
            if(!password.match(/[0-9]/g)) {
                error = "Password must have at least one number!";
                setPasswordError(error);
            } else if(!password.match(/[A-Z]/g)) {
                error = "Password must have at least one upper case letter!";
                setPasswordError(error);
            } else if(!password.match(/[!@#$%^&*]/g)) {
                error = "Password must have at least one special character!";
                setPasswordError(error);
            } else if(password != document.getElementById("passwordConfirm").value) {
                error = "Passwords must match!";
                setPasswordError(error);
            } else setPasswordError("");
        } else {
            error = "Password must be at least 7 characters";
            setPasswordError(error);
        }

        return error;
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

    if(!sent) {
        return (
            <div className="mt-5 block rounded-lg m-auto bg-slate-200 max-w-sm p-6 shadow-lg drop-shadow-lg">
                <h3 className="font-bold text-center">Forgot Password</h3>

                <form onSubmit={sendReset}>
                    <div className="m-5">
                        <label className="font-light" htmlFor="email">Email</label>
                        <input className="bg-opacity-0" type="text" id="email"/>
                    </div>


                    <div className = "text-center m-5 mb-0">
                        <button type="submit" className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Reset</button>
                    </div>

                    <p className = "text-red-500 text-center">{error}</p>
                </form>
            </div>
        );
    } else if(!validated) {
        return (
            <div className="mt-5 block rounded-lg m-auto bg-slate-200 max-w-sm p-6 shadow-lg">
                <h3 className="font-bold text-center">Email Verification</h3>
                <p className="font-bold text-center">If an account with that email exists, a reset code was sent to your email.</p>
                <p className="font-bold text-center">Please enter the verification code sent to your email.</p>
    
                <div className="m-5 mt-10 mb-10 flex justify-between">
                    <input className="bg-opacity-0 p-0 w-6 text-center inline" type="text" pattern="[0-9]" id="n1" onChange={validate} onKeyDown={validate} maxLength="1"/>
                    <input className="bg-opacity-0 p-0 w-6 text-center inline" type="text" pattern="[0-9]" id="n2" onChange={validate} onKeyDown={validate} maxLength="1"/>
                    <input className="bg-opacity-0 p-0 w-6 text-center inline" type="text" pattern="[0-9]" id="n3" onChange={validate} onKeyDown={validate} maxLength="1"/>
                    <input className="bg-opacity-0 p-0 w-6 text-center inline" type="text" pattern="[0-9]" id="n4" onChange={validate} onKeyDown={validate} maxLength="1"/>
                    <input className="bg-opacity-0 p-0 w-6 text-center inline" type="text" pattern="[0-9]" id="n5" onChange={validate} onKeyDown={validate} maxLength="1"/>
                    <input className="bg-opacity-0 p-0 w-6 text-center inline" type="text" pattern="[0-9]" id="n6" onChange={validate} onKeyDown={validate} maxLength="1"/>
                </div>
    
                <div className = "text-center m-5 mb-0 mt-10">
                    <button onClick={sendCode} className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Submit</button>
                    <p className = "text-red-500 text-center">{error}</p>
                </div>
            </div>
        );
    } else if(!reset) {
        return (
            <div className="mt-5 block rounded-lg m-auto bg-slate-200 max-w-sm p-6 shadow-lg">
                <h3 className="font-bold text-center">Reset Password</h3>
                <p className="font-bold text-center">Enter your new password</p>
    

                <div className="m-5">
                    <label className="font-light" htmlFor="password">Password</label>
                    <input className="bg-opacity-0" type="password" id="password" onChange={verifyPassword}/>
                    <div className="flex items-center">
                        {passwordError != "" ? <XMarkIcon width="24" height="24" color='red'/> : <></>} 
                        <p className="w-full text-slate-900 pl-1 text-xs">{passwordError}</p>
                    </div>
                </div>

                <div className="m-5">
                    <label className="font-light" htmlFor="passwordConfirm">Re-enter Password</label>
                    <input className="bg-opacity-0" type="password" id="passwordConfirm" onChange={verifyPassword}/>
                </div>
    
                <div className = "text-center m-5 mb-0 mt-10">
                    <button onClick={resetPassword} className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Reset</button>
                    <p className = "text-red-500 text-center">{error}</p>
                </div>
            </div>
        );
    } else {
        return (
        <div className="mt-5 block rounded-lg m-auto bg-slate-200 max-w-sm p-6 shadow-lg">
            <h3 className="font-bold text-center">Password Reset</h3>
            <p className="font-bold text-center">Your password has been reset; redirecting to login page</p>
        </div>
        );
    }
}