'use client';

import { useState, useEffect } from "react";


export default function Overview({symbol}) {
    let [companyName, setCompanyName] = useState("");

    useEffect(() => {
        fetch(window.location.origin + "/search/" + symbol.toUpperCase())
        .then((result) => result.json())
        .then((data) => { setCompanyName(data[0]["Company Name"]); });
    }, []);

    return (
        <h1 className="font-bold text-xl text-center">{companyName}</h1>);
} 