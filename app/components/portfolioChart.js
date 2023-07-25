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
            <div className="inline-block bg-purple-300 px-3 mr-1 rounded-full font-bold dark:text-slate-300">1 Month</div>
            <div className="h-full inline-block">
                -
            </div>

            <div className="inline-block bg-purple-300 px-3 ml-1 rounded-full font-bold dark:text-slate-300">
                {((balance / 10000) * 100.0).toFixed(2)}%
            </div>
        </div>

        <div>
            <p className="font-bold dark:text-slate-300">Portfolio Balance</p>
            <div className="bg-teal-300 rounded-full w-full text-center">
                ${balance.toFixed(2)}
            </div>
        </div>
        </div>


        <h3 className="dark:text-slate-300 font-bold font-xl">Portfolio History</h3>
        <div className="w-full">
        <Chart data={[{pv: 0, Price: balance.toFixed(2)}, {pv: 1, Price: balance.toFixed(2)}]} domain={[balance - balance * 0.05, balance - balance * 0.05]}/>
        </div>
        </>);
};