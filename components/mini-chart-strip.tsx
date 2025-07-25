"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

interface MiniChartStripProps {
  data: { value: number }[]
  color: string
}

export function MiniChartStrip({ data, color }: MiniChartStripProps) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}