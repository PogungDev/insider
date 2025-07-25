'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { GitCompare, TrendingUp, Shield, DollarSign, BarChart3, Plus, X } from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  volatility: number;
  minInvestment: number;
  lockupPeriod: string;
  protocols: string[];
  apy: number;
  tvl: number;
  fees: number;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  pros: string[];
  cons: string[];
  historicalPerformance: {
    '1m': number;
    '3m': number;
    '6m': number;
    '1y': number;
  };
}

export default function StrategyComparePage() {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(['conservative', 'balanced']);
  const [timeframe, setTimeframe] = useState('1y');
  const [sortBy, setSortBy] = useState('expectedReturn');
  const [loading, setLoading] = useState(false);

  const strategies: Strategy[] = [
    {
      id: 'conservative',
      name: 'Conservative Staking',
      description: 'Low-risk staking with established validators and blue-chip tokens',
      riskLevel: 'low',
      expectedReturn: 8,
      volatility: 15,
      minInvestment: 100,
      lockupPeriod: 'None',
      protocols: ['Ethereum 2.0', 'Cosmos', 'Polkadot'],
      apy: 7.5,
      tvl: 15000000000,
      fees: 0.1,
      complexity: 'beginner',
      pros: ['Low risk', 'Predictable returns', 'No impermanent loss'],
      cons: ['Lower yields', 'Limited upside potential'],
      historicalPerformance: { '1m': 0.6, '3m': 2.1, '6m': 4.2, '1y': 8.1 }
    },
    {
      id: 'balanced',
      name: 'Balanced DeFi Portfolio',
      description: 'Mix of lending, yield farming, and liquidity provision',
      riskLevel: 'medium',
      expectedReturn: 15,
      volatility: 25,
      minInvestment: 500,
      lockupPeriod: '30 days',
      protocols: ['Aave', 'Compound', 'Uniswap V3', 'Curve'],
      apy: 14.2,
      tvl: 8500000000,
      fees: 0.3,
      complexity: 'intermediate',
      pros: ['Diversified exposure', 'Good risk/reward ratio', 'Flexible strategies'],
      cons: ['Moderate complexity', 'Smart contract risks'],
      historicalPerformance: { '1m': 1.2, '3m': 3.8, '6m': 7.5, '1y': 15.3 }
    },
    {
      id: 'aggressive',
      name: 'High-Yield Farming',
      description: 'Aggressive yield farming with new protocols and high APY opportunities',
      riskLevel: 'high',
      expectedReturn: 35,
      volatility: 50,
      minInvestment: 1000,
      lockupPeriod: '90 days',
      protocols: ['New DeFi protocols', 'Yield aggregators', 'Leveraged farming'],
      apy: 32.8,
      tvl: 2100000000,
      fees: 0.5,
      complexity: 'advanced',
      pros: ['Very high yields', 'Early adopter advantages', 'Compound rewards'],
      cons: ['High risk', 'Impermanent loss', 'Protocol risks'],
      historicalPerformance: { '1m': 2.8, '3m': 8.5, '6m': 18.2, '1y': 35.7 }
    },
    {
      id: 'whale_copy',
      name: 'Whale Copy Trading',
      description: 'Mirror successful whale wallet strategies and positions',
      riskLevel: 'medium',
      expectedReturn: 22,
      volatility: 35,
      minInvestment: 2000,
      lockupPeriod: 'Flexible',
      protocols: ['Multi-protocol', 'Cross-chain', 'Dynamic allocation'],
      apy: 21.5,
      tvl: 5200000000,
      fees: 1.0,
      complexity: 'intermediate',
      pros: ['Proven strategies', 'Professional management', 'Adaptive approach'],
      cons: ['Higher fees', 'Dependency on whale performance'],
      historicalPerformance: { '1m': 1.8, '3m': 5.2, '6m': 11.8, '1y': 22.4 }
    },
    {
      id: 'arbitrage',
      name: 'Cross-Chain Arbitrage',
      description: 'Automated arbitrage opportunities across different chains and DEXs',
      riskLevel: 'medium',
      expectedReturn: 18,
      volatility: 20,
      minInvestment: 5000,
      lockupPeriod: 'None',
      protocols: ['1inch', 'Paraswap', 'Cross-chain bridges'],
      apy: 17.3,
      tvl: 3800000000,
      fees: 0.8,
      complexity: 'advanced',
      pros: ['Market neutral', 'Consistent returns', 'Low correlation'],
      cons: ['High minimum', 'Technical complexity', 'Bridge risks'],
      historicalPerformance: { '1m': 1.4, '3m': 4.1, '6m': 8.9, '1y': 18.1 }
    },
    {
      id: 'nft_yield',
      name: 'NFT Yield Strategies',
      description: 'NFT staking, lending, and fractionalization for yield generation',
      riskLevel: 'high',
      expectedReturn: 28,
      volatility: 60,
      minInvestment: 3000,
      lockupPeriod: '60 days',
      protocols: ['NFTfi', 'JPEG\'d', 'Fractional', 'Sudoswap'],
      apy: 26.9,
      tvl: 890000000,
      fees: 1.5,
      complexity: 'advanced',
      pros: ['Emerging market', 'High potential returns', 'Unique exposure'],
      cons: ['Very high risk', 'Illiquid markets', 'Regulatory uncertainty'],
      historicalPerformance: { '1m': 2.1, '3m': 6.8, '6m': 15.4, '1y': 28.3 }
    }
  ];

  const addStrategy = (strategyId: string) => {
    if (!selectedStrategies.includes(strategyId) && selectedStrategies.length < 4) {
      setSelectedStrategies([...selectedStrategies, strategyId]);
    }
  };

  const removeStrategy = (strategyId: string) => {
    setSelectedStrategies(selectedStrategies.filter(id => id !== strategyId));
  };

  const getSelectedStrategies = () => {
    return strategies.filter(s => selectedStrategies.includes(s.id));
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-blue-500';
      case 'intermediate': return 'bg-purple-500';
      case 'advanced': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTVL = (tvl: number) => {
    if (tvl >= 1000000000) {
      return `$${(tvl / 1000000000).toFixed(1)}B`;
    }
    if (tvl >= 1000000) {
      return `$${(tvl / 1000000).toFixed(1)}M`;
    }
    return formatCurrency(tvl);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <GitCompare className="mr-3 h-8 w-8 text-blue-600" />
            Strategy Comparison
          </h1>
          <p className="text-muted-foreground">Compare different DeFi investment strategies side by side</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Strategy Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Strategies to Compare</CardTitle>
          <CardDescription>Choose up to 4 strategies for detailed comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((strategy) => {
              const isSelected = selectedStrategies.includes(strategy.id);
              return (
                <div
                  key={strategy.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => isSelected ? removeStrategy(strategy.id) : addStrategy(strategy.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{strategy.name}</h4>
                    <div className="flex space-x-1">
                      <Badge className={`${getRiskColor(strategy.riskLevel)} text-white text-xs`}>
                        {strategy.riskLevel}
                      </Badge>
                      {isSelected && <X className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expected APY:</span>
                    <span className="font-semibold text-green-600">{strategy.apy}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selectedStrategies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Strategy Comparison</CardTitle>
            <CardDescription>Detailed comparison of selected strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Metric</TableHead>
                    {getSelectedStrategies().map((strategy) => (
                      <TableHead key={strategy.id} className="text-center min-w-40">
                        <div>
                          <div className="font-semibold">{strategy.name}</div>
                          <div className="flex justify-center space-x-1 mt-1">
                            <Badge className={`${getRiskColor(strategy.riskLevel)} text-white text-xs`}>
                              {strategy.riskLevel}
                            </Badge>
                            <Badge className={`${getComplexityColor(strategy.complexity)} text-white text-xs`}>
                              {strategy.complexity}
                            </Badge>
                          </div>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Expected Return</TableCell>
                    {getSelectedStrategies().map((strategy) => (
                      <TableCell key={strategy.id} className="text-center">
                        <span className="font-semibold text-green-600">{strategy.expectedReturn}%</span>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Current APY</TableCell>
                    {getSelectedStrategies().map((strategy) => (
                      <TableCell key={strategy.id} className="text-center">
                        <span className="font-semibold">{strategy.apy}%</span>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Volatility</TableCell>
                    {getSelectedStrategies().map((strategy) => (
                      <TableCell key={strategy.id} className="text-center">
                        <span className="text-orange-600">{strategy.volatility}%</span>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Min Investment</TableCell>
                    {getSelectedStrategies().map((strategy) => (
                      <TableCell key={strategy.id} className="text-center">
                        {formatCurrency(strategy.minInvestment)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Lockup Period</TableCell>
                    {getSelectedStrategies().map((strategy) => (
                      <TableCell key={strategy.id} className="text-center">
                        {strategy.lockupPeriod}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TVL</TableCell>
                    {getSelectedStrategies().map((strategy) => (
                      <TableCell key={strategy.id} className="text-center">
                        {formatTVL(strategy.tvl)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fees</TableCell>
                    {getSelectedStrategies().map((strategy) => (
                      <TableCell key={strategy.id} className="text-center">
                        {strategy.fees}%
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{timeframe.toUpperCase()} Performance</TableCell>
                    {getSelectedStrategies().map((strategy) => (
                      <TableCell key={strategy.id} className="text-center">
                        <span className="font-semibold text-blue-600">
                          +{strategy.historicalPerformance[timeframe as keyof typeof strategy.historicalPerformance]}%
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis */}
      {selectedStrategies.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {getSelectedStrategies().map((strategy) => (
            <Card key={strategy.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {strategy.name}
                  <div className="flex space-x-1">
                    <Badge className={`${getRiskColor(strategy.riskLevel)} text-white`}>
                      {strategy.riskLevel} risk
                    </Badge>
                    <Badge className={`${getComplexityColor(strategy.complexity)} text-white`}>
                      {strategy.complexity}
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>{strategy.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Advantages</h5>
                  <ul className="text-sm space-y-1">
                    {strategy.pros.map((pro, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Disadvantages</h5>
                  <ul className="text-sm space-y-1">
                    {strategy.cons.map((con, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Key Protocols</h5>
                  <div className="flex flex-wrap gap-1">
                    {strategy.protocols.map((protocol, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {protocol}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedStrategies.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <GitCompare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Select Strategies to Compare</h3>
            <p className="text-muted-foreground">
              Choose strategies from the selection above to see a detailed comparison
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}