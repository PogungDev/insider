'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, DollarSign, BarChart3, Play, RotateCcw, Target } from 'lucide-react';

interface SimulationResult {
  initialInvestment: number;
  finalValue: number;
  totalReturn: number;
  returnPercentage: number;
  maxDrawdown: number;
  sharpeRatio: number;
  volatility: number;
  trades: number;
  winRate: number;
  timeline: { date: string; value: number; }[];
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  volatility: number;
}

export default function SimulatorPage() {
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    initialAmount: 10000,
    timeframe: '1y',
    strategy: 'balanced',
    riskTolerance: 50,
    rebalanceFreq: 'monthly'
  });

  const strategies: Strategy[] = [
    {
      id: 'conservative',
      name: 'Conservative DeFi',
      description: 'Low-risk staking and lending protocols',
      riskLevel: 'low',
      expectedReturn: 8,
      volatility: 15
    },
    {
      id: 'balanced',
      name: 'Balanced Portfolio',
      description: 'Mix of staking, yield farming, and blue-chip tokens',
      riskLevel: 'medium',
      expectedReturn: 15,
      volatility: 25
    },
    {
      id: 'aggressive',
      name: 'High-Yield DeFi',
      description: 'Aggressive yield farming and new protocols',
      riskLevel: 'high',
      expectedReturn: 30,
      volatility: 45
    },
    {
      id: 'whale_copy',
      name: 'Whale Copy Trading',
      description: 'Mirror successful whale wallet strategies',
      riskLevel: 'medium',
      expectedReturn: 22,
      volatility: 35
    }
  ];

  const runSimulation = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const strategy = strategies.find(s => s.id === formData.strategy) || strategies[1];
    const timeMultiplier = formData.timeframe === '3m' ? 0.25 : formData.timeframe === '6m' ? 0.5 : formData.timeframe === '1y' ? 1 : 2;
    
    // Mock simulation calculation
    const annualReturn = strategy.expectedReturn / 100;
    const adjustedReturn = annualReturn * timeMultiplier;
    const volatility = strategy.volatility / 100;
    
    // Generate timeline data
    const days = Math.floor(365 * timeMultiplier);
    const timeline = [];
    let currentValue = formData.initialAmount;
    
    for (let i = 0; i <= days; i += Math.floor(days / 50)) {
      const randomFactor = 1 + (Math.random() - 0.5) * volatility * 0.1;
      const growthFactor = Math.pow(1 + adjustedReturn, i / days);
      currentValue = formData.initialAmount * growthFactor * randomFactor;
      
      timeline.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: currentValue
      });
    }
    
    const finalValue = timeline[timeline.length - 1].value;
    const totalReturn = finalValue - formData.initialAmount;
    const returnPercentage = (totalReturn / formData.initialAmount) * 100;
    
    const result: SimulationResult = {
      initialInvestment: formData.initialAmount,
      finalValue,
      totalReturn,
      returnPercentage,
      maxDrawdown: Math.random() * 20 + 5,
      sharpeRatio: Math.random() * 2 + 0.5,
      volatility: strategy.volatility,
      trades: Math.floor(Math.random() * 100) + 20,
      winRate: Math.random() * 30 + 60,
      timeline
    };
    
    setSimulation(result);
    setLoading(false);
  };

  const resetSimulation = () => {
    setSimulation(null);
    setFormData({
      initialAmount: 10000,
      timeframe: '1y',
      strategy: 'balanced',
      riskTolerance: 50,
      rebalanceFreq: 'monthly'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-purple-600" />
            Investment Simulator
          </h1>
          <p className="text-muted-foreground">Simulate and backtest DeFi investment strategies</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetSimulation}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulation Parameters */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>
            <CardDescription>Configure your investment simulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Initial Investment</Label>
              <Input
                id="amount"
                type="number"
                value={formData.initialAmount}
                onChange={(e) => setFormData({ ...formData, initialAmount: Number(e.target.value) })}
                placeholder="10000"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Investment Strategy</Label>
              <Select value={formData.strategy} onValueChange={(value) => setFormData({ ...formData, strategy: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map((strategy) => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getRiskColor(strategy.riskLevel)} text-white text-xs`}>
                          {strategy.riskLevel}
                        </Badge>
                        <span>{strategy.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.strategy && (
                <p className="text-sm text-muted-foreground">
                  {strategies.find(s => s.id === formData.strategy)?.description}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Time Frame</Label>
              <Select value={formData.timeframe} onValueChange={(value) => setFormData({ ...formData, timeframe: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="2y">2 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Risk Tolerance: {formData.riskTolerance}%</Label>
              <Slider
                value={[formData.riskTolerance]}
                onValueChange={(value) => setFormData({ ...formData, riskTolerance: value[0] })}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Rebalance Frequency</Label>
              <Select value={formData.rebalanceFreq} onValueChange={(value) => setFormData({ ...formData, rebalanceFreq: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={runSimulation} disabled={loading} className="w-full">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Run Simulation
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {simulation ? (
            <>
              {/* Performance Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Final Value</p>
                        <p className="text-2xl font-bold">{formatCurrency(simulation.finalValue)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Return</p>
                        <p className={`text-2xl font-bold ${simulation.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {simulation.returnPercentage >= 0 ? '+' : ''}{simulation.returnPercentage.toFixed(1)}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Sharpe Ratio</p>
                        <p className="text-2xl font-bold">{simulation.sharpeRatio.toFixed(2)}</p>
                      </div>
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Max Drawdown</p>
                        <p className="text-2xl font-bold text-red-600">-{simulation.maxDrawdown.toFixed(1)}%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results */}
              <Tabs defaultValue="performance" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                  <TabsTrigger value="trades">Trade Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="performance">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Chart</CardTitle>
                      <CardDescription>Portfolio value over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center border rounded">
                        <div className="text-center text-muted-foreground">
                          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Interactive chart would be rendered here</p>
                          <p className="text-sm">Showing portfolio growth from {formatCurrency(simulation.initialInvestment)} to {formatCurrency(simulation.finalValue)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="risk">
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Metrics</CardTitle>
                      <CardDescription>Detailed risk analysis of the strategy</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Volatility:</span>
                            <span className="font-semibold">{simulation.volatility}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sharpe Ratio:</span>
                            <span className="font-semibold">{simulation.sharpeRatio.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Max Drawdown:</span>
                            <span className="font-semibold text-red-600">-{simulation.maxDrawdown.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Win Rate:</span>
                            <span className="font-semibold">{simulation.winRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Trades:</span>
                            <span className="font-semibold">{simulation.trades}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Profit Factor:</span>
                            <span className="font-semibold">{(simulation.winRate / (100 - simulation.winRate)).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="trades">
                  <Card>
                    <CardHeader>
                      <CardTitle>Trade Summary</CardTitle>
                      <CardDescription>Breakdown of simulated trades and transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Detailed trade log would be displayed here</p>
                        <p className="text-sm">Including entry/exit points, profit/loss, and timing</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calculator className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Ready to Simulate</h3>
                <p className="text-muted-foreground mb-4">
                  Configure your parameters and run a simulation to see potential outcomes
                </p>
                <Button onClick={runSimulation} disabled={loading}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Simulation
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}