'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header(user) {
  const pathname = usePathname();
  console.log(user);

  const headerLink = (path, text) => {
    const isActive = pathname === path;
    const fontClass = isActive ? "font-bold" : "hover:font-bold";
    const textClass = isActive ? "text-green-500" : "hover:text-green-300";

    return (
      <Link href={path} className={`text-lg w-20 h-9 ${fontClass} ${textClass} group rounded-md p-3 ring-slate-200 no-underline`}>
        {text}
      </Link>
    );
  };

  return (
    <div className="flex items-baseline mt-5 mb-6 pb-7">
      <div className="space-x-10 flex text-sm">
        <label>{headerLink("/portfolio", "Portfolio")}</label>
        <label>{headerLink("/inbox", "Inbox")}</label>
        <label>{headerLink("/search", "Search")}</label>
        <label>{headerLink("/friends", "Friends")}</label>
      </div>
    </div>
  );
}
