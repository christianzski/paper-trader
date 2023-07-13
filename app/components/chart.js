'use client'
import { LineChart, Tooltip, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

function Chart({ data, domain}) {
  return (
    <div>
        <LineChart width={600} height={300} data={data}>
            <Line type="monotone" dataKey="Price" stroke="#8884d8" dot={false}/>
            <CartesianGrid stroke="#ccc" />
            <Tooltip/>
            <XAxis dataKey="name" interval={12}/>
            <YAxis type="number" dy={4} domain={domain} tickFormatter={(value) => value.toFixed(2)} tickCount={6}/>
        </LineChart>
    </div>
  );
}
export default Chart;