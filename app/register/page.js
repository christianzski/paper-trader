import Link from 'next/link'

export default function Page() {
    return (
        <div className="mt-5 block rounded-lg m-auto bg-slate-200 max-w-sm p-6 shadow-lg">
            <h3 className="font-bold text-center">Account Registration</h3>

            <div className="m-5">
                <label className="font-light" htmlFor="firstName">First Name</label>
                <input className="bg-opacity-0" type="text" id="firstName"/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="lastName">Last Name</label>
                <input className="bg-opacity-0" type="text" id="lastName"/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="username">Username</label>
                <input className="bg-opacity-0" type="text" id="username"/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="password">Password</label>
                <input className="bg-opacity-0" type="password" id="password"/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="passwordConfirm">Re-enter Password</label>
                <input className="bg-opacity-0" type="password" id="passwordConfirm"/>
            </div>

            <div className="m-5">
                <label className="font-light" htmlFor="email">Email Address</label>
                <input className="bg-opacity-0" type="text" id="email"/>
            </div>

            <div className = "text-center m-5 mb-0">
                <button className="animate w-64 bg-emerald-400 hover:bg-emerald-500 hover:underline rounded-full py-2 px-10">Submit</button>
                <p className="mt-5">Already have an account? <Link className="text-emerald-400" href="/login">Login here!</Link></p>
            </div>
        </div>
    );
}