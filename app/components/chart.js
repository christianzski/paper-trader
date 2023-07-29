'use client'
import { AreaChart, Area, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
const val = "#0891b2"



function Chart({ data, domain, isUp}) {
  let graphColor;

  if (isUp) {
    graphColor = "#0b9e5e";
  } else {
    graphColor = "#a81947";
  }

  let textColor = "#020617";
  if (document.documentElement.classList.contains("dark")) 
  {
    textColor = "#cbd5e1"
    graphColor = "#cbd5e1";
  }
  return (
    <div> 
        <ResponsiveContainer width={"95%"} height={300}>
        <AreaChart  width={600} height={300} data={data} 
  margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
          <Area type="monotone" dataKey="Price" stroke={graphColor} fillOpacity={2} fill="url(#colorPrice)" />
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">

              <stop offset="5%" stopColor={graphColor} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={graphColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip/>
          <XAxis dataKey="Time" interval={25} strokeWidth={2} stroke = {textColor}/>
          <YAxis type="number" dy={4} domain={domain} tickFormatter={(value) => value.toFixed(2)} tickCount={6} tick={{ fill: textColor }} strokeWidth={0} stroke = {textColor}/>
        </AreaChart>
        </ResponsiveContainer>
    </div>
  );
}
export default Chart;