import Link from 'next/link';

export default function Landing() {
    return (<div className="landing h-screen">
        <div className="flex items-center bg-slate-50/50 py-5">
            <div className="mx-5">
                <Link href='/' className = "text-2xl">Home</Link>
            </div>
            <Link href='/about' className = "text-2xl">About</Link>
        </div>
        <h1 className="font-bold text-4xl text-center mt-10 mb-3">
            Welcome to Paper<br/>Trading
        </h1>

        <p className="text-md text-center">Stock Trading Made Easy</p>

        <div className = "text-center m-5 mt-16">
            <button className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Login</button>
        </div>


        <div className = "text-center m-5">
            <button className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Register</button>
        </div>
    </div>);
}