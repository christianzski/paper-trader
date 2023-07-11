import './globals.css'
import Link from 'next/link'

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className = "m-2 flex justify-between">
                    <div className = "m-2 space-x-8 flex items-center">
                        <img src="logo.png"/>
                        <button className="bg-slate-200 text-slate-800 font-bold py-1 px-2 rounded inline-flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                            </svg>
                            <span>Portfolio</span>
                        </button>

                        <Link className="text-gray-700 hover:underline" href="/inbox">Inbox</Link>
                        <Link className="text-gray-700 hover:underline" href="/search">Search</Link>

                        <Link className="text-gray-700 hover:underline" href="/friends">Friends</Link>
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
            </body>
        </html>
    )
}
