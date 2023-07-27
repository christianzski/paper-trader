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
    const profilePic = 0;
    function ShowDivButton() {
        const [showDiv, setShowDiv] = useState(false);

        const handleClick = () => {
            setShowDiv(!showDiv);
        };
        
        return (
            <div>
            {showDiv ? (
                <div>
                    <button onClick={handleClick}>Change User Profile</button>
                    <div>This is the div to be shown</div>
                    
                    <div className = "grid grid-cols-4 justify-items-center px-1 py-2">
                        <p><img src ="profilePictures/profPic1.png" width={40} height={40}></img></p>
                        <p><img src ="profilePictures/profPic2.png" width={40} height={40}></img></p>
                        <p><img src ="profilePictures/profPic3.png" width={40} height={40}></img></p>
                        <p><img src ="profilePictures/profPic4.png" width={40} height={40}></img></p>
                        <p><img src ="profilePictures/profPic5.png" width={40} height={40}></img></p>
                        <p><img src ="profilePictures/profPic6.png" width={40} height={40}></img></p>
                        <p><img src ="profilePictures/profPic7.png" width={40} height={40}></img></p>
                        <p><img src ="profilePictures/profPic8.png" width={40} height={40}></img></p>
                    </div>



                </div>
            
            ) : (
                <button onClick={handleClick}>Change User Profile</button>
            )}
            </div>
        );
      }



    return (
        <div className="flex-col justify-center">
        
            <div className = "w-1/2 mx-auto text-center m-5 mb-0 bg-contain rounded-lg py-3 border-4 border-x-rose-500 border-y-rose-500">

                <div className="py-4">
                    <button className="rounded-full p-1 bg-gray-300 hover:bg-gray-400 text-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 h-20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                        </svg>
                    </button>
                    <ShowDivButton/>
                    <p className ="p-2"> {user.loginId} </p>
                    <p className ="p-2">{user.firstName} {user.lastName} </p>
                    
                </div>

                <div className = "interBold justify-start py-5">
                    Overview
                </div>
                <div className = "flex flex-row justify-between px-10">
                    <p>Balance:</p>
                    <p>${user.wallet}</p>
                </div> 



                <button onClick={() => logout()} className="animate w-30 bg-red-500 hover:bg-red-400 rounded-full py-2 px-10 no-underline">Logout</button>
            </div>

            <p className = "text-red-500 text-center">{error}</p>
        </div>
    );
}