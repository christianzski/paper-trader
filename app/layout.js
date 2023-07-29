import './globals.css'
import { Inter } from 'next/font/google'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import Header from './header.js'
import Redirect from './components/redirect.js'

import authenticate from '../authenticate';

import React from "react";

const inter = Inter({
    weight: ['300', '400', '500'],
    subsets: ['latin'],
    display: 'swap'
});

export default async function RootLayout({ children }) {
    
    const path = headers().get("x-invoke-path");
    const cookieStore = cookies();
    const userId = cookieStore.get('user')?.value;
    const session = cookieStore.get('session')?.value;
    const username = cookieStore.get('username')?.value;
  
    const user = await authenticate.login(userId, session);

    const loginPaths = ["/", "/login", "/register"];
  
    if (!user && !loginPaths.includes(path)) {
      redirect("/");
    } else if (user) {
      if (loginPaths.includes(path)) {
        redirect("/portfolio");
      } else if (!user.emailVerified && path !== "/verification") {
        redirect("/verification");
      }
    }

  
    const renderAuthenticatedContent = () => (
      <div className="">
        <nav className="border-b relative group pb-20">  
            <Header user={user} />
        </nav>
        <div className= "pt-30">
          {children}
        </div>
        
      </div>
    );
  
    const renderUnauthenticatedContent = () => (
      <div className="landing h-screen">
        <div className="flex flex-row justify-between border fixed w-screen backdrop-blur-md">
          <div className="flex items-center py-5">
            <div className="mx-5">
              <Link href="/" className="text-2xl interBold"> Home </Link>
            </div>
            <Link href="/about" className="text-2xl interBold"> About </Link>
        </div>
          <div className ="flex-row justify-end py-5">
              <Link href="/login" className="no-underline mx-3 loginlogout">
                  <button className="animate w-23 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-bl-lg rounded-tr-lg py-2 px-7 hover:no-underline">
                      Login
                  </button>
              </Link>
              <Link href="/register" className="no-underline mx-3 loginlogout">
                <button className="animate w-23 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-tl-lg rounded-br-lg py-2 px-7 hover:no-underline">Register</button>
            </Link>
          </div>
          

        </div>
        {children}
      </div>
    );
  
    return (
      <html lang="en" className={inter.className}>
        <body>
          <Redirect authenticated={!!user} />
            {user && user.emailVerified ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
        </body>
      </html>
    );
  }
  