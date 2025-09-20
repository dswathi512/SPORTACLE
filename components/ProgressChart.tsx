import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { PerformanceRecord } from '../types';

interface ProgressChartProps {
  data: PerformanceRecord[];
  unit: string;
}

export const ProgressLineChart: React.FC<ProgressChartProps> = ({ data, unit }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" tick={{ fill: '#6B778C', fontSize: 12 }} />
          <YAxis
            tick={{ fill: '#6B778C', fontSize: 12 }}
            label={{ value: unit, angle: -90, position: 'insideLeft', fill: '#6B778C' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#0A1D37', fontWeight: 'bold' }}
          />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#0052CC" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface DistributionChartProps {
  data: { name: string; value: number }[];
}

export const DistributionBarChart: React.FC<DistributionChartProps> = ({ data }) => {
    return (
        <div className="w-full h-80">
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis type="number" tick={{ fill: '#6B778C', fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#6B778C', fontSize: 12 }} width={80}/>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }}
                        labelStyle={{ color: '#0A1D37', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="value" fill="#0052CC" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};