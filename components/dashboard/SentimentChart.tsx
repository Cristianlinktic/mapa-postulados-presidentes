"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { sentimentData } from '@/lib/data/sentimentData';

export function SentimentChart() {
  return (
    <div className="p-6 text-white h-[350px]">
      <h2 className="text-xl font-bold mb-4 text-center tracking-tight">Evolución de Sentimiento</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sentimentData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px' }} />
          <Legend />
          <Line type="monotone" dataKey="Cepeda" stroke="#22c55e" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="Espriella" stroke="#3b82f6" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
