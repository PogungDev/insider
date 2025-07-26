"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, TrendingUp, TrendingDown, Activity, Droplets, Zap, Target, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface LiquidityPool {
  id: string
  name: string
  token0: string
  token1: string
  tvl: number
  volume24h: number
  fees24h: number
  apy: number
  liquidityChange24h: number
  riskScore: number
  concentration: number
  stability: number
}

interface FlowEvent {
  id: string
  type: 'add' | 'remove' | 'swap' | 'bridge'
  pool: string
  amount: number
  timestamp: number
  wallet: string
  impact: number
  isWhale: boolean
}

interface MarketDepth {
  price: number
  liquidity: number
  side: 'buy' | 'sell'
}

export function LiquidityRadar() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>([])
  const [flowEvents, setFlowEvents] = useState<FlowEvent[]>([])
  const [marketDepth, setMarketDepth] = useState<MarketDepth[]>([])
  const [totalTVL, setTotalTVL] = useState(0)
  const [isLive, setIsLive] = useState(true)

  // Mock data untuk demo
  const mockPools: LiquidityPool[] = [
    {
      id: "1",
      name: "SEI/USDC",
      token0: "SEI",
      token1: "USDC",
      tvl: 12500000,
      volume24h: 3200000,
      fees24h: 9600,
      apy: 45.2,
      liquidityChange24h: 8.5,
      riskScore: 25,
      concentration: 67,
      stability: 89
    },
    {
      id: "2",
      name: "SEI/ETH",
      token0: "SEI",
      token1: "ETH",
      tvl: 8900000,
      volume24h: 2100000,
      fees24h: 6300,
      apy: 38.7,
      liquidityChange24h: -12.3,
      riskScore: 45,
      concentration: 78,
      stability: 72
    },
    {
      id: "3",
      name: "ATOM/SEI",
      token0: "ATOM",
      token1: "SEI",
      tvl: 5600000,
      volume24h: 890000,
      fees24h: 2670,
      apy: 28.9,
      liquidityChange24h: 15.7,
      riskScore: 35,
      concentration: 45,
      stability: 85
    }
  ]

  const mockFlowEvents: FlowEvent[] = [
    {
      id: "1",
      type: "remove",
      pool: "SEI/USDC",
      amount: 450000,
      timestamp: Date.now() - 300000,
      wallet: "sei1abc...def",
      impact: 3.2,
      isWhale: true
    },
    {
      id: "2",
      type: "add",
      pool: "SEI/ETH",
      amount: 280000,
      timestamp: Date.now() - 600000,
      wallet: "sei1xyz...789",
      impact: 2.1,
      isWhale: false
    },
    {
      id: "3",
      type: "swap",
      pool: "ATOM/SEI",
      amount: 125000,
      timestamp: Date.now() - 900000,
      wallet: "sei1mno...pqr",
      impact: 1.8,
      isWhale: false
    }
  ]

  const mockMarketDepth: MarketDepth[] = [
    { price: 0.95, liquidity: 125000, side: 'buy' },
    { price: 0.98, liquidity: 89000, side: 'buy' },
    { price: 1.00, liquidity: 156000, side: 'buy' },
    { price: 1.02, liquidity: 134000, side: 'sell' },
    { price: 1.05, liquidity: 98000, side: 'sell' },
    { price: 1.08, liquidity: 76000, side: 'sell' }
  ]

  useEffect(() => {
    setLiquidityPools(mockPools)
    setFlowEvents(mockFlowEvents)
    setMarketDepth(mockMarketDepth)
    setTotalTVL(mockPools.reduce((sum, pool) => sum + pool.tvl, 0))
  }, [])

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-green-600"
    if (score < 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getRiskBg = (score: number) => {
    if (score < 30) return "bg-green-100"
    if (score < 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  const getFlowIcon = (type: string) => {
    switch (type) {
      case 'add': return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'remove': return <ArrowDownRight className="h-4 w-4 text-red-500" />
      case 'swap': return <Activity className="h-4 w-4 text-blue-500" />
      case 'bridge': return <Zap className="h-4 w-4 text-purple-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toFixed(0)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Liquidity Radar</h2>
          <p className="text-muted-foreground">Real-time monitoring aliran likuiditas dan market depth</p>
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
          <Badge variant={isLive ? "default" : "secondary"} className="bg-green-500">
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
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalTVL)}</span>
            </div>
            <p className="text-sm font-medium mt-1">Total TVL</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+5.2% 24h</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-purple-600">$6.2M</span>
            </div>
            <p className="text-sm font-medium mt-1">24h Volume</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-600">-2.1% 24h</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-600">$18.6K</span>
            </div>
            <p className="text-sm font-medium mt-1">24h Fees</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+8.7% 24h</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">Medium</span>
            </div>
            <p className="text-sm font-medium mt-1">Risk Level</p>
            <Progress value={45} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pools">Liquidity Pools</TabsTrigger>
          <TabsTrigger value="flows">Capital Flows</TabsTrigger>
          <TabsTrigger value="depth">Market Depth</TabsTrigger>
          <TabsTrigger value="alerts">Flow Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {liquidityPools.map((pool) => (
              <Card key={pool.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pool.name}</CardTitle>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getRiskBg(pool.riskScore)}`}>
                      <span className={getRiskColor(pool.riskScore)}>Risk: {pool.riskScore}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">TVL</p>
                      <p className="font-semibold">{formatCurrency(pool.tvl)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">24h Volume</p>
                      <p className="font-semibold">{formatCurrency(pool.volume24h)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">APY</p>
                      <p className="font-semibold text-green-600">{pool.apy}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">24h Fees</p>
                      <p className="font-semibold">{formatCurrency(pool.fees24h)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Liquidity Change 24h</span>
                      <span className={pool.liquidityChange24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {pool.liquidityChange24h >= 0 ? '+' : ''}{pool.liquidityChange24h}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.abs(pool.liquidityChange24h)} 
                      className={`h-1 ${pool.liquidityChange24h >= 0 ? 'bg-green-100' : 'bg-red-100'}`} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Concentration</p>
                      <Progress value={pool.concentration} className="h-1 mt-1" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stability</p>
                      <Progress value={pool.stability} className="h-1 mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flows" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Capital Flows
                </CardTitle>
                <CardDescription>Live tracking pergerakan likuiditas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {flowEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFlowIcon(event.type)}
                        <div>
                          <p className="font-medium text-sm">{event.pool}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.wallet} • {formatTimeAgo(event.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(event.amount)}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">Impact: {event.impact}%</span>
                          {event.isWhale && <Badge variant="secondary" className="text-xs">Whale</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flow Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">$2.1M</p>
                      <p className="text-sm text-green-600">Inflows 24h</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">$1.8M</p>
                      <p className="text-sm text-red-600">Outflows 24h</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Net Flow</span>
                        <span className="text-green-600">+$300K</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Whale Activity</span>
                        <span>High</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Flow Volatility</span>
                        <span>Medium</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="depth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Depth Analysis</CardTitle>
              <CardDescription>Visualisasi order book dan liquidity distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Order Book Depth</h4>
                  <div className="space-y-2">
                    {marketDepth.map((depth, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className={`text-sm w-16 ${depth.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                          ${depth.price.toFixed(2)}
                        </span>
                        <div className="flex-1">
                          <Progress 
                            value={(depth.liquidity / 200000) * 100} 
                            className={`h-4 ${depth.side === 'buy' ? 'bg-green-100' : 'bg-red-100'}`}
                          />
                        </div>
                        <span className="text-sm w-20 text-right">{formatCurrency(depth.liquidity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Depth Metrics</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-800">Bid-Ask Spread</p>
                      <p className="text-2xl font-bold text-blue-600">0.02%</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="font-medium text-green-800">Market Impact (1%)</p>
                      <p className="text-2xl font-bold text-green-600">$125K</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="font-medium text-purple-800">Slippage Tolerance</p>
                      <p className="text-2xl font-bold text-purple-600">0.5%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Active Flow Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <p className="font-medium text-red-800">Large Liquidity Removal</p>
                  <p className="text-sm text-red-600">$450K removed from SEI/USDC pool (3.2% impact)</p>
                  <p className="text-xs text-red-500 mt-1">5 minutes ago</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <p className="font-medium text-yellow-800">Unusual Trading Volume</p>
                  <p className="text-sm text-yellow-600">Volume spike 300% above average in SEI/ETH</p>
                  <p className="text-xs text-yellow-500 mt-1">12 minutes ago</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="font-medium text-blue-800">New Large Position</p>
                  <p className="text-sm text-blue-600">Whale added $280K liquidity to SEI/ETH</p>
                  <p className="text-xs text-blue-500 mt-1">18 minutes ago</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Large Flow Threshold</label>
                  <div className="flex items-center gap-2">
                    <Progress value={75} className="flex-1" />
                    <span className="text-sm">$100K</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Impact Threshold</label>
                  <div className="flex items-center gap-2">
                    <Progress value={50} className="flex-1" />
                    <span className="text-sm">2.5%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Volume Spike Alert</label>
                  <div className="flex items-center gap-2">
                    <Progress value={60} className="flex-1" />
                    <span className="text-sm">200%</span>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  Update Alert Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}