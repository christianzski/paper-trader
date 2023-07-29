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

    function hideEmail(email) {
        // Find the index of '@'
        let atIndex = email.indexOf('@');
    
        // If '@' symbol doesn't exist, return the email as is
        if (atIndex === -1) return email;
    
        // Keep the first 2 characters and the character at '@' index
        let visiblePartStart = email.substring(0, 2);
        let visiblePartEnd = email.substring(atIndex);
    
        // Replace all characters between with '*'
        let hiddenPart = '*'.repeat(atIndex - 2);
    
        return visiblePartStart + hiddenPart + visiblePartEnd;
    }



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
                <div className = "w-100">
                    <button className = "normalText" onClick={handleClick}>Change User Profile</button>
                    <div className = "w-1/2 mx-auto grid grid-cols-4 justify-items-center px-1 py-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <p className = "p-2" key={num} onClick={() => setProfilePic(num)}>
                            <img src ={`images/pic${num}.png`} width={40} height={40}></img>
                          </p>
                        ))}
                    </div>

                    <button className = "rounded-lg bg-green-300 p-2 normalText" onClick={handleClick}>Save</button>

                </div>
            
            ) : (
                <button className = "normalText" onClick={handleClick}>Change User Profile</button>
            )}
            </div>
        );
    }

    const renderProfile = () => (
        <div className="flex flex-col p-8">

            <div className="py-4">
                    <button className="rounded-full p-1 bg-gray-300 hover:bg-gray-400 text-slate-100">
                        <img src = {`images/pic${profilePic || user.photo}.png`} width={100} height={100}></img>
                    </button>
                    <ShowDivButton/>
                    <p className ="py-5 p-3 inter-bold">{user.firstName} {user.lastName}  -  {user.loginId.toUpperCase()} </p>
                </div>
            <p className="grid grid-row-1 grid-col-2 place-items-center text-xl interBold flex-none justify-self-center">
                {showEmail ? user.email : hideEmail(user.email)} 
                <button 
                    className="mx-3 pt-3"
                    onClick={() => setShowEmail(!showEmail)}
                >
                    <img className = "pt-2" src="eyeballTransparent.png" width={30} height={30}></img>
                </button>
                <p className = "interBold py-1">Balance ${(user.wallet).toFixed(2)}</p>
            </p>
            
            
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 max-w-300">
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
        
            
            <div className = "w-1/2 mx-auto text-center m-5 mb-0 bg-contain py-3 drop-shadow-lg">
                {page === 'profile' ? renderProfile() : renderAnalytics()}
                
                <button onClick={() => logout()} className="animate w-30 bg-red-500 hover:bg-red-400 rounded-full py-2 px-10 no-underline">Logout</button>
            </div>

            <p className = "text-red-500 text-center">{error}</p>
        </div>
    );
}
