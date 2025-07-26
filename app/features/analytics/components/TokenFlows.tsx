"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, Sankey, ScatterChart, Scatter } from "recharts"
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, DollarSign, Repeat, Shuffle, GitBranch, Zap, Target, Eye, Filter } from "lucide-react"

const tokenFlowData = [
  { time: '00:00', inflow: 2400000, outflow: 1800000, netFlow: 600000, volume: 4200000 },
  { time: '04:00', inflow: 3200000, outflow: 2100000, netFlow: 1100000, volume: 5300000 },
  { time: '08:00', inflow: 4800000, outflow: 3600000, netFlow: 1200000, volume: 8400000 },
  { time: '12:00', inflow: 6200000, outflow: 4800000, netFlow: 1400000, volume: 11000000 },
  { time: '16:00', inflow: 5400000, outflow: 4200000, netFlow: 1200000, volume: 9600000 },
  { time: '20:00', inflow: 4100000, outflow: 3200000, netFlow: 900000, volume: 7300000 }
]

const topTokenFlows = [
  {
    token: 'USDC',
    symbol: 'USDC',
    inflow: 45600000,
    outflow: 38200000,
    netFlow: 7400000,
    volume: 83800000,
    change24h: 12.5,
    dominance: 28.4,
    color: '#2563EB'
  },
  {
    token: 'USDT',
    symbol: 'USDT',
    inflow: 38900000,
    outflow: 42100000,
    netFlow: -3200000,
    volume: 81000000,
    change24h: -8.2,
    dominance: 27.5,
    color: '#16A34A'
  },
  {
    token: 'ETH',
    symbol: 'ETH',
    inflow: 28700000,
    outflow: 25400000,
    netFlow: 3300000,
    volume: 54100000,
    change24h: 15.8,
    dominance: 18.3,
    color: '#7C3AED'
  },
  {
    token: 'WBTC',
    symbol: 'WBTC',
    inflow: 15600000,
    outflow: 18200000,
    netFlow: -2600000,
    volume: 33800000,
    change24h: -12.4,
    dominance: 11.5,
    color: '#F59E0B'
  },
  {
    token: 'DAI',
    symbol: 'DAI',
    inflow: 12300000,
    outflow: 9800000,
    netFlow: 2500000,
    volume: 22100000,
    change24h: 8.9,
    dominance: 7.5,
    color: '#EF4444'
  }
]

const protocolFlows = [
  {
    protocol: 'Uniswap V3',
    category: 'DEX',
    inflow: 125000000,
    outflow: 118000000,
    netFlow: 7000000,
    transactions: 45600,
    avgSize: 2740,
    dominance: 32.1
  },
  {
    protocol: 'Aave',
    category: 'Lending',
    inflow: 89000000,
    outflow: 92000000,
    netFlow: -3000000,
    transactions: 12800,
    avgSize: 6950,
    dominance: 23.4
  },
  {
    protocol: 'Compound',
    category: 'Lending',
    inflow: 67000000,
    outflow: 63000000,
    netFlow: 4000000,
    transactions: 8900,
    avgSize: 7530,
    dominance: 16.8
  },
  {
    protocol: 'Curve',
    category: 'DEX',
    inflow: 54000000,
    outflow: 58000000,
    netFlow: -4000000,
    transactions: 23400,
    avgSize: 2310,
    dominance: 14.5
  },
  {
    protocol: 'MakerDAO',
    category: 'CDP',
    inflow: 43000000,
    outflow: 39000000,
    netFlow: 4000000,
    transactions: 5600,
    avgSize: 7680,
    dominance: 10.6
  }
]

const flowPatterns = [
  {
    pattern: 'Arbitrage Flows',
    frequency: 156,
    volume: 23400000,
    profitability: 2.3,
    complexity: 'High',
    impact: 'Medium'
  },
  {
    pattern: 'Yield Farming',
    frequency: 89,
    volume: 45600000,
    profitability: 8.7,
    complexity: 'Medium',
    impact: 'High'
  },
  {
    pattern: 'Liquidation Cascades',
    frequency: 23,
    volume: 12800000,
    profitability: -15.2,
    complexity: 'Low',
    impact: 'Critical'
  },
  {
    pattern: 'Cross-chain Bridges',
    frequency: 67,
    volume: 34500000,
    profitability: 1.8,
    complexity: 'Very High',
    impact: 'Medium'
  },
  {
    pattern: 'Flash Loans',
    frequency: 234,
    volume: 78900000,
    profitability: 0.8,
    complexity: 'High',
    impact: 'Low'
  }
]

const crossChainFlows = [
  { chain: 'Ethereum', inbound: 45600000, outbound: 38200000, net: 7400000 },
  { chain: 'Polygon', inbound: 23400000, outbound: 28900000, net: -5500000 },
  { chain: 'Arbitrum', inbound: 18700000, outbound: 15200000, net: 3500000 },
  { chain: 'Optimism', inbound: 12300000, outbound: 14800000, net: -2500000 },
  { chain: 'BSC', inbound: 8900000, outbound: 11200000, net: -2300000 }
]

