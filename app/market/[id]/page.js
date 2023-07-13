import { headers } from 'next/headers'
import Chart from '../../components/chart.js'

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

            value = value.toFixed(2);

            if(value < min) min = value;
            if(value > max) max = value;

            chartData.push({pv: i, Price: value});
          }

          const percent = (max - min) * 0.05;
          domain = [min - percent, max + percent];
        });

        return (<div className="p-2">
            <div className="flex items-center mb-1">
              <h1 className="font-bold mx-2 text-lg">{params.id}:</h1>
              <p>${quote}</p>
            </div>

            <div className="mt-10 ml-10">
            <Chart data={chartData} domain={domain}/>
            </div>

            <div className="flex items-center columns-4">
              <p className = "font-bold text-lg mr-5">Price per share</p>
              <p className = "font-bold text-sm">{quote}</p>
            </div>

            <div className="h-0.5 w-full bg-slate-500 grid-4"></div>
          </div>);
}