'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    // const pathname = usePathname();

    return(
    <div class="flex items-baseline mt-5 mb-6 pb-7">
      <div class="space-x-10 flex text-sm">
        <label>
          <Link href = '/portfolio' className="text-lg w-20 h-9 hover:font-bold hover:text-green-500 group rounded-md p-3 ring-slate-200 no-underline">
            Portfolio
          </Link>
        </label>
        <label>
          <Link href = '/inbox' className="text-lg w-20 h-9 hover:font-bold hover:text-green-500 group rounded-md p-3 ring-slate-200 no-underline">
            Inbox
          </Link>
        </label>
        <label>
          <Link href = '/search' className="text-lg w-20 h-9 hover:font-bold hover:text-green-500 group rounded-md p-3 ring-slate-200 no-underline">
            Search
          </Link>
        </label>
        <label>
          <Link href = '/friends' className="text-lg w-20 h-9 hover:font-bold hover:text-green-500 group rounded-md p-3 ring-slate-200 no-underline">
            Friends
          </Link>
        </label>
      </div>
    </div>
    )
}