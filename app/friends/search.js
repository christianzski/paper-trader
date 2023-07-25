'use client';

import Link from 'next/link';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'

export default function Search() {
    const router = useRouter();

    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSearch(search);

        if(search.length > 0) {
            setLoading(true);

            fetch(window.location.origin + "/friendList/" + search)
            .then((result) => result.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            });
        } else setItems([]);
    }, [search]);

    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    function favorite() {
        setFavorited(favorited ? false : true);
        
        fetch("/api/removeFriend", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "userDelete": string
            })
        })
        .then(response => response.json())
        .then(response => {
            setFavorited(response.favorited);
        });
    }

    let content;
    if(!loading) {
        content = (
            items.map((item) => {
                return (
                    //use this to have on click send to another friends portfolio
                <button onClick={() => router.push('./market/' + item['Symbol'])}
                className = "w-full flex items-center hover:bg-gray-200 my-1 p-1">
                    <div className = "rounded-full p-5 text-gray-200 bg-gray-900 mx-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-md">{item}</p>
                    </div>
                </button>
                );
            })
        );
    } else {
        content = (
            <div className="text-slate-500 flex items-center mt-5">
                <div className="loading" role="status">
                </div>
                <p className="ml-5">Loading...</p>
            </div>
        );
    }

    return (
        <main className="pl-10 pr-10">
            <h3 className="font-bold">Friend List</h3>
            <div className = "relative w-3/5">
                <div className="flex absolute inset-y-0 right-0 items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="search" id="default-search" onChange={handleChange} className="" placeholder="Search Friends..." required/>
            </div>
            <div className="w-3/5">

            {content}
            </div>
        </main>
    );
}