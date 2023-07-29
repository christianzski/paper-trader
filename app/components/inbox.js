'use client';
import Link from 'next/link'

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'

export default function Inbox() {

    const params = useSearchParams();
    const [order, setOrders] = useState([]);
    const [orderLog, setOrderLog] = useState([]);


    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };


    function get_orders() {
        fetch("/api/get-orders", {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then((data) => {
            for(let i = 0; i < data["orders"]?.length; ++i) {
                data["orders"][i].time = new Date(data["orders"][i].time).toLocaleString("en-US", options);
            }
            setOrderLog(data["orders"]);
        });
    }

    useEffect(() => {
        get_orders();

        fetch("/api/get-shares", {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((result) => result.json())
        .then((data) => {
            setShares("" + data["shares"]);
            setOwned("$" + (price * data["shares"]).toFixed(2));
            setAverage("$" + data["price"]);
        });
    }, []);


    
    const orders = (
        <div className="max-w-5xl p-2 col-span-2 items-center justify-self-center">
            <div className="max-w-5xl flex items-center columns-4 ">
                <div className="flex items-center m-1">
                    

                    {/* <p className = "font-bold text-lg mr-5">Average Price</p> */}

                    {/* <p className = "font-bold text-sm">{average}</p> */}
                </div>
            </div>

            <div className="w-full h-0.5 bg-slate-500"></div>

            {orderLog.map((order) => {
                return (
                <div className = "item-center py-2">
                <div className="flex max-w-4xl items-center m-1 justify-between bg-zinc-100 hover:bg-zinc-50 p-3 rounded-lg">
                    <div className = "mx-1 mr-2 mb-2">
                        <img src={`https://logos.stockanalysis.com/${order.symbol.toLowerCase()}.svg`} width="50" height="50"/>
                    </div>

                    <p className = {`font-bold text-lg mr-5 ${order.side == "buy" ? "text-green-400" : "text-red-400"} uppercase`}>
                        {order.side}
                    </p>
                    <p className = "normalText px-2">{order.shares.toFixed(2)} Shares</p>
                    <p className = "normalText px-2">${order.price}</p>
                    <p className="font-normal text-left text-slate-600 mb-3">{order.time}</p>
                </div>
                
                </div>);
            })}
            </div>);

    return (
        <div className = "flex justify-center items-center p-3 py-2">
            {orders}
        </div>
    
    
    
    );
}