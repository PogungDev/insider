import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, ExternalLink, Clock, DollarSign, AlertTriangle, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Transaction {
  id: string
  from: string
  to: string
  amount: string
  token: string
  usdValue: number
  type: 'send' | 'receive' | 'swap' | 'stake' | 'unstake'
  status: 'confirmed' | 'pending' | 'failed'
  timestamp: number
  gasUsed?: number
  riskLevel?: 'low' | 'medium' | 'high'
  time: string
}

interface RecentTransactionsProps {
  transactions?: Transaction[]
}

const mockTransactions: Transaction[] = [
  {
    id: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    from: "sei1abc123def456ghi789jkl012mno345pqr678stu901",
    to: "sei1xyz789abc123def456ghi789jkl012mno345pqr678",
    amount: "1,250.50",
    token: "SEI",
    usdValue: 2501.00,
    type: "send",
    status: "confirmed",
    timestamp: Date.now() - 5 * 60 * 1000,
    gasUsed: 21000,
    riskLevel: "low",
    time: "5m ago"
  },
  {
    id: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
    from: "sei1mno456pqr789stu012vwx345yza678bcd901efg234",
    to: "sei1abc123def456ghi789jkl012mno345pqr678stu901",
    amount: "5,000.00",
    token: "USDC",
    usdValue: 5000.00,
    type: "receive",
    status: "confirmed",
    timestamp: Date.now() - 12 * 60 * 1000,
    gasUsed: 45000,
    riskLevel: "medium",
    time: "12m ago"
  },
  {
    id: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
    from: "sei1xyz789abc123def456ghi789jkl012mno345pqr678",
    to: "sei1def456ghi789jkl012mno345pqr678stu901vwx234",
    amount: "750.25",
    token: "SEI",
    usdValue: 1500.50,
    type: "swap",
    status: "pending",
    timestamp: Date.now() - 18 * 60 * 1000,
    gasUsed: 120000,
    riskLevel: "low",
    time: "18m ago"
  },
  {
    id: "0x4d5e6f7890abcdef1234567890abcdef12345678",
    from: "sei1ghi789jkl012mno345pqr678stu901vwx234yza567",
    to: "sei1abc123def456ghi789jkl012mno345pqr678stu901",
    amount: "10,000.00",
    token: "SEI",
    usdValue: 20000.00,
    type: "stake",
    status: "confirmed",
    timestamp: Date.now() - 25 * 60 * 1000,
    gasUsed: 85000,
    riskLevel: "high",
    time: "25m ago"
  },
  {
    id: "0x5e6f7890abcdef1234567890abcdef123456789a",
    from: "sei1jkl012mno345pqr678stu901vwx234yza567bcd890",
    to: "sei1xyz789abc123def456ghi789jkl012mno345pqr678",
    amount: "2,500.75",
    token: "USDT",
    usdValue: 2500.75,
    type: "send",
    status: "failed",
    timestamp: Date.now() - 35 * 60 * 1000,
    gasUsed: 0,
    riskLevel: "medium",
    time: "35m ago"
  }
]

export function RecentTransactions({ transactions = mockTransactions }: RecentTransactionsProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case 'receive': return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case 'swap': return <DollarSign className="h-4 w-4 text-blue-500" />
      case 'stake': return <CheckCircle className="h-4 w-4 text-purple-500" />
      case 'unstake': return <Clock className="h-4 w-4 text-orange-500" />
      default: return <ExternalLink className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case 'failed': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      default: return <Badge>Unknown</Badge>
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low Risk</Badge>
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Risk</Badge>
      case 'high': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Risk</Badge>
      default: return null
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-700">Recent Transactions</CardTitle>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 5).map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                  {getTypeIcon(tx.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm capitalize">{tx.type}</span>
                    {getStatusBadge(tx.status)}
                    {tx.riskLevel && getRiskBadge(tx.riskLevel)}
                  </div>
                  <div className="text-xs text-gray-500">
                    From: <span className="font-mono">{formatAddress(tx.from)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    To: <span className="font-mono">{formatAddress(tx.to)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="font-semibold">
                  {tx.amount} {tx.token}
                </div>
                <div className="text-sm text-gray-500">
                  ${tx.usdValue ? tx.usdValue.toLocaleString() : '0'}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {tx.time}
                </div>
                {tx.gasUsed && tx.gasUsed > 0 && (
                  <div className="text-xs text-gray-400">
                    Gas: {tx.gasUsed.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>No recent transactions found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
