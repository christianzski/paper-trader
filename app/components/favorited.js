'use client';
import Link from 'next/link'

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'

export default function Favorited() {
    const params = useSearchParams();
    const [favorited, setFavorited] = useState([]);
    useEffect(() => {
        let query = "";
        if(params.get("user")) {
            query = "?user=" + params.get("user");
        }
        
        fetch("/api/favorites" + query)
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
                <div className = "flex items-center"> 
                    <img src={`https://logos.stockanalysis.com/${favorite.toLowerCase()}.svg`} width="50" height="50"/>
                    <p className = "font-bold text-lg ml-1">{favorite}</p>
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