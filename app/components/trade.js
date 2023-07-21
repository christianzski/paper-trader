'use client';

import React, { useState, useEffect } from "react";

export default function Trade({symbol, price}) {
    const [orderLog, setOrderLog] = useState([]);

    const [label, setLabel] = useState(<>PURCHASE</>);
    const [shares, setShares] = useState(<div className="loading"></div>);
    const [owned, setOwned] = useState(<div className="loading"></div>);

    const [average, setAverage] = useState("");

    const [active, setActive] = useState("buy");
    const [error, setError] = useState("");

    function get_orders() {
        fetch("/api/get-orders?symbol=" + symbol, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then((data) => {
            for(let i = 0; i < data["orders"]?.length; ++i) {
                data["orders"][i].time = new Date(data["orders"][i].time).toLocaleString();
            }

            setOrderLog(data["orders"]);
        });
    }

    useEffect(() => {
        get_orders();

        fetch("/api/get-shares?symbol=" + symbol, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((result) => result.json())
        .then((data) => {
            setShares("" + data["shares"]);
            setOwned("$" + price * data["shares"]);
            setAverage("$" + data["price"]);
        });
    }, []);

    function filterNumber(event) {
        const decimals = parseInt(event.target.dataset.decimals) || 2;

        if((event.data >= '0' && event.data <= '9') || event.data == '.') {
            const decimal = event.target.value.indexOf(".");
            if(event.data == '.' && decimal >= 0) event.preventDefault();
            else if(decimal >= 0 && event.target.value.length - 1 >= decimal + decimals) {
                event.preventDefault();
            }
        } else event.preventDefault();
    }

    function inputPrice() {
        let value = document.getElementById("price").value;
        if(value.length == 0) document.getElementById("shares").value = "";
        else {
            const shares = (value / price).toFixed(4).toString();
            document.getElementById("shares").value = shares;
        }
    }

    function inputShares() {
        let value = document.getElementById("shares").value;
        if(value.length == 0) document.getElementById("price").value = "";
        else {
            const usd = (parseFloat(value) * price).toFixed(2).toString();

            document.getElementById("price").value = usd;
        }
    }

    async function sell() {
        setLabel(<div className="loading"></div>);

        fetch("/api/sell", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "symbol": symbol,
                "cost": document.getElementById("price").value
            })
        }).then(async response => {
            const data = await response.json();

            if(data["success"] === true) {
                setShares("" + data["shares"]);
                setOwned("$" + (price * data["shares"]));

                get_orders();

                document.getElementById("price").value = "";
                document.getElementById("shares").value = "";
            } else setError(data["error"]);
        }).catch(error => {
            setError("A server error has occurred.");
        }).finally(() => {
            if(active == "buy") setLabel(<>PURCHASE</>);
            else setLabel(<>SELL</>);
        });
    }

    function buy() {
        setLabel(<div className="loading"></div>);

        fetch("/api/buy", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "symbol": symbol,
                "cost": document.getElementById("price").value
            })
        }).then(async response => {
            const data = await response.json();

            if(data["success"] === true) {
                setShares("" + data["shares"]);
                setOwned("$" + (price * data["shares"]));
                setAverage("$" + data["avg"]);

                get_orders();

                document.getElementById("price").value = "";
                document.getElementById("shares").value = "";
            } else setError(data["error"]);
        }).catch(error => {
            setError("A server error has occurred.");
        }).finally(() => {
            if(active == "buy") setLabel(<>PURCHASE</>);
            else setLabel(<>SELL</>);
        });
    }

    const renderBuys = () => {
        return (<>
            <button
                className="rounded-lg w-1/2 max-w-[150px] bg-fuchsia-300 px-5 py-3 m-2 font-medium">
                BUY
            </button>
            <button
                onClick={() => { setActive("sell"); setLabel(<>SELL</>); }}
                className="rounded-lg w-1/2 max-w-[150px] bg-neutral-200 hover:bg-neutral-300 px-5 py-3 m-2 font-medium">
                SELL
            </button></>)
    };

    const renderSells = () => {
        return (<>
            <button
                onClick={() => { setActive("buy"); setLabel(<>PURCHASE</>); }}
                className="rounded-lg w-1/2 max-w-[150px] bg-neutral-200 hover:bg-neutral-300 px-5 py-3 m-2 font-medium">
                BUY
            </button>
            <button
                className="rounded-lg w-1/2 max-w-[150px] bg-fuchsia-300 px-5 py-3 m-2 font-medium">
                SELL
            </button></>)
    };

    const orders = (
            <div className="max-w-5xl p-2 col-span-2">
                <div className="max-w-5xl flex items-center columns-4">
                    <div className="flex items-center m-1">
                        <div className = "rounded-full p-5 text-gray-200 bg-gray-900 mx-1 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <p className = "font-bold text-lg mr-5">Average Price</p>

                        <p className = "font-bold text-sm">{average}</p>
                    </div>
                </div>

                <div className="w-full h-0.5 bg-slate-500"></div>

                {orderLog.map((order) => {
                    return (
                    <>
                    <div className="flex max-w-3xl items-center m-1 justify-between">
                        <div className = "rounded-full p-5 text-gray-200 bg-gray-900 mx-1 mr-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </div>

                        <p className = {`font-bold text-lg mr-5 ${order.side == "buy" ? "text-green-400" : "text-red-400"} uppercase`}>
                            {order.side}
                        </p>
                        <p className = "font-bold text-lg text-left">{order.shares} shares</p>
                        <p className = "font-bold text-lg text-left">${order.price}</p>
                    </div>
                    <p className="font-normal text-left text-slate-600 mb-3">{order.time}</p>
                    </>);
                })}
            </div>);

    return (<>
    <div className="col-span-1">
        <div className="text-center m-auto max-w-[300px]">
            <div className="m-auto">
                <h1 className="font-bold text-xl">Current Assets</h1>
                <div className="flex w-full items-center justify-between">
                    <div className="flex w-full items-center m-1">
                        <div className = "rounded-full p-5 text-gray-200 bg-gray-900 mx-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                        </div>
                        <div className="grow">
                            <h1 className="font-medium text-lg text-left">Shares Owned</h1>
                            <h1 className="font-normal text-lg text-right">{shares}</h1>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex w-full items-center m-1">
                        <div className = "rounded-full p-5 text-gray-200 bg-gray-900 mx-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <div className="grow">
                            <h1 className="font-medium text-lg text-left">Total Owned</h1>
                            <h1 className="font-normal text-lg text-right">{owned}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
            
            {active == "buy" && renderBuys() || renderSells()}
            
            </div>
        
            <div className="m-2">
                <input type="text" className="m-2" placeholder="USD" id="price" data-decimals={2} onBeforeInput={filterNumber} onChange={inputPrice}/>
                <input type="text" className="m-2" placeholder="Shares" id="shares" data-decimals={4} onBeforeInput={filterNumber} onChange={inputShares}/>
            </div>

            <button onClick={active == "buy" ? buy : sell} className="rounded-lg w-1/2 max-w-[150px] bg-fuchsia-300 px-5 py-3 m-2 font-medium hover:bg-fuchsia-400">
                {label}
            </button>
            <p className="text-center text-red-300">{error}</p>
        </div>
    </div>

    {orders}
    </>);
}