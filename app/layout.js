import './globals.css'
import { Roboto } from 'next/font/google'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import Header from './header.js'
import Redirect from './components/redirect.js'

import authenticate from '../authenticate';

const roboto = Roboto({
    weight: ['300', '400', '500'],
    subsets: ['latin'],
    display: 'swap'
});

// Call authenticate.login w/ client cookies to verify user is logged in or not
const loggedIn = true;//await authenticate.login(cookies.user, cookies.session);

export default function RootLayout({ children }) {
    const path = headers().get("x-invoke-path");

    const cookieStore = cookies();
    
    // Redirect to landing page if not logged in
    if(!loggedIn && !(path == "/landing" || path == '/login' || path == '/register')) {
        redirect("/landing");
    }

    let content;

    if(loggedIn || (path == '/login' || path == '/register')) {
        content = (<>
                   <div className = "m-2 flex justify-between">
                        <div className = "m-2 space-x-8 flex items-center">
                            <img src="/logo.png"/>
                            <Header/>
                        </div>

                        <div className = "flex mx-5">
                            <button className="hover:text-gray-500 mx-5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                            </button>

                            <div className = "flex items-center">
                                <div>
                                    <button className="rounded-full p-1 bg-gray-300 hover:bg-gray-400 text-slate-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="pl-1 text-center">
                                    <p className="font-bold text-sm">Username</p>
                                    <p className="text-xs">Online</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {children}
                    </>);
    } else {
        content = (<div className="landing h-screen">
        <div className="flex items-center bg-slate-50/50 py-5">
            <div className="mx-5">
                <a href='/' className = "text-2xl">Home</a>
            </div>
            <a href='/about' className = "text-2xl">About</a>
        </div>
        
        {children}
        </div>);
    }


    return (
        <html lang="en" className={roboto.className}>
            <body>
                <Redirect authenticated={loggedIn}/>
                {content}
            </body>
        </html>
    );
}
