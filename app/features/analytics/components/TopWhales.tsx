import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Whale {
  rank: number
  address: string
  balance: string
  change: string
}

interface TopWhalesProps {
  whales: Whale[]
}

export function TopWhales({ whales }: TopWhalesProps) {
  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">Top Whales</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {whales.map(whale => (
              <TableRow key={whale.rank}>
                <TableCell>{whale.rank}</TableCell>
                <TableCell>{whale.address}</TableCell>
                <TableCell>{whale.balance}</TableCell>
                <TableCell className={whale.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{whale.change}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}