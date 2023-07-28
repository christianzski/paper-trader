import Portfolio from '@/components/portfolio'
import PortfolioChart from '@/components/portfolioChart'

import db from '../../db';
import friendList from '../../api/friendList';

import { cookies } from 'next/headers'

export default async function Page({searchParams}) {
    if(searchParams.user) {
        // User is already authenticated if this page is rendering
        const cookieStore = cookies();
        const userId = cookieStore.get('user')?.value;
        let friend = null;
        
        await db.connect(async (db) => {
            friend = await friendList.getFriend(db, userId, searchParams.user);
        });

        if(!friend) {
            return (<div className="text-center">Sorry, this user does not exist or is not your friend.</div>)
        }
    }

    return (
        <main className="flex flex-col items-center">
            <div className="grid p-5 w-full grid-flow-row-dense grid-cols-3 grid-rows-1">
                <div className="col-span-2">
                    <PortfolioChart/>

                    <div className="mt-5 dark:text-slate-300">
                        <h3 className="font-bold font-xl">Watchlist</h3>
                        
                    </div>
                </div>
                <div className="px-2 text-center font-bold font-xl dark:text-slate-300 m-1 border-l-2 border-sky-900 dark:border-sky-50 interBold">
                    <div className = "pb-3 border-b-2">Portfolio</div>
                    <Portfolio/>
                </div>
            </div>
        </main>
    );
}