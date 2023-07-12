'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();

    return(
        <>
        {(pathname == '/' &&
        <button className="bg-slate-200 text-slate-800 font-bold py-1 px-2 rounded inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
            </svg>
            <span>Portfolio</span>
        </button>
        ) || <Link className="text-gray-700 hover:underline" href="/">Portfolio</Link>}

        <Link className="text-gray-700 hover:underline" href="/inbox">Inbox</Link>
        
        {(pathname == '/search' &&
        <button className="bg-slate-200 text-slate-800 font-bold py-1 px-2 rounded inline-flex items-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>    
            <span>Search</span>
        </button>
        ) || <Link className="text-gray-700 hover:underline" href="/search">Search</Link>}
        <Link className="text-gray-700 hover:underline" href="/friends">Friends</Link>
        </>
    );
}