import Link from 'next/link';

export default function Page() {
    return (<>
        <h1 className="font-bold text-4xl text-center mt-10 mb-3">
            Welcome to Paper<br/>Trading
        </h1>

        <p className="text-md text-center">Stock Trading Made Easy</p>

        <div className = "text-center m-5 mt-16">
            <Link href="/login">
                <button className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Login</button>
            </Link>
        </div>

        <div className = "text-center m-5">
            <Link href="/register">
                <button className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Register</button>
            </Link>
        </div>
    </>);
}