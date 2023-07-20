import './globals.css'
import { Roboto } from 'next/font/google'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import Header from './header.js'
import Redirect from './components/redirect.js'

import authenticate from '../authenticate';

import React from "react";

const roboto = Roboto({
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
      <div className="border-b">
        <nav className="border-b relative group">  
            <Header user={user} />
        </nav>
        {children}
      </div>
    );
  
    const renderUnauthenticatedContent = () => (
      <div className="landing h-screen">
        <div className="flex flex-row justify-between bg-slate-50/50">
          <div className="flex items-center py-5">
            <div className="mx-5">
              <a href="/" className="text-2xl animation"> Home </a>
            </div>
            <a href="/about" className="text-2xl animation"> About </a>
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
      <html lang="en" className={roboto.className}>
        <body>
          <Redirect authenticated={!!user} />
            {user && user.emailVerified ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
        </body>
      </html>
    );
  }
  