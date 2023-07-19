
import Link from 'next/link'
import Chart from '@/components/chart'
import Favorited from '@/components/favorited'
import Portfolio from '@/components/portfolio';

import { useSearchParams } from 'next/navigation'

export default function Page() {
    return (
        <main className="flex flex-col items-center">
            <div className="grid p-5 w-full grid-flow-row-dense grid-cols-3 grid-rows-1">
                <div className  ="col-span-2">
                    <div className="flex justify-between items-center mb-1">
                        <div>
                            <div className="inline-block bg-purple-300 px-3 mr-1 rounded-full font-bold">1 Month</div>
                            <div className="h-full inline-block">
                                -
                            </div>

                            <div className="inline-block bg-purple-300 px-3 ml-1 rounded-full font-bold">14%</div>
                        </div>

                        <div>
                            <p className="font-bold">Portfolio Balance</p>
                            <div className="bg-teal-300 rounded-full w-full text-center">
                                $ {10000}
                            </div>
                        </div>
                    </div>

                    <h3>Portfolio History</h3>
                    <div className="w-full">
                        <Chart data={[{pv: 0, Price: 10000}, {pv: 1, Price: 10000}]} domain={[9500, 10500]}/>
                    </div>

                    <div className="mt-5">
                        <h3 className="font-bold font-xl">Watchlist</h3>
                        <Favorited/>
                    </div>
                </div>
                <div className="text-center">
                    Stock Portfolio
                    <Portfolio/>
                </div>
            </div>
        </main>
    );
}