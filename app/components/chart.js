'use client'
import { AreaChart, Area, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
const val = "#0891b2"
function Chart({ data, domain}) {
  return (
    <div>
        <ResponsiveContainer width={"95%"} height={300}>
        <AreaChart width={600} height={300} data={data} 
  margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
          <Area type="monotone" dataKey="Price" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" />
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="lime-800" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip/>
          <XAxis dataKey="name" interval={12}/>
          <YAxis type="number" dy={4} domain={domain} tickFormatter={(value) => value.toFixed(2)} tickCount={6}/>
        </AreaChart>
        </ResponsiveContainer>
    </div>
  );
}
export default Chart;