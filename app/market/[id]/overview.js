'use client';

import { useState, useEffect } from "react";


export default function Overview({symbol, quote}) {
    let [companyName, setCompanyName] = useState("");
    const [favorited, setFavorited] = useState(false);

    useEffect(() => {
        fetch(window.location.origin + "/search/" + symbol.toUpperCase())
        .then((result) => result.json())
        .then((data) => { setCompanyName(data[0]["Company Name"]); });
    
        fetch("/api/favorites")
        .then((result) => result.json())
        .then((data) => {
            for(let i = 0; i < data.favorites.length; ++i) {
                if(data.favorites[i] == symbol.toUpperCase()) {
                    setFavorited(true);
                }
            }
        });
    }, []);

    function favorite() {
        setFavorited(favorited ? false : true);
        
        fetch("/api/favorite", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "favorite": symbol
            })
        })
        .then(response => response.json())
        .then(response => {
            setFavorited(response.favorited);
        });
    }

    return (
        <>
        <div className="flex items-center mb-1">
          <span onClick={() => favorite()} className={`cursor-pointer ${favorited ? "text-yellow-300 hover:text-gray-800" : "hover:text-yellow-300"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill={`${favorited ? "#fde047" : "none"}`} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </span>
          <h1 className="font-bold mx-2 text-xl uppercase">{symbol.toUpperCase()}:</h1>
          <p>${quote}</p>
        </div>
        <h1 className="font-bold text-xl text-center">{companyName}</h1>
        </>);
} 