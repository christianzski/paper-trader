'use client';
import Link from 'next/link'


import { Dialog } from '@headlessui/react'
import { useEffect, useState, Fragment } from "react";
import { useSearchParams } from 'next/navigation'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Listbox, Transition } from '@headlessui/react'

import './loader.css'

// import FilterInbox from './filterInbox';

export default function Inbox() {

    const [selected, setSelected] = useState('All');

    const [isLoading, setIsLoading] = useState(true);

    const [uniqueSymbols, setUniqueSymbols] = useState(new Set());
    function FilterInbox() {

    
        return (
            <div className="top-20 w-72 h-30 ">
              <Listbox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selected}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {uniqueSymbolsArr.map((symbol, personIdx) => (
                <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                }
                value={symbol}
                >
                {({ selected }) => (
                    <>
                    <span
                        className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                        }`}
                    >
                        {symbol}
                    </span>
                    {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                    ) : null}
                    </>
                )}
                </Listbox.Option>
            ))}
            </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
        );
    }

    const params = useSearchParams();
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
            const tempSymbols = new Set();
            tempSymbols.add('All');
            for(let i = 0; i < data["orders"]?.length; ++i) {
                data["orders"][i].time = new Date(data["orders"][i].time).toLocaleString("en-US", options);
                tempSymbols.add(data["orders"][i].symbol);
            }
            setUniqueSymbols(tempSymbols);
            setOrderLog(data["orders"]);
        }).finally(() => {
            setIsLoading(false);
        });
    }

    
    useEffect(() => {
        get_orders();
    }, []);

    if (isLoading) {
            return <svg className = "svg21">
            <text x="50%" y="50%" dy=".35em" text-anchor="middle">
                21
            </text>
        </svg>  
        }

    const uniqueSymbolsArr = Array.from(uniqueSymbols);
    
    
    const orders = (
        <div className="max-w-5xl p-2 col-span-2 items-center justify-self-center">
            <div className="max-w-5xl flex items-center columns-4 py-1">
                <div className="flex items-center m-1">

                    <FilterInbox/>
                
                    {/* <p className = "font-bold text-lg mr-5">Average Price</p> */}
                    {/* <p className = "font-bold text-sm">{average}</p> */}
                </div>
            </div>

            <div className="w-full h-0.5 bg-slate-500"></div>

            {orderLog.map((order) => {
                if (selected == order.symbol || selected == 'All') {
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
            } else {
                <></>
            }
             }
            )}
            </div>);

    return (
        <div className = "flex justify-center items-center p-3 py-2">
            {orders}
        </div>
    
    
    
    );
}