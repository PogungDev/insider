"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, AlertTriangle, TrendingDown, TrendingUp, Search, Zap, DollarSign, Clock, Activity, Target } from 'lucide-react';

interface LiquidityPool {
  id: string;
  protocol: string;
  tokenA: string;
  tokenB: string;
  tvl: number;
  volume24h: number;
  liquidity: number;
  utilization: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: Date;
  metrics: PoolMetrics;
  alerts: LiquidityAlert[];
}

interface PoolMetrics {
  impermanentLoss: number;
  slippage: number;
  depth: number;
  concentration: number;
  volatility: number;
  apy: number;
}

interface LiquidityAlert {
  id: string;
  type: 'drain' | 'manipulation' | 'imbalance' | 'volatility' | 'rug_pull';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface LiquidityEvent {
  id: string;
  poolId: string;
  type: 'add' | 'remove' | 'swap' | 'flash_loan';
  amount: number;
  impact: number;
  timestamp: Date;
  txHash: string;
  suspicious: boolean;
}

const LiquidityScanner: React.FC = () => {
  const [pools, setPools] = useState<LiquidityPool[]>([]);
  const [events, setEvents] = useState<LiquidityEvent[]>([]);
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [filterRisk, setFilterRisk] = useState('all');

  useEffect(() => {
    loadLiquidityData();
  }, []);

  const loadLiquidityData = () => {
    const mockPools: LiquidityPool[] = [
      {
        id: 'pool-1',
        protocol: 'DragonSwap',
        tokenA: 'SEI',
        tokenB: 'USDC',
        tvl: 2500000,
        volume24h: 450000,
        liquidity: 1800000,
        utilization: 72,
        riskScore: 25,
        riskLevel: 'low',
        lastUpdated: new Date(Date.now() - 5 * 60 * 1000),
        metrics: {
          impermanentLoss: 2.3,
          slippage: 0.15,
          depth: 85,
          concentration: 45,
          volatility: 12.5,
          apy: 18.7
        },
        alerts: [
          {
            id: 'alert-1',
            type: 'volatility',
            severity: 'medium',
            message: 'Increased price volatility detected in the last 2 hours',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            resolved: false
          }
        ]
      },
      {
        id: 'pool-2',
        protocol: 'SeiSwap',
        tokenA: 'WSEI',
        tokenB: 'ATOM',
        tvl: 1200000,
        volume24h: 180000,
        liquidity: 950000,
        utilization: 89,
        riskScore: 65,
        riskLevel: 'medium',
        lastUpdated: new Date(Date.now() - 10 * 60 * 1000),
        metrics: {
          impermanentLoss: 5.8,
          slippage: 0.45,
          depth: 62,
          concentration: 78,
          volatility: 28.3,
          apy: 24.2
        },
        alerts: [
          {
            id: 'alert-2',
            type: 'imbalance',
            severity: 'high',
            message: 'Significant pool imbalance detected - 80/20 ratio',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            resolved: false
          },
          {
            id: 'alert-3',
            type: 'manipulation',
            severity: 'medium',
            message: 'Potential price manipulation attempt detected',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            resolved: true
          }
        ]
      },
      {
        id: 'pool-3',
        protocol: 'Unknown DEX',
        tokenA: 'SCAM',
        tokenB: 'SEI',
        tvl: 50000,
        volume24h: 5000,
        liquidity: 25000,
        utilization: 95,
        riskScore: 92,
        riskLevel: 'critical',
        lastUpdated: new Date(Date.now() - 1 * 60 * 1000),
        metrics: {
          impermanentLoss: 45.2,
          slippage: 15.8,
          depth: 15,
          concentration: 95,
          volatility: 89.7,
          apy: 500.0
        },
        alerts: [
          {
            id: 'alert-4',
            type: 'rug_pull',
            severity: 'critical',
            message: 'Potential rug pull detected - liquidity rapidly decreasing',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            resolved: false
          },
          {
            id: 'alert-5',
            type: 'drain',
            severity: 'critical',
            message: 'Large liquidity withdrawal detected',
            timestamp: new Date(Date.now() - 20 * 60 * 1000),
            resolved: false
          }
        ]
      },
      {
        id: 'pool-4',
        protocol: 'AstroPort',
        tokenA: 'SEI',
        tokenB: 'OSMO',
        tvl: 800000,
        volume24h: 120000,
        liquidity: 650000,
        utilization: 55,
        riskScore: 35,
        riskLevel: 'low',
        lastUpdated: new Date(Date.now() - 3 * 60 * 1000),
        metrics: {
          impermanentLoss: 3.1,
          slippage: 0.25,
          depth: 78,
          concentration: 52,
          volatility: 15.8,
          apy: 16.3
        },
        alerts: []
      }
    ];

    const mockEvents: LiquidityEvent[] = [
      {
        id: 'event-1',
        poolId: 'pool-1',
        type: 'remove',
        amount: 150000,
        impact: 8.3,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        txHash: '0x1234567890abcdef1234567890abcdef12345678',
        suspicious: false
      },
      {
        id: 'event-2',
        poolId: 'pool-2',
        type: 'swap',
        amount: 75000,
        impact: 12.5,
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
        suspicious: true
      },
      {
        id: 'event-3',
        poolId: 'pool-3',
        type: 'remove',
        amount: 20000,
        impact: 80.0,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        txHash: '0x9876543210fedcba9876543210fedcba98765432',
        suspicious: true
      },
      {
        id: 'event-4',
        poolId: 'pool-1',
        type: 'add',
        amount: 200000,
        impact: -5.2,
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        txHash: '0x5555666677778888999900001111222233334444',
        suspicious: false
      }
    ];

    setPools(mockPools);
    setEvents(mockEvents);
  };

  const runLiquidityScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 8;
      });
    }, 200);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'drain': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'manipulation': return <Target className="h-4 w-4 text-orange-500" />;
      case 'imbalance': return <Activity className="h-4 w-4 text-yellow-500" />;
      case 'volatility': return <Zap className="h-4 w-4 text-blue-500" />;
      case 'rug_pull': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'add': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'remove': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'swap': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'flash_loan': return <Zap className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredPools = pools.filter(pool => {
    const matchesSearch = pool.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pool.tokenA.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pool.tokenB.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'all' || pool.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Liquidity Scanner</h2>
          <p className="text-muted-foreground">
            Real-time monitoring and analysis of liquidity pools across DeFi protocols
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search pools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runLiquidityScan} disabled={isScanning}>
            <Search className="h-4 w-4 mr-2" />
            {isScanning ? 'Scanning...' : 'Scan'}
          </Button>
        </div>
      </div>

      {/* Scan Progress */}
      {isScanning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Liquidity Scan in Progress</span>
                <span>{scanProgress}% Complete</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Analyzing liquidity pools, detecting anomalies, and assessing risk levels...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="pools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pools">Liquidity Pools</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Pool Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-4">
          <div className="grid gap-4">
            {filteredPools.map((pool) => (
              <Card 
                key={pool.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPool === pool.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedPool(pool.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div>
                        <CardTitle className="text-lg">
                          {pool.tokenA}/{pool.tokenB}
                        </CardTitle>
                        <CardDescription>{pool.protocol}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(pool.riskLevel)}>
                        {pool.riskLevel.toUpperCase()}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{pool.riskScore}</div>
                        <div className="text-xs text-muted-foreground">Risk Score</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">${pool.tvl.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">TVL</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">${pool.volume24h.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">24h Volume</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="font-medium">{pool.utilization}%</div>
                        <div className="text-xs text-muted-foreground">Utilization</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <div>
                        <div className="font-medium">{formatTimestamp(pool.lastUpdated)}</div>
                        <div className="text-xs text-muted-foreground">Last Updated</div>
                      </div>
                    </div>
                  </div>
                  
                  {pool.alerts.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Active Alerts ({pool.alerts.length})</span>
                      </div>
                      <div className="space-y-1">
                        {pool.alerts.slice(0, 2).map((alert) => (
                          <div key={alert.id} className="flex items-center gap-2 text-xs">
                            {getAlertIcon(alert.type)}
                            <span className={alert.resolved ? 'line-through text-muted-foreground' : ''}>
                              {alert.message}
                            </span>
                            <Badge className={getRiskColor(alert.severity)} variant="outline">
                              {alert.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="space-y-4">
            {events.map((event) => {
              const pool = pools.find(p => p.id === event.poolId);
              return (
                <Card key={event.id} className={event.suspicious ? 'border-red-200 bg-red-50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getEventIcon(event.type)}
                        <div>
                          <CardTitle className="text-lg capitalize">
                            {event.type.replace('_', ' ')} Event
                          </CardTitle>
                          <CardDescription>
                            {pool ? `${pool.tokenA}/${pool.tokenB} on ${pool.protocol}` : 'Unknown Pool'}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.suspicious && (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            SUSPICIOUS
                          </Badge>
                        )}
                        <div className="text-right">
                          <div className="text-lg font-bold">${event.amount.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Amount</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <div className="text-sm font-medium">Price Impact</div>
                        <div className={`text-lg font-bold ${
                          event.impact > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {event.impact > 0 ? '+' : ''}{event.impact.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Timestamp</div>
                        <div className="text-sm text-muted-foreground">
                          {formatTimestamp(event.timestamp)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Transaction</div>
                        <div className="text-xs font-mono text-muted-foreground">
                          {event.txHash.slice(0, 10)}...{event.txHash.slice(-8)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Status</div>
                        <div className={`text-sm ${
                          event.suspicious ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {event.suspicious ? 'Flagged' : 'Normal'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {pools.flatMap(pool => 
              pool.alerts.map(alert => ({ ...alert, pool }))
            ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((alert) => (
              <Card key={alert.id} className={alert.resolved ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <CardTitle className="text-lg capitalize">
                          {alert.type.replace('_', ' ')} Alert
                        </CardTitle>
                        <CardDescription>
                          {alert.pool.tokenA}/{alert.pool.tokenB} on {alert.pool.protocol}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      {alert.resolved && (
                        <Badge variant="outline" className="bg-green-50 text-green-800">
                          RESOLVED
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">{alert.message}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Detected {formatTimestamp(alert.timestamp)}</span>
                      <span>Pool Risk Score: {alert.pool.riskScore}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {selectedPool ? (
            (() => {
              const pool = pools.find(p => p.id === selectedPool);
              if (!pool) return null;
              
              return (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pool Analytics - {pool.tokenA}/{pool.tokenB}</CardTitle>
                      <CardDescription>
                        Detailed metrics and performance analysis for {pool.protocol}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Impermanent Loss</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{pool.metrics.impermanentLoss}%</div>
                        <Progress value={pool.metrics.impermanentLoss} max={50} className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Slippage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{pool.metrics.slippage}%</div>
                        <Progress value={pool.metrics.slippage * 20} className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Liquidity Depth</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{pool.metrics.depth}%</div>
                        <Progress value={pool.metrics.depth} className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Concentration Risk</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{pool.metrics.concentration}%</div>
                        <Progress value={pool.metrics.concentration} className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Volatility</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{pool.metrics.volatility}%</div>
                        <Progress value={pool.metrics.volatility} max={100} className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">APY</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{pool.metrics.apy}%</div>
                        <Progress value={pool.metrics.apy} max={50} className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })()
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Droplets className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a pool from the pools tab to view detailed analytics</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiquidityScanner;