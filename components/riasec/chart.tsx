'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';

// Define the type for our data
interface RiasecData {
  name: string;
  score: number;
  color: string;
}

interface RiasecChartProps {
  data: RiasecData[];
}

const RIASECChart = ({ data }: RiasecChartProps) => {
  // Colors for each RIASEC category
  const COLORS = {
    R: '#8884d8', // Realistic - Purple
    I: '#82ca9d', // Investigative - Green
    A: '#ffc658', // Artistic - Orange
    S: '#ff7300', // Social - Orange-Red
    E: '#0088fe', // Enterprising - Blue
    C: '#00c49f'  // Conventional - Turquoise
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded shadow-md">
          <p className="font-bold">{payload[0].payload.name}</p>
          <p>Skor: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="score" name="Skor RIASEC">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RIASECChart;