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

export default async function RootLayout({ children }) {
    
    const path = headers().get("x-invoke-path");
    const cookieStore = cookies();
    const userId = cookieStore.get('user')?.value;
    const session = cookieStore.get('session')?.value;
    const username = cookieStore.get('username')?.value;
  
    const user = await authenticate.login(userId, session);
    

    // console.log(user);

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
        <div className="flex items-center bg-slate-50/50 py-5">
          <div className="mx-5">
            <a href="/" className="text-2xl"> Home </a>
          </div>
          <a href="/about" className="text-2xl"> About </a>
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
  