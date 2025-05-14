import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Area
} from 'recharts';

interface ChartDataPoint {
  distance: number;
  concentration: number;
  date: string;
}

interface DistanceConcentrationChartProps {
  data: ChartDataPoint[];
}

const DistanceConcentrationChart: React.FC<DistanceConcentrationChartProps> = ({ data }) => {
  /* avoid empty render */
  if (!Array.isArray(data) || data.length === 0) return null;

  /* 1 ▸ ensure points are ordered left-to-right */
  const sorted = [...data].sort((a, b) => a.distance - b.distance);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={sorted} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {/* axes & helpers */}
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="distance" label={{ value: 'Distance', position: 'insideBottomRight', offset: -5 }} />
        <YAxis label={{ value: 'Concentration', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />

        {/* 2 ▸ shaded area (plain colour, visible) */}
        <Area
          type="monotone"
          dataKey="concentration"
          stroke="none"
          fill="#4ade80"
          fillOpacity={0.25}
          name="Max Concentration (area)"
          isAnimationActive={false}
        />

        {/* outline line stays on top */}
        <Line
          type="monotone"
          dataKey="concentration"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          name="Max Concentration"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DistanceConcentrationChart;