import React from "react";

import "./DarkMode.css";
import "/app/globals.css";
import { useState, useEffect } from "react";


const DarkMode = () => {
    const [theme, setTheme] = useState("light");

    useEffect (() => {
        if (theme === "dark")
        {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.add('body-darkmode');
        }
        else 
        {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.remove('body-darkmode');
        }
    }, [theme]);


    const handleThemeSwitch = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };
    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                background= '#0f172a'

                onClick={handleThemeSwitch}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                
            </label>
            
        </div>
    );
};

export default DarkMode;
