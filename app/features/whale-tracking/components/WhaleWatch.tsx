"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopWhales } from "@/app/features/analytics/components/TopWhales"
import { mockData } from "@/app/lib/constants/mockData";

export function WhaleWatch() {
  const { population, avgHoldings, dailyActive } = mockData.whaleData;
  const topWhales = mockData.topWhales;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Whale Monitoring Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Whale Population</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{population}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgHoldings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Whales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dailyActive}</p>
          </CardContent>
        </Card>
      </div>
      <TopWhales whales={mockData.topWhales} />
    </div>
  )
}