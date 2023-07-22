'use client';

import Link from 'next/link'
import { useEffect, useState } from "react";

export default function Portfolio({symbol, price}) {
    const [stocks, setStocks] = useState([]);
    useEffect(() => {
        fetch("/api/get-shares", {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((result) => result.json())
        .then((data) => {
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

    return (
    <div className="max-w-lg m-auto">
            {stocks.map((stock) => {
                    return (
                    <Link href={`/market/${stock.symbol}`}>
                    <div className="flex max-w-3xl items-center m-1 justify-between hover:bg-slate-200 dark:hover:bg-slate-400">
                        <div className = "flex items-center">
                            <div className = "rounded-full p-5 text-gray-200 bg-gray-900 mx-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                </svg>
                            </div>

                            <p className = "font-bold text-lg ml-1">{stock.symbol}</p>
                        </div>
                        
                        <p className = "font-bold text-lg">{stock.value}</p>
                        {stock.percentage > 0 &&

                        <div className = "flex items-center text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                            </svg>
                            <p className = "font-bold text-lg">{stock.percentage}%</p>
                        </div>
                        ||
                        <div className = "flex items-center text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                            <p className = "font-bold text-lg">{stock.percentage}%</p>
                        </div>}
                    </div>
                    </Link>);
                })}

    </div>);
}