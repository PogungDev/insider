"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Shield } from "lucide-react"
import { RiskScorer } from "@/lib/risk-scorer"

// Mock dev wallet data
const mockDevWallets = [
  { address: "0xdev1...abcd", balance: 500000, transactions: 200, age: 45, anomalyScore: 15 },
  { address: "0xdev2...efgh", balance: 1200000, transactions: 1500, age: 20, anomalyScore: 40 },
  { address: "0xdev3...ijkl", balance: 300000, transactions: 80, age: 200, anomalyScore: 5 },
]

export default function DevWalletScreener() {
  const [devWallets, setDevWallets] = useState(mockDevWallets.map(wallet => ({
    ...wallet,
    riskScore: RiskScorer.calculateRisk(wallet)
  })))
  const [searchQuery, setSearchQuery] = useState("")

  const filteredWallets = devWallets.filter(wallet => 
    wallet.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center"><Shield className="mr-2" /> Dev Wallet Screener</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search dev wallets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Age (days)</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWallets.map((wallet, index) => {
                const riskLevel = RiskScorer.getRiskLevel(wallet.riskScore)
                return (
                  <TableRow key={index}>
                    <TableCell>{wallet.address}</TableCell>
                    <TableCell>${wallet.balance.toLocaleString()}</TableCell>
                    <TableCell>{wallet.transactions}</TableCell>
                    <TableCell>{wallet.age}</TableCell>
                    <TableCell>{wallet.riskScore}%</TableCell>
                    <TableCell>
                      <Badge variant={riskLevel === 'low' ? "success" : riskLevel === 'medium' ? "warning" : "destructive"}>
                        {riskLevel.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}