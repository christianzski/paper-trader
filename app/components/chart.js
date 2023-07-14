'use client'
import { AreaChart, LineChart, Tooltip, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

function Chart({ data, domain}) {
  return (
    <div>
        <LineChart width={600} height={300} data={data}>
            <Line type="monotone" dataKey="Price" stroke="#8884d8" dot={false}/>
            {/*<CartesianGrid stroke="#ccc" />*/}
            {/*<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>*/}
            <Tooltip/>
            <XAxis dataKey="name" interval={12}/>
            <YAxis type="number" dy={4} domain={domain} tickFormatter={(value) => value.toFixed(2)} tickCount={6}/>
        </LineChart>
    </div>
  );
}
export default Chart;