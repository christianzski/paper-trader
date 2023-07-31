'use client';

import Link from 'next/link'
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'

import './loader.css'

export default function Portfolio({symbol, price}) {
    const params = useSearchParams();
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        let query = "";
        if(params.get("user")) {
            query = "?user=" + params.get("user");
        }

        fetch("/api/get-shares" + query, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((result) => result.json())
        .then((data) => {
            setLoading(false);

            let stats = [];
            for(let i = 0; i < data.portfolio?.length; ++i) {
                const purchasedPrice = data.portfolio[i].shares * data.portfolio[i].price;
                const currentPrice = data.portfolio[i].shares * data.portfolio[i].sharePrice;

                const percent = ((currentPrice - purchasedPrice) / purchasedPrice * 100.0);

                stats[i] = {
                    symbol: data.portfolio[i].symbol,
                    value: currentPrice,
                    percentage: percent.toFixed(2) };
            }

            setStocks(stats);
        });
    }, []);

    if(loading) {
        return (
            <svg className = "svg21">
                <text x="50%" y="50%" dy=".35em" text-anchor="middle">
                    21
                </text>
            </svg>  
        );
    } else {
    return (
        <div className="h-80 overflow-auto max-w-lg m-auto pt-4 px-2">
            {stocks.map((stock) => {
                return (
                <div className ="pt-1">
                    <Link href={`/market/${stock.symbol}`}>
                        <div className="drop-shadow-md py-2 flex max-w-3xl items-center m-1 bg-zinc-50 justify-between hover:bg-slate-200 dark:hover:bg-slate-400 rounded-md">
                            <div className = "flex items-center justify-self-end">
                                <img src={`https://logos.stockanalysis.com/${stock.symbol.toLowerCase()}.svg`} width="40" height="40"/>
                                <p className = "font-bold text-lg mx-1 justify-self-end dark:text-black">{stock.symbol}</p>
                            </div>
                            
                            <p className = "font-bold text-lg px-1 dark:text-black">${stock.value.toFixed(2)}</p>
                            {stock.percentage > 0 &&

                            <div className = "flex items-center text-green-400  px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>
                                <p className = "font-bold text-lg">{stock.percentage}%</p>
                            </div>
                            ||
                            <div className = "flex items-center text-red-400  px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                                <p className = "font-bold text-lg">{stock.percentage}%</p>
                            </div>}
                        </div>
                    </Link>
                </div>);
            })}
        </div>);
    }
}