export function TokenFlows() {
  const [timeframe, setTimeframe] = useState('24h')
  const [selectedToken, setSelectedToken] = useState('all')
  const [flowType, setFlowType] = useState('overview')
  const [filterBy, setFilterBy] = useState('volume')

  const getFlowColor = (netFlow: number) => {
    return netFlow >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getFlowIcon = (netFlow: number) => {
    return netFlow >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Very High': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Low': return 'bg-blue-100 text-blue-800'
      case 'Medium': return 'bg-purple-100 text-purple-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Token Flow Analysis
        </h1>
        <div className="flex items-center gap-4">
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tokens</SelectItem>
              <SelectItem value="usdc">USDC</SelectItem>
              <SelectItem value="usdt">USDT</SelectItem>
              <SelectItem value="eth">ETH</SelectItem>
              <SelectItem value="wbtc">WBTC</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <GitBranch className="h-3 w-3 mr-1" />
            Flow Tracking
          </Badge>
        </div>
      </div>

      {/* Key Flow Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Inflow</p>
                <p className="text-2xl font-bold text-green-700">$284M</p>
                <p className="text-xs text-green-500">+15% vs yesterday</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Total Outflow</p>
                <p className="text-2xl font-bold text-red-700">$267M</p>
                <p className="text-xs text-red-500">+8% vs yesterday</p>
              </div>
              <ArrowDownLeft className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Net Flow</p>
                <p className="text-2xl font-bold text-blue-700">+$17M</p>
                <p className="text-xs text-blue-500">Positive trend</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Flow Velocity</p>
                <p className="text-2xl font-bold text-purple-700">2.4x</p>
                <p className="text-xs text-purple-500">Above average</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={flowType} onValueChange={setFlowType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tokens">Token Analysis</TabsTrigger>
          <TabsTrigger value="protocols">Protocol Flows</TabsTrigger>
          <TabsTrigger value="patterns">Flow Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-blue-600" />
                  Token Flow Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={tokenFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="inflow" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="outflow" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="h-5 w-5 text-purple-600" />
                  Cross-Chain Flow Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={crossChainFlows}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="chain" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="inbound" fill="#10B981" />
                    <Bar dataKey="outbound" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Net Flow Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tokenFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="netFlow" stroke="#3B82F6" strokeWidth={3} />
                  <Line type="monotone" dataKey="volume" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Top Token Flows
              </CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volume">By Volume</SelectItem>
                    <SelectItem value="netflow">By Net Flow</SelectItem>
                    <SelectItem value="change">By Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTokenFlows.map((token, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: token.color }}
                      >
                        {token.symbol}
                      </div>
                      <div>
                        <p className="font-semibold">{token.token}</p>
                        <p className="text-sm text-gray-500">Dominance: {token.dominance}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Inflow</p>
                        <p className="font-semibold text-green-600">${(token.inflow / 1e6).toFixed(1)}M</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Outflow</p>
                        <p className="font-semibold text-red-600">${(token.outflow / 1e6).toFixed(1)}M</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Net Flow</p>
                        <div className={`flex items-center gap-1 font-semibold ${getFlowColor(token.netFlow)}`}>
                          {getFlowIcon(token.netFlow)}
                          ${Math.abs(token.netFlow / 1e6).toFixed(1)}M
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">24h Change</p>
                        <p className={`font-semibold ${getFlowColor(token.change24h)}`}>
                          {token.change24h > 0 ? '+' : ''}{token.change24h}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="h-5 w-5 text-purple-600" />
                Protocol Flow Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {protocolFlows.map((protocol, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Shuffle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{protocol.protocol}</p>
                        <Badge className="text-xs">{protocol.category}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Volume</p>
                        <p className="font-semibold">${(protocol.inflow / 1e6).toFixed(0)}M</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Net Flow</p>
                        <div className={`flex items-center gap-1 font-semibold ${getFlowColor(protocol.netFlow)}`}>
                          {getFlowIcon(protocol.netFlow)}
                          ${Math.abs(protocol.netFlow / 1e6).toFixed(1)}M
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Transactions</p>
                        <p className="font-semibold">{protocol.transactions.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Avg Size</p>
                        <p className="font-semibold">${protocol.avgSize.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Dominance</p>
                        <div className="flex items-center gap-2">
                          <Progress value={protocol.dominance} className="w-16" />
                          <span className="text-sm">{protocol.dominance}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-orange-600" />
                Flow Pattern Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flowPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{pattern.pattern}</p>
                        <p className="text-sm text-gray-500">Frequency: {pattern.frequency} occurrences</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Volume</p>
                        <p className="font-semibold">${(pattern.volume / 1e6).toFixed(1)}M</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Profitability</p>
                        <p className={`font-semibold ${getFlowColor(pattern.profitability)}`}>
                          {pattern.profitability > 0 ? '+' : ''}{pattern.profitability}%
                        </p>
                      </div>
                      <Badge className={getComplexityColor(pattern.complexity)}>
                        {pattern.complexity}
                      </Badge>
                      <Badge className={getImpactColor(pattern.impact)}>
                        {pattern.impact}
                      </Badge>
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