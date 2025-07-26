"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, TrendingDown, Play, Pause, RotateCcw, Target, DollarSign, Calendar, BarChart3, LineChart, PieChart, Activity, Zap, Brain, AlertTriangle } from "lucide-react"

interface Strategy {
  id: string
  name: string
  type: 'dca' | 'momentum' | 'mean_reversion' | 'arbitrage' | 'yield_farming' | 'custom'
  description: string
  parameters: Record<string, any>
  status: 'draft' | 'backtesting' | 'completed' | 'live'
  createdAt: number
  lastRun?: number
}

interface BacktestResult {
  strategyId: string
  period: string
  initialCapital: number
  finalValue: number
  totalReturn: number
  annualizedReturn: number
  maxDrawdown: number
  sharpeRatio: number
  winRate: number
  totalTrades: number
  avgTradeReturn: number
  volatility: number
  calmarRatio: number
  sortinoRatio: number
  profitFactor: number
}

interface TradeHistory {
  id: string
  timestamp: number
  type: 'buy' | 'sell'
  asset: string
  amount: number
  price: number
  value: number
  pnl?: number
  reason: string
}

interface PerformanceMetric {
  name: string
  value: number
  benchmark?: number
  format: 'percentage' | 'currency' | 'ratio' | 'number'
  description: string
  status: 'good' | 'neutral' | 'bad'
}

