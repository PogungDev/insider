import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Eye, AlertTriangle, Crown, Activity, ExternalLink, Target } from "lucide-react"

interface Whale {
  rank: number
  address: string
  label?: string
  balance: string
  balanceUSD: number
  change: string
  changePercent: number
  riskLevel: 'low' | 'medium' | 'high'
  activityScore: number
  lastActive: string
  totalTransactions: number
  avgTransactionSize: number
  influence: number
  category: 'institutional' | 'individual' | 'exchange' | 'defi' | 'unknown'
}

interface TopWhalesProps {
  whales?: Whale[]
}

const mockWhales: Whale[] = [
  {
    rank: 1,
    address: "sei1abc123def456ghi789jkl012mno345pqr678stu901",
    label: "Institutional Alpha",
    balance: "12,450,000",
    balanceUSD: 24900000,
    change: "+2.5%",
    changePercent: 2.5,
    riskLevel: "low",
    activityScore: 95,
    lastActive: "2h ago",
    totalTransactions: 1247,
    avgTransactionSize: 125000,
    influence: 98,
    category: "institutional"
  },
  {
    rank: 2,
    address: "sei1xyz789abc123def456ghi789jkl012mno345pqr678",
    label: "DeFi Whale",
    balance: "8,750,000",
    balanceUSD: 17500000,
    change: "-1.2%",
    changePercent: -1.2,
    riskLevel: "medium",
    activityScore: 87,
    lastActive: "5h ago",
    totalTransactions: 892,
    avgTransactionSize: 89000,
    influence: 85,
    category: "defi"
  },
  {
    rank: 3,
    address: "sei1mno456pqr789stu012vwx345yza678bcd901efg234",
    label: "Exchange Vault",
    balance: "6,200,000",
    balanceUSD: 12400000,
    change: "+0.8%",
    changePercent: 0.8,
    riskLevel: "low",
    activityScore: 92,
    lastActive: "1h ago",
    totalTransactions: 2156,
    avgTransactionSize: 45000,
    influence: 78,
    category: "exchange"
  },
  {
    rank: 4,
    address: "sei1def456ghi789jkl012mno345pqr678stu901vwx234",
    label: "Smart Money",
    balance: "4,890,000",
    balanceUSD: 9780000,
    change: "+5.7%",
    changePercent: 5.7,
    riskLevel: "high",
    activityScore: 76,
    lastActive: "30m ago",
    totalTransactions: 567,
    avgTransactionSize: 156000,
    influence: 72,
    category: "individual"
  },
  {
    rank: 5,
    address: "sei1ghi789jkl012mno345pqr678stu901vwx234yza567",
    label: "Arbitrage Bot",
    balance: "3,450,000",
    balanceUSD: 6900000,
    change: "-3.1%",
    changePercent: -3.1,
    riskLevel: "medium",
    activityScore: 99,
    lastActive: "15m ago",
    totalTransactions: 4523,
    avgTransactionSize: 12000,
    influence: 45,
    category: "defi"
  }
]

export function TopWhales({ whales = mockWhales }: TopWhalesProps) {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low Risk</Badge>
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Risk</Badge>
      case 'high': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Risk</Badge>
      default: return null
    }
  }

  const getCategoryBadge = (category: string) => {
    const configs = {
      institutional: { color: "bg-blue-100 text-blue-800", icon: Crown },
      individual: { color: "bg-purple-100 text-purple-800", icon: Target },
      exchange: { color: "bg-orange-100 text-orange-800", icon: Activity },
      defi: { color: "bg-green-100 text-green-800", icon: TrendingUp },
      unknown: { color: "bg-gray-100 text-gray-800", icon: AlertTriangle }
    }
    const config = configs[category as keyof typeof configs] || configs.unknown
    const IconComponent = config.icon
    
    return (
      <Badge className={`${config.color} hover:${config.color}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    )
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const getInfluenceColor = (influence: number) => {
    if (influence >= 80) return "text-red-600"
    if (influence >= 60) return "text-orange-600"
    if (influence >= 40) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            Top Whales
          </CardTitle>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Monitor All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {whales.slice(0, 5).map(whale => {
            const TrendIcon = whale.changePercent >= 0 ? TrendingUp : TrendingDown
            const trendColor = whale.changePercent >= 0 ? "text-green-600" : "text-red-600"
            
            return (
              <div key={whale.rank} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm">
                      #{whale.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{whale.label}</span>
                        {getCategoryBadge(whale.category)}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {formatAddress(whale.address)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{whale.balance} SEI</div>
                    <div className="text-sm text-gray-500">${whale.balanceUSD.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">24h Change</div>
                    <div className={`flex items-center gap-1 font-semibold ${trendColor}`}>
                      <TrendIcon className="h-3 w-3" />
                      {whale.change}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Activity Score</div>
                    <div className="flex items-center gap-2">
                      <Progress value={whale.activityScore} className="h-2 flex-1" />
                      <span className="text-xs font-semibold">{whale.activityScore}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Influence</div>
                    <div className={`font-semibold ${getInfluenceColor(whale.influence)}`}>
                      {whale.influence}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Last Active</div>
                    <div className="text-sm font-medium">{whale.lastActive}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Txs: {whale.totalTransactions.toLocaleString()}</span>
                    <span>Avg: ${whale.avgTransactionSize.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRiskBadge(whale.riskLevel)}
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Analyze
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {whales.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>No whale data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
