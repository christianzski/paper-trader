'use client';
import Link from 'next/link'
import { useRouter } from 'next/navigation' // Corrected import statement
import React, { useState } from "react";

export default function Account( {user}) {


    const router = useRouter();
    const [error, setError] = useState("");
    const [showEmail, setShowEmail] = useState(false);
    const [page, setPage] = useState('profile');
    const [profilePic, setProfilePic] = useState(0);
    const [showDiv, setShowDiv] = useState(false);

    async function logout() {
        // Your logout logic
    }

    function ShowDivButton() {
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
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <p key={num} onClick={() => setProfilePic(num)}>
                            <img src ={`images/pic${num}.png`} width={40} height={40}></img>
                          </p>
                        ))}
                    </div>

                </div>
            
            ) : (
                <button onClick={handleClick}>Change User Profile</button>
            )}
            </div>
        );
    }

    const renderProfile = () => (
        <div className="flex flex-col p-8">
            <p className = "interBold">Account</p>
            
            <p className="text-xl">First Name: {user.firstName}</p>
            <p className="text-xl">Last Name: {user.lastName}</p>
            <p className="text-xl">
                Email: 
                {showEmail ? user.fullEmail : user.email} 
                <button 
                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setShowEmail(!showEmail)}
                >
                    Toggle
                </button>
            </p>
            
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                Forgot Password
            </button>
            
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                Change Email
            </button>
            
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
                Delete Account
            </button>
        </div>
    )

    const renderAnalytics = () => (
        <div className="flex flex-col p-8">
            <h1 className="text-4xl font-bold mb-4">User Analytics</h1>
            
            <p className="text-xl">Balance: {user.wallet}</p>
            {/* You can replace with your own data as needed */}
            <p className="text-xl">Highest Price: $500</p>
            <p className="text-xl">Lowest Price: $50</p>
            <p className="text-xl">Account Created: July 10, 2021</p>
        </div>
    )

    return (
        
        <div className="flex-col justify-center">
            <button 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4" 
                    onClick={() => setPage(page === 'profile' ? 'analytics' : 'profile')}
                >
                     {page === 'profile' ? 'Analytics' : 'Profile'} View
                </button>
        
            <div className = "w-1/2 mx-auto text-center m-5 mb-0 bg-contain rounded-lg py-3 border-4 border-x-rose-500 border-y-rose-500">
                <div className="py-4">
                    <button className="rounded-full p-1 bg-gray-300 hover:bg-gray-400 text-slate-100">
                        <img src = {`images/profPic${profilePic}.png`}></img>
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

                
                
                {page === 'profile' ? renderProfile() : renderAnalytics()}

                <button onClick={() => logout()} className="animate w-30 bg-red-500 hover:bg-red-400 rounded-full py-2 px-10 no-underline">Logout</button>
            </div>

            <p className = "text-red-500 text-center">{error}</p>
        </div>
    );
}
