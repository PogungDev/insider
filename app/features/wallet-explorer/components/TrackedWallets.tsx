"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { mockData } from "@/app/lib/constants/mockData";

export function TrackedWallets() {
  const [newAddress, setNewAddress] = useState("")

  const handleAddWallet = () => {
    // Logika untuk menambahkan wallet
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tracked Wallet Manager</h1>
      <Card>
        <CardHeader><CardTitle>Watch New Address</CardTitle></CardHeader>
        <CardContent className="flex gap-4">
          <Input placeholder="Enter wallet address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
          <Button onClick={handleAddWallet}>Track</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Watched Addresses (3)</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>24h Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.trackedWallets.map((wallet, index) => (
                <TableRow key={index}>
                  <TableCell>{wallet.address}</TableCell>
                  <TableCell>{wallet.added}</TableCell>
                  <TableCell>{wallet.balance}</TableCell>
                  <TableCell className={wallet.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{wallet.change}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}