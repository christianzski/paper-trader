'use client';
import Link from 'next/link'

import { useEffect, useState } from "react";

export default function Favorited() {
    const [favorited, setFavorited] = useState([]);
    useEffect(() => {
        fetch("/api/favorites")
        .then((result) => result.json())
        .then((data) => {
            setFavorited(data.favorites);
        });
    }, []);

    const favorites = (<>
        {favorited.map((favorite) => {
            return (
            <Link href={`/market/${favorite}`}>
            <div className="flex max-w-3xl items-center m-1 justify-between hover:bg-slate-200">
<<<<<<< Updated upstream
                <div className = "flex items-center">
=======
                <div className = "flex items-center"> 
>>>>>>> Stashed changes
                    <div className = "rounded-full p-5 text-gray-200 bg-gray-900 mx-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                    </div>

<<<<<<< Updated upstream
                    <p className = "font-bold text-lg ml-1">{favorite}</p>
=======
                    <p className = "font-bold text-lg ml-1 bg-slate-900">{favorite}</p>
>>>>>>> Stashed changes
                </div>
            </div>
            </Link>
            );
        })}
        </>
    );

    return (
    <div className="max-w-lg">
            {favorites}
    </div>);
}