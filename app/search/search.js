'use client';

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

            fetch(window.location.origin + "/search/" + search.toUpperCase())
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

    let content;
    if(!loading) {
        content = (
            items.map((item) => {
                return (
                <button onClick={() => router.push('./market/' + item['Symbol'])}
                className = "w-full flex items-center hover:bg-gray-200 my-1 p-1">
                    <div className = "rounded-full p-5 text-gray-200 bg-gray-900 mx-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-md">{item["Symbol"]}</p>
                        <p className="font-bold text-md">{item["Company Name"]}</p>
                    </div>
                </button>
                );
            })
        );
    } else {
        content = (
            <div className="text-slate-500 flex items-center mt-5">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                </div>
                <p className="ml-5">Loading...</p>
            </div>
        );
    }

    return (
        <main className="pl-10 pr-10">
            <h3 className="font-bold">Stocks</h3>
            <div className = "relative w-3/5">
                <div className="flex absolute inset-y-0 right-0 items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="search" id="default-search" onChange={handleChange} className="" placeholder="Search Companies..." required/>
            </div>
            <div className="w-3/5">

            {content}
            </div>
        </main>
    );
}