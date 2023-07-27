'use client';

import Link from 'next/link'
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'

export default function Portfolio({symbol, price}) {
    const params = useSearchParams();
    const [stocks, setStocks] = useState([]);
    
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
                    <img src={`https://logos.stockanalysis.com/${stock.symbol.toLowerCase()}.svg`} width="50" height="50"/>
                    <p className = "font-bold text-lg ml-1">{stock.symbol}</p>
                </div>
                
                <p className = "font-bold text-lg">{stock.value.toFixed(2)}</p>
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