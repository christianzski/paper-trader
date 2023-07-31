'use client';

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { useEffect, useState } from "react";

import Chart from '@/components/chart'

export default function PortfolioChart() {
    const params = useSearchParams();

    const [balance, setBalance] = useState(0);

    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(0);
    const [data, setData] = useState([]);
    const [isUp, setIsUp] = useState(false);

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

        if(query.length != 0) query += "&";
        else query += "?";

        query += "range=1d";

        fetch('/api/portfolio' + query, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((result) => result.json())
        .then((data) => {
            if(!data.error) {
                let chartData = [];
                let low = 0, high = 0;

                for(let i = 0; i < data.data.length; ++i) {
                    const point = data.data[i];


                    let date = new Date(point[0] * 1000);
                    let hours = (date.getHours() % 12) || 12, minutes = date.getMinutes();
                    let time = (hours) + ":" + (minutes < 10 ? "0" : "") + minutes + " " + (date.getHours() >= 12 ? "PM" : "AM");

                    chartData.push({pv: i, Price: point[1], Time: time});

                    if(i == 0 || point[1] < low) low = point[1];
                    if(point[1] > high) high = point[1];
                }

                setData(chartData);
                setLow(low); setHigh(high);
                setIsUp(chartData[0].Price < chartData[chartData.length - 1].Price);
            }
        })
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
        <Chart data={data} domain={[low - low * 0.05, high - high * 0.05]} isUp={isUp}/>
        </div>
        </>);
};