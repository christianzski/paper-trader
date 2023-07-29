'use client';

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { useEffect, useState } from "react";

import Chart from '@/components/chart'

export default function PortfolioChart() {
    const params = useSearchParams();

    const [balance, setBalance] = useState(0);
    const [] = useState();
    useEffect(() => {
        let query = "";
        if(params.get("user")) {
            query = "?user=" + params.get("user");
        }

        fetch("/api/user" + query, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((result) => result.json())
        .then((data) => {
            setBalance(data.user.wallet);
        });
    }, []);

    return (<>
        <div className="flex justify-between items-center mb-1">
            <div>
                
                
            </div>
        </div>
        <h3 className="dark:text-slate-300 font-bold font-xl interBold">Portfolio History</h3>
        <div className = "w-100 min-w-full">
            <div className = "flex flex-wrap items-center place-items-stretch">
                <div className="inline-block bg-sky-100 px-3 mr-1 rounded-lg font-bold dark:text-slate-300 normalText">1 Month</div>
                <div className="h-full inline-block">-</div>
                <div className="inline-block bg-sky-100 px-3 ml-1 rounded-lg font-bold dark:text-slate-300 normalText">
                    {((balance / 10000) * 100.0).toFixed(2)}%
                </div>
                <div className= "w-full text-center p-1">
                    <p className = "py-1 px-3 interBold">$ {balance.toFixed(2)}</p>
                </div>
            </div>
            
        </div>
        <div className="w-full">
        <Chart data={[{pv: 0, Price: balance.toFixed(2)}, {pv: 1, Price: balance.toFixed(2)}]} domain={[balance - balance * 0.05, balance - balance * 0.05]}/>
        </div>
        </>);
};