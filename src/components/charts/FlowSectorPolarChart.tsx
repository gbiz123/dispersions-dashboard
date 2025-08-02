import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';

interface Props {
  data: Array<{ sector: number; conc: number; worst?: boolean }>;
}

/**
 * Polar / radar plot of flow-sector concentrations.
 */
const FlowSectorPolarChart: React.FC<Props> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        {/* angle = direction in degrees (0–360) */}
        <PolarAngleAxis
          dataKey="sector"
          tick={{ fontSize: 10 }}
          domain={[0, 360]}
        />
        <PolarRadiusAxis
          tick={{ fontSize: 10 }}
          angle={90}
          stroke="#d1d5db"
        />
        <Tooltip formatter={(v: number) => v.toFixed(3)} />
        <Radar
          name="Concentration"
          dataKey="conc"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.4}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default FlowSectorPolarChart;