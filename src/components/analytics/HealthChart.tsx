'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/lib/store';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity } from 'lucide-react';

export function HealthChart() {
  const { wellness } = useStore();

  const hasData = wellness?.history && wellness.history.length > 1;

  const chartData = hasData ? wellness.history : [];

  return (
    <Card className="h-full flex flex-col p-6 relative overflow-hidden min-h-[400px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-yellow-400" />
      
      <div className="flex items-start md:items-center gap-3 mt-4 mb-6 z-10">
        <Activity className="w-6 h-6 text-cyan-500 dark:text-cyan-400 flex-shrink-0 mt-1 md:mt-0" />
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight">Mental Wellness Progress</h2>
      </div>

      <div className="w-full h-[300px] relative mt-4">
        {!hasData && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-sm bg-background/40 rounded-xl">
            <Activity className="w-12 h-12 text-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground/80 mb-2">No Data Yet</h3>
            <p className="text-sm font-medium text-foreground/60 max-w-xs text-center">
              Check in and interact with Pebbl daily to build your wellness chart and track your stress levels over time!
            </p>
          </div>
        )}

        <div className={`absolute inset-0 transition-opacity duration-500 ${!hasData ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorHp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)" 
                tick={{fill: 'currentColor', opacity: 0.7, fontSize: 12, fontWeight: 'bold'}} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)" 
                tick={{fill: 'currentColor', opacity: 0.7, fontSize: 12, fontWeight: 'bold'}}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Area 
                type="monotone" 
                dataKey="hp" 
                stroke="#22d3ee" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorHp)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