export function StrategyBacktester() {
  const [selectedStrategy, setSelectedStrategy] = useState("momentum_1")
  const [selectedPeriod, setSelectedPeriod] = useState("1y")
  const [initialCapital, setInitialCapital] = useState("10000")
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([])
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [isBacktesting, setIsBacktesting] = useState(false)

  // Mock data untuk demo
  const mockStrategies: Strategy[] = [
    {
      id: 'momentum_1',
      name: 'Momentum Breakout Strategy',
      type: 'momentum',
      description: 'Buy on breakout above 20-day high, sell on breakdown below 10-day low',
      parameters: {
        lookbackPeriod: 20,
        stopLoss: 0.05,
        takeProfit: 0.15,
        rsiThreshold: 70,
        volumeMultiplier: 1.5
      },
      status: 'completed',
      createdAt: Date.now() - 86400000,
      lastRun: Date.now() - 3600000
    },
    {
      id: 'dca_1',
      name: 'Smart DCA Strategy',
      type: 'dca',
      description: 'Dollar-cost averaging with volatility-based adjustments',
      parameters: {
        baseAmount: 100,
        frequency: 'weekly',
        volatilityMultiplier: 1.2,
        maxAmount: 500,
        minAmount: 50
      },
      status: 'completed',
      createdAt: Date.now() - 172800000,
      lastRun: Date.now() - 7200000
    },
    {
      id: 'mean_reversion_1',
      name: 'Mean Reversion RSI',
      type: 'mean_reversion',
      description: 'Buy oversold conditions, sell overbought conditions',
      parameters: {
        rsiPeriod: 14,
        oversoldLevel: 30,
        overboughtLevel: 70,
        holdingPeriod: 5,
        positionSize: 0.1
      },
      status: 'completed',
      createdAt: Date.now() - 259200000,
      lastRun: Date.now() - 10800000
    },
    {
      id: 'arbitrage_1',
      name: 'Cross-Exchange Arbitrage',
      type: 'arbitrage',
      description: 'Exploit price differences between exchanges',
      parameters: {
        minSpread: 0.005,
        maxSlippage: 0.002,
        exchanges: ['binance', 'coinbase', 'kraken'],
        assets: ['BTC', 'ETH', 'SEI']
      },
      status: 'draft',
      createdAt: Date.now() - 345600000
    }
  ]

  const mockBacktestResults: BacktestResult[] = [
    {
      strategyId: 'momentum_1',
      period: '1y',
      initialCapital: 10000,
      finalValue: 14250,
      totalReturn: 42.5,
      annualizedReturn: 38.7,
      maxDrawdown: -18.3,
      sharpeRatio: 1.85,
      winRate: 67.2,
      totalTrades: 156,
      avgTradeReturn: 2.8,
      volatility: 24.5,
      calmarRatio: 2.11,
      sortinoRatio: 2.34,
      profitFactor: 1.92
    },
    {
      strategyId: 'dca_1',
      period: '1y',
      initialCapital: 10000,
      finalValue: 12180,
      totalReturn: 21.8,
      annualizedReturn: 19.5,
      maxDrawdown: -8.7,
      sharpeRatio: 1.42,
      winRate: 78.5,
      totalTrades: 52,
      avgTradeReturn: 4.2,
      volatility: 15.2,
      calmarRatio: 2.24,
      sortinoRatio: 1.89,
      profitFactor: 2.15
    },
    {
      strategyId: 'mean_reversion_1',
      period: '1y',
      initialCapital: 10000,
      finalValue: 11650,
      totalReturn: 16.5,
      annualizedReturn: 15.2,
      maxDrawdown: -12.4,
      sharpeRatio: 1.28,
      winRate: 72.8,
      totalTrades: 89,
      avgTradeReturn: 1.9,
      volatility: 18.7,
      calmarRatio: 1.23,
      sortinoRatio: 1.67,
      profitFactor: 1.78
    }
  ]

  const mockTradeHistory: TradeHistory[] = [
    {
      id: '1',
      timestamp: Date.now() - 86400000,
      type: 'buy',
      asset: 'SEI',
      amount: 1000,
      price: 0.45,
      value: 450,
      reason: 'Momentum breakout signal'
    },
    {
      id: '2',
      timestamp: Date.now() - 172800000,
      type: 'sell',
      asset: 'SEI',
      amount: 800,
      price: 0.52,
      value: 416,
      pnl: 56,
      reason: 'Take profit target reached'
    },
    {
      id: '3',
      timestamp: Date.now() - 259200000,
      type: 'buy',
      asset: 'ATOM',
      amount: 50,
      price: 8.20,
      value: 410,
      reason: 'RSI oversold condition'
    },
    {
      id: '4',
      timestamp: Date.now() - 345600000,
      type: 'sell',
      asset: 'ATOM',
      amount: 50,
      price: 7.85,
      value: 392.5,
      pnl: -17.5,
      reason: 'Stop loss triggered'
    }
  ]

  const mockPerformanceMetrics: PerformanceMetric[] = [
    {
      name: 'Total Return',
      value: 42.5,
      benchmark: 28.3,
      format: 'percentage',
      description: 'Total portfolio return over the period',
      status: 'good'
    },
    {
      name: 'Sharpe Ratio',
      value: 1.85,
      benchmark: 1.2,
      format: 'ratio',
      description: 'Risk-adjusted return measure',
      status: 'good'
    },
    {
      name: 'Max Drawdown',
      value: -18.3,
      benchmark: -25.0,
      format: 'percentage',
      description: 'Maximum peak-to-trough decline',
      status: 'good'
    },
    {
      name: 'Win Rate',
      value: 67.2,
      benchmark: 55.0,
      format: 'percentage',
      description: 'Percentage of profitable trades',
      status: 'good'
    },
    {
      name: 'Volatility',
      value: 24.5,
      benchmark: 32.1,
      format: 'percentage',
      description: 'Annualized standard deviation of returns',
      status: 'good'
    },
    {
      name: 'Profit Factor',
      value: 1.92,
      benchmark: 1.5,
      format: 'ratio',
      description: 'Ratio of gross profit to gross loss',
      status: 'good'
    }
  ]

  useEffect(() => {
    setStrategies(mockStrategies)
    setBacktestResults(mockBacktestResults)
    setTradeHistory(mockTradeHistory)
    setPerformanceMetrics(mockPerformanceMetrics)
  }, [])

  const getStrategyTypeIcon = (type: string) => {
    switch (type) {
      case 'momentum': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'dca': return <Calendar className="h-4 w-4 text-blue-500" />
      case 'mean_reversion': return <BarChart3 className="h-4 w-4 text-purple-500" />
      case 'arbitrage': return <Zap className="h-4 w-4 text-yellow-500" />
      case 'yield_farming': return <Target className="h-4 w-4 text-orange-500" />
      case 'custom': return <Brain className="h-4 w-4 text-gray-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'backtesting': return 'bg-blue-100 text-blue-800'
      case 'live': return 'bg-purple-100 text-purple-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'neutral': return 'text-yellow-600'
      case 'bad': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'percentage': return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
      case 'currency': return `$${value.toLocaleString()}`
      case 'ratio': return value.toFixed(2)
      case 'number': return value.toLocaleString()
      default: return value.toString()
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const hours = Math.floor((Date.now() - timestamp) / 3600000)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const runBacktest = () => {
    setIsBacktesting(true)
    setTimeout(() => {
      setIsBacktesting(false)
    }, 4000)
  }

  const selectedStrategyData = strategies.find(s => s.id === selectedStrategy)
  const selectedResult = backtestResults.find(r => r.strategyId === selectedStrategy)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Strategy Backtester</h2>
          <p className="text-muted-foreground">Test dan optimasi strategi trading dengan data historis</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {strategies.map((strategy) => (
                <SelectItem key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={runBacktest} disabled={isBacktesting}>
            {isBacktesting ? 'Running...' : 'Run Backtest'}
          </Button>
        </div>
      </div>

      {/* Backtest Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Backtest Configuration</CardTitle>
          <CardDescription>Configure parameters for strategy backtesting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Time Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="2y">2 Years</SelectItem>
                  <SelectItem value="5y">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capital">Initial Capital</Label>
              <Input
                id="capital"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                placeholder="10000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="benchmark">Benchmark</Label>
              <Select defaultValue="btc">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                  <SelectItem value="sp500">S&P 500</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fees">Trading Fees (%)</Label>
              <Input
                id="fees"
                defaultValue="0.1"
                placeholder="0.1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Overview */}
      {selectedStrategyData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStrategyTypeIcon(selectedStrategyData.type)}
                <div>
                  <CardTitle>{selectedStrategyData.name}</CardTitle>
                  <CardDescription>{selectedStrategyData.description}</CardDescription>
                </div>
              </div>
              <Badge className={getStatusColor(selectedStrategyData.status)}>
                {selectedStrategyData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Strategy Type</p>
                <p className="font-semibold capitalize">{selectedStrategyData.type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-semibold">{formatTimeAgo(selectedStrategyData.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Run</p>
                <p className="font-semibold">{selectedStrategyData.lastRun ? formatTimeAgo(selectedStrategyData.lastRun) : 'Never'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Parameters</p>
                <p className="font-semibold">{Object.keys(selectedStrategyData.parameters).length} configured</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="results" className="space-y-4">
        <TabsList>
          <TabsTrigger value="results">Backtest Results</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="trades">Trade History</TabsTrigger>
          <TabsTrigger value="strategies">All Strategies</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {selectedResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold text-green-600">
                      {formatValue(selectedResult.totalReturn, 'percentage')}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1">Total Return</p>
                  <p className="text-xs text-muted-foreground">
                    ${selectedResult.initialCapital.toLocaleString()} → ${selectedResult.finalValue.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    <span className="text-2xl font-bold text-blue-600">
                      {selectedResult.sharpeRatio.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1">Sharpe Ratio</p>
                  <p className="text-xs text-muted-foreground">
                    Risk-adjusted return
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-2xl font-bold text-red-600">
                      {formatValue(selectedResult.maxDrawdown, 'percentage')}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1">Max Drawdown</p>
                  <p className="text-xs text-muted-foreground">
                    Largest peak-to-trough decline
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span className="text-2xl font-bold text-purple-600">
                      {formatValue(selectedResult.winRate, 'percentage')}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1">Win Rate</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedResult.totalTrades} total trades
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedResult && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Annualized Return</p>
                    <p className="font-semibold text-green-600">{formatValue(selectedResult.annualizedReturn, 'percentage')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Volatility</p>
                    <p className="font-semibold">{formatValue(selectedResult.volatility, 'percentage')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Calmar Ratio</p>
                    <p className="font-semibold">{selectedResult.calmarRatio.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sortino Ratio</p>
                    <p className="font-semibold">{selectedResult.sortinoRatio.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profit Factor</p>
                    <p className="font-semibold">{selectedResult.profitFactor.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Trade Return</p>
                    <p className="font-semibold">{formatValue(selectedResult.avgTradeReturn, 'percentage')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Trades</p>
                    <p className="font-semibold">{selectedResult.totalTrades}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Final Value</p>
                    <p className="font-semibold">{formatValue(selectedResult.finalValue, 'currency')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{metric.name}</h3>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                        {formatValue(metric.value, metric.format)}
                      </div>
                      {metric.benchmark && (
                        <div className="text-sm text-muted-foreground">
                          vs {formatValue(metric.benchmark, metric.format)}
                        </div>
                      )}
                    </div>
                  </div>
                  {metric.benchmark && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>vs Benchmark</span>
                        <span className={getMetricStatusColor(metric.status)}>
                          {metric.value > metric.benchmark ? 'Outperforming' : 'Underperforming'}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(100, (metric.value / metric.benchmark) * 50)} 
                        className="h-2" 
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <div className="space-y-3">
            {tradeHistory.map((trade) => (
              <Card key={trade.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {trade.type === 'buy' ? 
                        <TrendingUp className="h-4 w-4 text-green-500" /> : 
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      }
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                            {trade.type.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{trade.asset}</span>
                          <span className="text-sm text-muted-foreground">
                            {trade.amount} @ ${trade.price.toFixed(4)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{trade.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${trade.value.toFixed(2)}</div>
                      {trade.pnl !== undefined && (
                        <div className={`text-sm ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          P&L: {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(trade.timestamp)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedStrategy(strategy.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStrategyTypeIcon(strategy.type)}
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(strategy.status)}>
                      {strategy.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-semibold capitalize">{strategy.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Parameters</p>
                      <p className="font-semibold">{Object.keys(strategy.parameters).length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-semibold">{formatTimeAgo(strategy.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Run</p>
                      <p className="font-semibold">{strategy.lastRun ? formatTimeAgo(strategy.lastRun) : 'Never'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Clone
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}