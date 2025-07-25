"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { mockData } from "@/app/lib/constants/mockData";

export function TxLog() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Transaction History Viewer</h1>
        <Button>Save as CSV</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>From/To</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>USD Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.transactions.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>{tx.type} ({tx.direction})</TableCell>
                  <TableCell>{tx.from} → {tx.to}</TableCell>
                  <TableCell>{tx.time}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.usd}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}