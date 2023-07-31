'use client';
import Link from 'next/link'
import { useRouter } from 'next/navigation' // Corrected import statement
import React, { useState } from "react";
import OptionAccount from '../components/optionAccount';
import { update } from '@react-spring/web';

export default function Account( {user}) {


    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

    const [profilePic, setProfilePic] = useState(user.photo);

    let accountCreated = new Date(user.accountCreated).toLocaleString("en-US", options);
    
    async function updatePhoto(profiPicParam) {
        await fetch("/api/updatePhoto", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newPhoto: profiPicParam
            })
        }).then(async response => {
            const data = await response.json();
            console.log(data);
        }).catch(error => {
            setError("A server error has occurred.");
        })
    };

    const router = useRouter();
    const [error, setError] = useState("");
    const [showEmail, setShowEmail] = useState(false);
    const [page, setPage] = useState('profile');
    
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

    function ShowDivButton() {
        const handleClick = () => {
            setShowDiv(!showDiv);
        };

        return (

            <div>
            {showDiv ? (
                <div className = "w-100">
                    <button className = "normalText" onClick={handleClick}>Change Profile Picture</button>
                    <div className = "w-1/2 mx-auto grid grid-cols-4 justify-items-center px-1 py-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (    
                          <p className = "p-2" key={num} onClick={() => setProfilePic(num)}>
                            <img src ={`images/pic${num}.png`} width={40} height={40}></img>
                          </p>
                        ))}
                    </div>

                    <button className = "rounded-lg bg-green-300 p-2 normalText" onClick={ () => {handleClick(); updatePhoto(profilePic.toString() )} }>Save</button>

                </div>
            
            ) : (
                <button className = "normalText" onClick={handleClick}>Change Profile Picture</button>
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
                <p className ="py-5 p-3 interBold">{user.firstName} {user.lastName}  -  {user.loginId.toUpperCase()} </p>
            </div>
            
            <div className="place-content-center flex flex-row pb-3 items-center normalText">
                <p className = "self-start">{showEmail ? user.email : hideEmail(user.email)}</p>
                <button className="mx-3" onClick={() => setShowEmail(!showEmail)}>
                        <img className = "" src="eyeballTransparent.png" width={25} height={25}></img>
                    </button>
                
            </div>
            
            <div className = "flex flex-col items-center">
            </div>
            <OptionAccount/>
        </div>
    )

    const renderAnalytics = () => (
        <div className="flex flex-col p-8">
            <p className = "interBold py-1">Balance ${(user.wallet).toFixed(2)}</p>
            

            <p className="normalText">Highest Account Balance: ${user.highestBalance}</p>
            <p className="normalText">Lowest Account Balance: ${user.lowestBalance}</p>
            <p className="normalText">Account Created: {accountCreated}</p>
        </div>
    )

    return (
        
        <div className="flex-col justify-center">
            <button 
                    className="h-11 normalText bg-slate-100 hover:bg-cyan-100 text-white font-bold py-2 px-4 rounded-t-lg" 
                    onClick={() => setPage(page === 'profile' ? 'analytics' : 'profile')}
                >
                     {page === 'profile' ? 'Profile' : 'Analytics'}
                </button>
        
            
            <div className = "w-1/2 mx-auto text-center mb-0 bg-contain py-3 bg-gradient-to-b from-slate-100 to-rose-100 rounded-lg drop-shadow-lg">
                {page === 'profile' ? renderProfile() : renderAnalytics()}
                
                <button onClick={() => logout()} className="animate w-30 bg-red-500 hover:bg-red-400 rounded-full py-2 px-10 no-underline">Logout</button>
            </div>

            <p className = "text-red-500 text-center">{error}</p>
        </div>
    );
}
