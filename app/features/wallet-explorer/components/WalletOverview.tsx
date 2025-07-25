"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { mockData } from "@/app/lib/constants/mockData";

export function WalletOverview() {
  const { balance, securityRating, transactions, age } = mockData.walletMetrics;
  const balanceHistory = mockData.balanceHistory;
  const walletTags = mockData.walletTags;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Wallet Profile Summary</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Current Balance</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{balance}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Security Rating</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{securityRating}/100</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{transactions}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Wallet Age</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{age}</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Balance History</CardTitle></CardHeader>
        <CardContent>
          <LineChart width={600} height={300} data={mockData.balanceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" name="Balance" />
          </LineChart>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Wallet Tags</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {mockData.walletTags.map((tag, index) => (
            <div key={index} className="flex items-center justify-between">
              <Badge variant="secondary" className={`bg-${tag.color}-100 text-${tag.color}-800`}>{tag.label}</Badge>
              <Progress value={tag.progress} className="w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}