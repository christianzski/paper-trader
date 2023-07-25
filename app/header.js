'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Search from '@/components/search';
import DarkModeToggle from './components/DarkModeToggle'
export default function Header(user) {

 // let [theme, setTheme] = useState("dark");
  const pathname = usePathname();
   
  // Double nested object ... Spent like 30 minutes trying to figure that out.
  // console.log(user.user.firstName);
  // console.log(user);

  /**
   * 
   * @param {*} str Name
   * @returns Returns a string whose first letter is uppercase and the rest lower-case.
   */
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const headerLink = (path, text) => {
    const isActive = pathname === path;
    const fontClass = isActive ? "font-bold" : "hover:font-bold";
    const textClass = isActive ? "text-green-500" : "hover:text-green-300";

    return (
      <Link href={path} className={`text-lg w-20 h-9 ${fontClass} ${textClass} group rounded-md p-3 ring-slate-200 no-underline px-5`}>
        {text}
      </Link>
    );
  };

  return (
    <div className = "flex justify-between items-center dark:bg-slate-600">
      {/*  Left Side  */}
      <div className="px-4 m-2 space-x-14 flex grow items-center">
            <Link href="/portfolio">
              <img src="/21-Trading.png" width={100} height={80}/>
            </Link>
            <Search/>
      </div>

      {/*  Center  */}

      {/*  Right Side  */}
    
      <div className="flex pr-10">
      <div className="flex justify-center items-center mt-5 mb-6 dark:text-slate-300">
        <div className="space-x-5 flex text-sm mg-2">
          <label>{headerLink("/inbox", "Inbox")}</label>
          <label>{headerLink("/friends", "Friends")}</label>
        </div>
      </div>
      </div>

      {/*  Right Side  */}
    
      <div className="flex items-center pr-10">
        <div className='pt-5'>
        </div>
        <button className="hover:text-gray-500 mx-5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
          </svg>
        </button>
        <div className="flex items-center pr-10 dark:fill:slate-300">
          <DarkModeToggle />
        </div>
        
        <div className="flex items-center">
          <div>
            <Link href = "/account">
            <button className="rounded-full p-1 bg-gray-300 hover:bg-gray-400 text-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
            </button>
            </Link>
          </div>
          <div className="pl-2 text-center dark:text-slate-300">
            <p className="font-bold">{capitalizeFirstLetter(user.user.firstName)}</p>
          </div>
        </div>
        </div>
    </div>
  );
}
