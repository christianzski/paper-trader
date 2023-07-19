import { headers } from 'next/headers'
import Chart from '../../components/chart.js'
import Trade from '@/components/trade'
import Overview from './overview'

export default async function Page({params}) {
  let quote = 0;
  let list = headers();

  let chartData = [];
  let domain = [];
  
  const protocol = process.env.NODE_ENV === 'production' ? "https" : "http";

  await fetch(protocol + "://" + list.headers.host + "/quote/" + params.id)
        .then((result) => result.json())
        .then((data) => {
          quote = data.latestPrice;
        });

  await fetch(protocol + "://" + list.headers.host + "/history/" + params.id + "/2m")
        .then((result) => result.json())
        .then((data) => {
          let min = Math.max;
          let max = 0;

          for(var i in data.priceHistory) {
            let value;
            if(data.priceHistory[i] == null) {
              if(i > 0 && data.priceHistory[i - 1] != null) value = data.priceHistory[i - 1];
              else value = data.priceHistory[i + 1];
            } else value = data.priceHistory[i];

            if(value != null){
              value = value.toFixed(2);

              if(value < min) min = value;
              if(value > max) max = value;

              
              chartData.push({pv: i, Price: value});
            }
          }

          const percent = (max - min) * 0.05;
          domain = [min - percent, max + percent];
        });

  return (
    <div className="md:grid block p-5 w-full m-auto grid-flow-row-dense grid-cols-3">
      <div className="max-w-5xl p-2 col-span-2">
        <div className="flex items-center mb-1">
          <h1 className="font-bold mx-2 text-xl uppercase">{params.id.toString().toUpperCase()}:</h1>
          <p>${quote}</p>
        </div>

        <Overview symbol={params.id.toString().toUpperCase()}/>

        <div className="mt-10">
          <Chart data={chartData} domain={domain}/>
        </div>
      </div>

      <Trade symbol={params.id.toString().toUpperCase()} price={quote}/>
    </div>);
}