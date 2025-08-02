import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export interface FlowSectorChartDatum {
  sector: number;
  conc:   number;
  worst?: boolean;
}

interface Props {
  data: FlowSectorChartDatum[];
}

const FlowSectorChart: React.FC<Props> = ({ data }) => {
  // guard against undefined / wrong type
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="sector" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="conc" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FlowSectorChart;