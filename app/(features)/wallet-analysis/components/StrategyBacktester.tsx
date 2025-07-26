'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useWallet } from '@/app/(core)/providers/WalletProvider'
import { TrendingUp, TrendingDown, BarChart3, Target, Clock, DollarSign } from 'lucide-react'

interface Strategy {
  id: string
  name: string
  description: string
  type: 'accumulation' | 'momentum' | 'arbitrage' | 'swing'
  riskLevel: 'low' | 'medium' | 'high'
  expectedReturn: number
  maxDrawdown: number
  winRate: number
  avgTradeDuration: string
  totalTrades: number
  sharpeRatio: number
}

interface BacktestResult {
  id: string
  strategyId: string
  strategyName: string
  period: string
  totalReturn: number
  annualizedReturn: number
  maxDrawdown: number
  winRate: number
  profitFactor: number
  sharpeRatio: number
  totalTrades: number
  avgWin: number
  avgLoss: number
  largestWin: number
  largestLoss: number
  consecutiveWins: number
  consecutiveLosses: number
  startDate: string
  endDate: string
  initialCapital: number
  finalCapital: number
}

export function StrategyBacktester() {
  const { targetWallet, analysisData } = useWallet()
  const [isBacktesting, setIsBacktesting] = useState(false)
  const [backtestProgress, setBacktestProgress] = useState(0)
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [results, setResults] = useState<BacktestResult[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('1y')

  useEffect(() => {
    initializeMockData()
  }, [targetWallet, analysisData])

  const initializeMockData = () => {
    const mockStrategies: Strategy[] = [
      {
        id: '1',
        name: 'DCA Strategy',
        description: 'Dollar Cost Averaging with weekly intervals',
        type: 'accumulation',
        riskLevel: 'low',
        expectedReturn: 12.5,
        maxDrawdown: 8.2,
        winRate: 65.4,
        avgTradeDuration: '7 days',
        totalTrades: 52,
        sharpeRatio: 1.8
      },
      {
        id: '2',
        name: 'Momentum Trading',
        description: 'Buy on breakouts, sell on reversals',
        type: 'momentum',
        riskLevel: 'high',
        expectedReturn: 28.7,
        maxDrawdown: 22.1,
        winRate: 58.3,
        avgTradeDuration: '3 days',
        totalTrades: 124,
        sharpeRatio: 1.4
      },
      {
        id: '3',
        name: 'Arbitrage Bot',
        description: 'Cross-exchange arbitrage opportunities',
        type: 'arbitrage',
        riskLevel: 'medium',
        expectedReturn: 18.9,
        maxDrawdown: 5.7,
        winRate: 78.2,
        avgTradeDuration: '2 hours',
        totalTrades: 1456,
        sharpeRatio: 2.3
      },
      {
        id: '4',
        name: 'Swing Trading',
        description: 'Medium-term position trading based on technical analysis',
        type: 'swing',
        riskLevel: 'medium',
        expectedReturn: 22.4,
        maxDrawdown: 15.8,
        winRate: 62.7,
        avgTradeDuration: '12 days',
        totalTrades: 28,
        sharpeRatio: 1.6
      }
    ]

    const mockResults: BacktestResult[] = [
      {
        id: 'result-1',
        strategyId: '1',
        strategyName: 'DCA Strategy',
        period: '1 Year',
        totalReturn: 12.5,
        annualizedReturn: 12.5,
        maxDrawdown: 8.2,
        winRate: 65.4,
        profitFactor: 1.8,
        sharpeRatio: 1.8,
        totalTrades: 52,
        avgWin: 2.4,
        avgLoss: -1.3,
        largestWin: 8.7,
        largestLoss: -4.2,
        consecutiveWins: 7,
        consecutiveLosses: 3,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        initialCapital: 10000,
        finalCapital: 11250
      },
      {
        id: 'result-2',
        strategyId: '2',
        strategyName: 'Momentum Trading',
        period: '1 Year',
        totalReturn: 28.7,
        annualizedReturn: 28.7,
        maxDrawdown: 22.1,
        winRate: 58.3,
        profitFactor: 2.1,
        sharpeRatio: 1.4,
        totalTrades: 124,
        avgWin: 4.8,
        avgLoss: -2.3,
        largestWin: 18.4,
        largestLoss: -12.7,
        consecutiveWins: 9,
        consecutiveLosses: 5,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        initialCapital: 10000,
        finalCapital: 12870
      }
    ]

    setStrategies(mockStrategies)
    setResults(mockResults)
  }

  const handleBacktest = async (strategyId: string) => {
    setIsBacktesting(true)
    setBacktestProgress(0)
    setSelectedStrategy(strategyId)

    // Simulate backtest progress
    const interval = setInterval(() => {
      setBacktestProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBacktesting(false)
          // Add new result
          const strategy = strategies.find(s => s.id === strategyId)
          if (strategy) {
            const newResult: BacktestResult = {
              id: `result-${Date.now()}`,
              strategyId: strategy.id,
              strategyName: strategy.name,
              period: selectedTimeframe,
              totalReturn: strategy.expectedReturn + (Math.random() - 0.5) * 10,
              annualizedReturn: strategy.expectedReturn,
              maxDrawdown: strategy.maxDrawdown,
              winRate: strategy.winRate,
              profitFactor: strategy.sharpeRatio,
              sharpeRatio: strategy.sharpeRatio,
              totalTrades: strategy.totalTrades,
              avgWin: 3.2,
              avgLoss: -1.8,
              largestWin: 15.6,
              largestLoss: -8.9,
              consecutiveWins: 6,
              consecutiveLosses: 4,
              startDate: '2023-01-01',
              endDate: '2023-12-31',
              initialCapital: 10000,
              finalCapital: 10000 * (1 + strategy.expectedReturn / 100)
            }
            setResults(prev => [newResult, ...prev])
          }
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-50 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-50 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-red-50 text-red-800 border-red-200'
      default: return 'bg-gray-50 text-gray-800 border-gray-200'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Strategy Backtester</h2>
          <p className="text-muted-foreground">
            Test and validate trading strategies with historical data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            <BarChart3 className="h-3 w-3 mr-1" />
            Historical Analysis
          </Badge>
        </div>
      </div>

      {/* Backtest Progress */}
      {isBacktesting && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Backtest in Progress</span>
                <span>{backtestProgress}% Complete</span>
              </div>
              <Progress value={backtestProgress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Analyzing historical data and executing strategy logic...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="strategies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <Badge variant="outline" className={getRiskColor(strategy.riskLevel)}>
                      {strategy.riskLevel} risk
                    </Badge>
                  </div>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Expected Return:</span>
                        <span className="font-medium text-green-600 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +{strategy.expectedReturn}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Max Drawdown:</span>
                        <span className="font-medium text-red-600 flex items-center">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          -{strategy.maxDrawdown}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Win Rate:</span>
                        <span className="font-medium">{strategy.winRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Sharpe Ratio:</span>
                        <span className="font-medium">{strategy.sharpeRatio}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Avg Duration:</span>
                        <span className="font-medium flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {strategy.avgTradeDuration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Trades:</span>
                        <span className="font-medium">{strategy.totalTrades}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => handleBacktest(strategy.id)}
                    disabled={isBacktesting}
                  >
                    {isBacktesting && selectedStrategy === strategy.id ? 'Running...' : 'Run Backtest'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{result.strategyName}</CardTitle>
                      <Badge variant="outline">
                        {result.period}
                      </Badge>
                    </div>
                    <CardDescription>
                      Backtest completed from {result.startDate} to {result.endDate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Return</p>
                        <p className={`text-lg font-semibold ${result.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(result.totalReturn)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Max Drawdown</p>
                        <p className="text-lg font-semibold text-red-600">
                          -{result.maxDrawdown}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="text-lg font-semibold">
                          {result.winRate}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                        <p className="text-lg font-semibold">
                          {result.sharpeRatio}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Initial Capital</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(result.initialCapital)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Final Capital</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(result.finalCapital)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Trades</p>
                        <p className="text-lg font-semibold">
                          {result.totalTrades}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Profit Factor</p>
                        <p className="text-lg font-semibold">
                          {result.profitFactor.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Backtest Results</CardTitle>
                <CardDescription>
                  Historical performance analysis for selected strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Run a backtest to see results here</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Comparison</CardTitle>
              <CardDescription>
                Compare multiple strategies side by side
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length >= 2 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Strategy</h4>
                      {results.slice(0, 3).map(result => (
                        <div key={result.id} className="p-2 border rounded">
                          {result.strategyName}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Total Return</h4>
                      {results.slice(0, 3).map(result => (
                        <div key={result.id} className={`p-2 border rounded font-medium ${
                          result.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(result.totalReturn)}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Sharpe Ratio</h4>
                      {results.slice(0, 3).map(result => (
                        <div key={result.id} className="p-2 border rounded font-medium">
                          {result.sharpeRatio}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Run at least 2 backtests to compare strategies</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Optimization</CardTitle>
              <CardDescription>
                Optimize strategy parameters for better performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Parameter optimization coming soon</p>
                <p className="text-sm mt-2">Fine-tune your strategies with genetic algorithms</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default StrategyBacktester
