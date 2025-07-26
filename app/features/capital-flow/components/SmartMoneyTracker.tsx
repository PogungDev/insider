"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, TrendingUp, TrendingDown, Star, Target, Zap, Eye, Users, DollarSign, Clock, ArrowUpRight, ArrowDownRight, Copy } from "lucide-react"

interface SmartMoneyWallet {
  id: string
  address: string
  label: string
  smartScore: number
  totalPnL: number
  winRate: number
  avgHoldTime: number
  totalVolume: number
  followersCount: number
  recentActivity: string
  riskLevel: 'low' | 'medium' | 'high'
  specialization: string[]
  lastActive: number
}

interface SmartMoneyMove {
  id: string
  walletAddress: string
  walletLabel: string
  action: 'buy' | 'sell' | 'add_liquidity' | 'remove_liquidity'
  token: string
  amount: number
  price: number
  timestamp: number
  confidence: number
  impact: number
  reasoning: string
}

interface CopyTradeSignal {
  id: string
  walletAddress: string
  walletLabel: string
  signal: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'
  token: string
  confidence: number
  timeframe: string
  expectedReturn: number
  riskScore: number
  reasoning: string
}

export function SmartMoneyTracker() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [smartWallets, setSmartWallets] = useState<SmartMoneyWallet[]>([])
  const [recentMoves, setRecentMoves] = useState<SmartMoneyMove[]>([])
  const [copySignals, setCopySignals] = useState<CopyTradeSignal[]>([])
  const [isTracking, setIsTracking] = useState(true)

  // Mock data untuk demo
  const mockSmartWallets: SmartMoneyWallet[] = [
    {
      id: "1",
      address: "sei1abc123def456ghi789",
      label: "DeFi Alpha Hunter",
      smartScore: 94,
      totalPnL: 2850000,
      winRate: 87.5,
      avgHoldTime: 72,
      totalVolume: 12500000,
      followersCount: 1250,
      recentActivity: "Accumulated SEI before 15% pump",
      riskLevel: "low",
      specialization: ["DeFi", "Layer 1", "Gaming"],
      lastActive: Date.now() - 1800000
    },
    {
      id: "2",
      address: "sei1xyz789abc123def456",
      label: "Whale Arbitrageur",
      smartScore: 91,
      totalPnL: 1650000,
      winRate: 82.3,
      avgHoldTime: 24,
      totalVolume: 8900000,
      followersCount: 890,
      recentActivity: "Cross-DEX arbitrage on ATOM/SEI",
      riskLevel: "medium",
      specialization: ["Arbitrage", "MEV", "Cross-chain"],
      lastActive: Date.now() - 900000
    },
    {
      id: "3",
      address: "sei1mno456pqr789stu012",
      label: "Institutional Flow",
      smartScore: 88,
      totalPnL: 4200000,
      winRate: 79.1,
      avgHoldTime: 168,
      totalVolume: 25000000,
      followersCount: 2100,
      recentActivity: "Large USDC position building",
      riskLevel: "low",
      specialization: ["Stablecoins", "Yield Farming", "Institutional"],
      lastActive: Date.now() - 3600000
    }
  ]

  const mockRecentMoves: SmartMoneyMove[] = [
    {
      id: "1",
      walletAddress: "sei1abc123def456ghi789",
      walletLabel: "DeFi Alpha Hunter",
      action: "buy",
      token: "SEI",
      amount: 125000,
      price: 0.98,
      timestamp: Date.now() - 1200000,
      confidence: 92,
      impact: 3.2,
      reasoning: "Technical breakout pattern + volume surge"
    },
    {
      id: "2",
      walletAddress: "sei1xyz789abc123def456",
      walletLabel: "Whale Arbitrageur",
      action: "add_liquidity",
      token: "ATOM/SEI",
      amount: 89000,
      price: 1.45,
      timestamp: Date.now() - 2400000,
      confidence: 85,
      impact: 2.1,
      reasoning: "High APY opportunity + low impermanent loss risk"
    },
    {
      id: "3",
      walletAddress: "sei1mno456pqr789stu012",
      walletLabel: "Institutional Flow",
      action: "sell",
      token: "USDC",
      amount: 450000,
      price: 1.001,
      timestamp: Date.now() - 3600000,
      confidence: 78,
      impact: 1.8,
      reasoning: "Profit taking after stablecoin premium"
    }
  ]

  const mockCopySignals: CopyTradeSignal[] = [
    {
      id: "1",
      walletAddress: "sei1abc123def456ghi789",
      walletLabel: "DeFi Alpha Hunter",
      signal: "strong_buy",
      token: "SEI",
      confidence: 94,
      timeframe: "1-3 days",
      expectedReturn: 18.5,
      riskScore: 25,
      reasoning: "Consistent accumulation pattern + upcoming catalyst"
    },
    {
      id: "2",
      walletAddress: "sei1xyz789abc123def456",
      walletLabel: "Whale Arbitrageur",
      signal: "buy",
      token: "ATOM",
      confidence: 87,
      timeframe: "6-12 hours",
      expectedReturn: 5.2,
      riskScore: 35,
      reasoning: "Cross-chain arbitrage opportunity detected"
    },
    {
      id: "3",
      walletAddress: "sei1mno456pqr789stu012",
      walletLabel: "Institutional Flow",
      signal: "hold",
      token: "USDC",
      confidence: 82,
      timeframe: "1-2 weeks",
      expectedReturn: 2.1,
      riskScore: 15,
      reasoning: "Stable yield farming position maintenance"
    }
  ]

  useEffect(() => {
    setSmartWallets(mockSmartWallets)
    setRecentMoves(mockRecentMoves)
    setCopySignals(mockCopySignals)
  }, [])

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy': return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'sell': return <ArrowDownRight className="h-4 w-4 text-red-500" />
      case 'add_liquidity': return <TrendingUp className="h-4 w-4 text-blue-500" />
      case 'remove_liquidity': return <TrendingDown className="h-4 w-4 text-orange-500" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'strong_buy': return 'bg-green-600 text-white'
      case 'buy': return 'bg-green-100 text-green-800'
      case 'hold': return 'bg-yellow-100 text-yellow-800'
      case 'sell': return 'bg-red-100 text-red-800'
      case 'strong_sell': return 'bg-red-600 text-white'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toFixed(0)}`
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Smart Money Tracker</h2>
          <p className="text-muted-foreground">Follow dan copy trade dari wallet-wallet smart money terbaik</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1H</SelectItem>
              <SelectItem value="24h">24H</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant={isTracking ? "default" : "secondary"} className="bg-blue-500">
            <Eye className="h-3 w-3 mr-1" />
            Live Tracking
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-purple-600">{smartWallets.length}</span>
            </div>
            <p className="text-sm font-medium mt-1">Smart Wallets</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Avg Score: 91</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-600">$8.7M</span>
            </div>
            <p className="text-sm font-medium mt-1">Total P&L</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+12.5% 30d</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">83%</span>
            </div>
            <p className="text-sm font-medium mt-1">Avg Win Rate</p>
            <Progress value={83} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">4.2K</span>
            </div>
            <p className="text-sm font-medium mt-1">Total Followers</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Copy traders</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="wallets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wallets">Smart Wallets</TabsTrigger>
          <TabsTrigger value="moves">Recent Moves</TabsTrigger>
          <TabsTrigger value="signals">Copy Signals</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="wallets" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {smartWallets.map((wallet) => (
              <Card key={wallet.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{wallet.label}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {wallet.address.slice(0, 12)}...
                        </code>
                        <Button variant="ghost" size="sm" onClick={() => copyAddress(wallet.address)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold">{wallet.smartScore}</span>
                      </div>
                      <Badge variant="outline" className={getRiskColor(wallet.riskLevel)}>
                        {wallet.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total P&L</p>
                      <p className="font-semibold text-green-600">{formatCurrency(wallet.totalPnL)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-semibold">{wallet.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Hold</p>
                      <p className="font-semibold">{wallet.avgHoldTime}h</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Followers</p>
                      <p className="font-semibold">{wallet.followersCount}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Specialization</p>
                    <div className="flex flex-wrap gap-1">
                      {wallet.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-2 bg-blue-50 rounded text-xs">
                    <p className="font-medium text-blue-800">Recent Activity</p>
                    <p className="text-blue-600">{wallet.recentActivity}</p>
                    <p className="text-blue-500 mt-1">{formatTimeAgo(wallet.lastActive)}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Follow
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Copy Trade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="moves" className="space-y-4">
          <div className="space-y-3">
            {recentMoves.map((move) => (
              <Card key={move.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getActionIcon(move.action)}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{move.walletLabel}</p>
                          <Badge className="text-xs capitalize">{move.action.replace('_', ' ')}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(move.amount)} {move.token} @ ${move.price}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{move.confidence}% confidence</Badge>
                        <span className="text-sm text-muted-foreground">{formatTimeAgo(move.timestamp)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Impact: {move.impact}%</p>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                    <p className="font-medium">AI Reasoning:</p>
                    <p className="text-muted-foreground">{move.reasoning}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {copySignals.map((signal) => (
              <Card key={signal.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{signal.token}</CardTitle>
                      <p className="text-sm text-muted-foreground">{signal.walletLabel}</p>
                    </div>
                    <Badge className={getSignalColor(signal.signal)}>
                      {signal.signal.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Confidence</p>
                      <p className="font-semibold">{signal.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Timeframe</p>
                      <p className="font-semibold">{signal.timeframe}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expected Return</p>
                      <p className="font-semibold text-green-600">+{signal.expectedReturn}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Risk Score</p>
                      <p className="font-semibold">{signal.riskScore}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Confidence Level</span>
                      <span>{signal.confidence}%</span>
                    </div>
                    <Progress value={signal.confidence} className="h-2" />
                  </div>

                  <div className="p-2 bg-blue-50 rounded text-xs">
                    <p className="font-medium text-blue-800">Signal Reasoning:</p>
                    <p className="text-blue-600">{signal.reasoning}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Zap className="h-3 w-3 mr-1" />
                      Copy Trade
                    </Button>
                    <Button variant="outline" size="sm">
                      <Clock className="h-3 w-3 mr-1" />
                      Set Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Money Leaderboard</CardTitle>
              <CardDescription>Top performing wallets ranked by smart score and profitability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {smartWallets
                  .sort((a, b) => b.smartScore - a.smartScore)
                  .map((wallet, index) => (
                    <div key={wallet.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{wallet.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {wallet.address.slice(0, 12)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">{wallet.smartScore}</span>
                        </div>
                        <p className="text-sm text-green-600">{formatCurrency(wallet.totalPnL)}</p>
                        <p className="text-xs text-muted-foreground">{wallet.winRate}% win rate</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}