import Link from 'next/link';
import LeftBear from './leftBear'
import RightBear from './rightBear'
import SecondPage from './secondPage.js'


export default function Page() {
    return (<>
        <div>
            <div className="flex justify-center py-4 " >
                <img className = "pt-20" src="21TradingMain.png" width={400} height={50}></img>
            </div>
            <div className ="interBold text-center">
                A paper trading platform
            </div>
            <div className = "flex flex-row justify-center">
                <LeftBear></LeftBear>
                <RightBear></RightBear>
            </div>

            <SecondPage></SecondPage>
            
        </div>
    </>);
}