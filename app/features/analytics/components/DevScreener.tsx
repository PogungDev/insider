"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockData } from "@/app/lib/constants/mockData";

export function DevScreener() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dev Wallet Analyzer</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Holdings</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">$1.2B</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>High Risk Wallets</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">45</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Wallets</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">120</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Detected Dev Wallets</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Holdings</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.devWallets.map((wallet, index) => (
                <TableRow key={index}>
                  <TableCell>{wallet.address}</TableCell>
                  <TableCell>{wallet.project}</TableCell>
                  <TableCell>{wallet.holdings}</TableCell>
                  <TableCell>{wallet.risk}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}