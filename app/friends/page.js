'use client';

import Link from 'next/link';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'

import { UserCircleIcon, ExclamationCircleIcon, XCircleIcon, CheckCircleIcon} from '@heroicons/react/20/solid'

export default function Page() {
    const router = useRouter();

    const [friends, setFriends] = useState([]);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [addStatus, setAddStatus] = useState("");
    const [respondStatus, setRespondStatus] = useState("");
    const [removeStatus, setRemoveStatus] = useState("");

    function updateFriends() {
        setLoading(true);

        fetch("/friendList" + (search != "" ? "?user=" + search : ""))
        .then((result) => result.json())
        .then((data) => {
            setFriends(data.friends);
            setIncoming(data.incoming);
            setOutgoing(data.outgoing);

            setLoading(false);
        });
    }

    useEffect(() => {
        setSearch(search);

        if(search.length > 0) {
            updateFriends();
        } else setFriends([]);
    }, [search]);

    useEffect(() => {
        updateFriends();
    }, []);

    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    function addFriend() {
        setLoading(true);
        
        fetch("/api/sendFriendRQ", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "userAdding": document.getElementById("addFriend").value
            })
        })
        .then(response => response.json())
        .then(response => {
            setAddStatus(response.status);
            updateFriends();
        });
    }

    function respondRequest(name, status) {
        setLoading(true);
        
        fetch("/api/respondFriendRQ", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "userName": name,
                "status": status
            })
        })
        .then(response => response.json())
        .then(response => {
            setRespondStatus(response.status);
            updateFriends();
        });
    }

    function removeFriend(friend) {
        setLoading(true);
        
        fetch("/api/removeFriend", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "userDelete": friend
            })
        })
        .then(response => response.json())
        .then(response => {
            updateFriends();
        });
    }

    let content;
    if(!loading) {
        if(friends.length == 0) {
            content = (
                <div className = "flex items-center"> 
                    <ExclamationCircleIcon width="50" height="50"/>
                    <p className = "font-bold text-lg ml-1 normalText">You have no friends...</p>
                </div>
            );
        } else {
            content = (
                friends.map((friend) => {
                    return (
                    <button onClick={() => router.push('./portfolio?user=' + friend)}
                        className="flex w-full items-center m-1 justify-between hover:bg-slate-200 bg-zinc-50 drop-shadow-md rounded-md">
                        <div className = "flex items-center"> 
                            <UserCircleIcon width="50" height="50"/>
                            <p className = "font-bold text-lg ml-1 normalText">{friend}</p>
                        </div>

                        <button className="mx-2" onClick={(e) => {e.stopPropagation(); removeFriend(friend)}}>
                            <XCircleIcon color="red" width="24" height="24"/>
                        </button>
                    </button>
                    );
                })
            );
        }
    } else {
        content = (
            <div className="text-slate-500 flex items-center mt-5">
                <div className="loading" role="status">
                </div>
                <p className="ml-5">Loading...</p>
            </div>
        );
    }

    return (
        <div className="md:grid block p-5 w-full m-auto grid-flow-row-dense grid-cols-3 pl-10 pr-10">
            <div className="max-w-5xl p-2 col-span-2">
                <h3 className="font-bold">Friend List</h3>
                <div className = "relative">
                    <div className="flex absolute inset-y-0 right-0 items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input type="search" id="default-search" onChange={handleChange} className="" placeholder="Search Friends..." required/>
                </div>
                <div className="w-full">
                    {content}
                </div>
            </div>


            <div className="col-span-1">
                <div className="text-center m-auto max-w-[300px] mb-10">
                    <h3 className="font-bold">Add Friends</h3>
                    <div className = "relative">
                        <input type="search" id="addFriend" className="" placeholder="Enter username..." required/>

                        <button onClick={addFriend} className="mt-2 animate w-64 block m-auto text-center bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Add</button>
                        <p className="text-center">{addStatus}</p>
                    </div>
                </div>

                <div className="text-center m-auto max-w-[300px] mb-10">
                    <h3 className="font-bold">Incoming Requests</h3>
                    <div className = "relative">
                        {incoming.map((request) => {
                            return (
                            <div className="flex w-full items-center m-1 justify-between hover:bg-slate-200 bg-zinc-50 drop-shadow-md rounded-md">
                                <div className = "flex items-center"> 
                                    <UserCircleIcon width="50" height="50"/>
                                    <p className = "font-bold text-lg ml-1 normalText">{request}</p>
                                </div>

                                <div className = "flex justify-around items-center">
                                    <button onClick={() => respondRequest(request, "accept")}>
                                        <CheckCircleIcon color="green" width="24" height="24"/>
                                    </button>

                                    <button onClick={() => respondRequest(request, "reject")}>
                                        <XCircleIcon color="red" width="24" height="24"/>
                                    </button>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>

                <div className="text-center m-auto max-w-[300px]">
                    <h3 className="font-bold">Outgoing Requests</h3>
                    <div className = "relative">
                        {outgoing.map((request) => {
                            return (
                            <div className="flex w-full items-center m-1 justify-between hover:bg-slate-200 bg-zinc-50 drop-shadow-md rounded-md">
                                <div className = "flex items-center"> 
                                    <UserCircleIcon width="50" height="50"/>
                                    <p className = "font-bold text-lg ml-1 normalText">{request}</p>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}