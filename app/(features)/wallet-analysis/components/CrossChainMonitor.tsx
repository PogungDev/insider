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
import { Network, ArrowRightLeft, TrendingUp, TrendingDown, Search, Clock, DollarSign, Activity, Zap, AlertTriangle, Globe, Link } from 'lucide-react';
import { useWallet } from '@/app/(core)/providers/WalletProvider';

interface CrossChainTransfer {
  id: string;
  fromChain: string;
  toChain: string;
  token: string;
  amount: number;
  value: number;
  fromAddress: string;
  toAddress: string;
  bridgeProtocol: string;
  status: 'pending' | 'completed' | 'failed' | 'stuck';
  timestamp: Date;
  txHashFrom: string;
  txHashTo?: string;
  confirmations: number;
  requiredConfirmations: number;
  fees: number;
  estimatedTime: number;
  actualTime?: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: TransferFlag[];
}

interface TransferFlag {
  type: 'large_amount' | 'suspicious_address' | 'new_bridge' | 'high_slippage' | 'unusual_route';
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

interface ChainMetrics {
  chainId: string;
  name: string;
  symbol: string;
  totalVolume24h: number;
  totalTransfers24h: number;
  avgTransferValue: number;
  bridgeCount: number;
  healthScore: number;
  congestionLevel: number;
  avgFees: number;
  avgTime: number;
  uptime: number;
  lastBlock: number;
  blockTime: number;
}

interface BridgeProtocol {
  id: string;
  name: string;
  supportedChains: string[];
  volume24h: number;
  transfers24h: number;
  avgFees: number;
  avgTime: number;
  successRate: number;
  securityScore: number;
  liquidityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastIncident?: Date;
}

interface FlowPattern {
  id: string;
  pattern: 'arbitrage' | 'migration' | 'farming' | 'wash_trading' | 'bridge_exploit';
  fromChain: string;
  toChain: string;
  token: string;
  volume: number;
  frequency: number;
  confidence: number;
  timeframe: string;
  participants: number;
  avgAmount: number;
  riskScore: number;
}

const CrossChainMonitor: React.FC = () => {
  const { targetWallet, analysisData } = useWallet();
  const [transfers, setTransfers] = useState<CrossChainTransfer[]>([]);
  const [chainMetrics, setChainMetrics] = useState<ChainMetrics[]>([]);
  const [bridgeProtocols, setBridgeProtocols] = useState<BridgeProtocol[]>([]);
  const [flowPatterns, setFlowPatterns] = useState<FlowPattern[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChain, setFilterChain] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringProgress, setMonitoringProgress] = useState(0);

  useEffect(() => {
    loadCrossChainData();
  }, [targetWallet, analysisData]);

  const loadCrossChainData = () => {
    let mockTransfers: CrossChainTransfer[] = [
      {
        id: 'transfer-1',
        fromChain: 'Ethereum',
        toChain: 'Sei',
        token: 'USDC',
        amount: 50000,
        value: 50000,
        fromAddress: '0x1234567890abcdef1234567890abcdef12345678',
        toAddress: 'sei1abcdef1234567890abcdef1234567890abcdef',
        bridgeProtocol: 'LayerZero',
        status: 'completed',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        txHashFrom: '0x1111222233334444555566667777888899990000',
        txHashTo: '0x0000999988887777666655554444333322221111',
        confirmations: 65,
        requiredConfirmations: 65,
        fees: 25.50,
        estimatedTime: 15,
        actualTime: 12,
        riskLevel: 'low',
        flags: []
      },
      {
        id: 'transfer-2',
        fromChain: 'Sei',
        toChain: 'Cosmos',
        token: 'ATOM',
        amount: 1000,
        value: 8500,
        fromAddress: 'sei1234567890abcdef1234567890abcdef12345678',
        toAddress: 'cosmos1abcdef1234567890abcdef1234567890abcdef',
        bridgeProtocol: 'IBC',
        status: 'pending',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        txHashFrom: '0x2222333344445555666677778888999900001111',
        confirmations: 45,
        requiredConfirmations: 65,
        fees: 0.25,
        estimatedTime: 5,
        riskLevel: 'low',
        flags: []
      },
      {
        id: 'transfer-3',
        fromChain: 'BSC',
        toChain: 'Sei',
        token: 'BNB',
        amount: 100,
        value: 25000,
        fromAddress: '0x9876543210fedcba9876543210fedcba98765432',
        toAddress: 'sei1fedcba9876543210fedcba9876543210fedcba',
        bridgeProtocol: 'Multichain',
        status: 'stuck',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        txHashFrom: '0x3333444455556666777788889999000011112222',
        confirmations: 20,
        requiredConfirmations: 65,
        fees: 15.75,
        estimatedTime: 20,
        riskLevel: 'high',
        flags: [
          {
            type: 'large_amount',
            severity: 'warning',
            message: 'Transfer amount exceeds typical threshold'
          },
          {
            type: 'suspicious_address',
            severity: 'critical',
            message: 'Destination address flagged in previous incidents'
          }
        ]
      },
      {
        id: 'transfer-4',
        fromChain: 'Polygon',
        toChain: 'Sei',
        token: 'MATIC',
        amount: 10000,
        value: 7500,
        fromAddress: '0x5555666677778888999900001111222233334444',
        toAddress: 'sei1555566667777888899990000111122223333',
        bridgeProtocol: 'Wormhole',
        status: 'failed',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        txHashFrom: '0x4444555566667777888899990000111122223333',
        confirmations: 0,
        requiredConfirmations: 65,
        fees: 8.25,
        estimatedTime: 10,
        riskLevel: 'medium',
        flags: [
          {
            type: 'high_slippage',
            severity: 'warning',
            message: 'High slippage detected during bridge operation'
          }
        ]
      }
    ];

    // Add wallet-specific cross-chain transfers if targetWallet is available
    if (targetWallet && analysisData) {
      const walletTransfer: CrossChainTransfer = {
        id: `wallet-transfer-${targetWallet.slice(-8)}`,
        fromChain: 'Sei',
        toChain: 'Ethereum',
        token: 'SEI',
        amount: (analysisData.totalValue || 100000) * 0.2,
        value: (analysisData.totalValue || 100000) * 0.2,
        fromAddress: targetWallet,
        toAddress: `0x${targetWallet.slice(4)}`,
        bridgeProtocol: 'LayerZero',
        status: analysisData.riskScore > 70 ? 'completed' : 'pending',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        txHashFrom: `0x${targetWallet.slice(-16)}${'0'.repeat(48)}`,
        txHashTo: analysisData.riskScore > 70 ? `0x${'1'.repeat(64)}` : undefined,
        confirmations: analysisData.riskScore > 70 ? 65 : 35,
        requiredConfirmations: 65,
        fees: 12.75,
        estimatedTime: 10,
        actualTime: analysisData.riskScore > 70 ? 8 : undefined,
        riskLevel: analysisData.riskScore > 80 ? 'low' : analysisData.riskScore > 60 ? 'medium' : 'high',
        flags: analysisData.riskScore < 60 ? [
          {
            type: 'suspicious_address',
            severity: 'warning',
            message: 'Wallet flagged for unusual activity patterns'
          }
        ] : []
      };
      mockTransfers.unshift(walletTransfer);
    }

    const mockChainMetrics: ChainMetrics[] = [
      {
        chainId: 'sei-1',
        name: 'Sei Network',
        symbol: 'SEI',
        totalVolume24h: 2500000,
        totalTransfers24h: 1250,
        avgTransferValue: 2000,
        bridgeCount: 8,
        healthScore: 95,
        congestionLevel: 15,
        avgFees: 0.05,
        avgTime: 3,
        uptime: 99.8,
        lastBlock: 12845672,
        blockTime: 0.4
      },
      {
        chainId: 'ethereum-1',
        name: 'Ethereum',
        symbol: 'ETH',
        totalVolume24h: 45000000,
        totalTransfers24h: 8500,
        avgTransferValue: 5294,
        bridgeCount: 25,
        healthScore: 88,
        congestionLevel: 75,
        avgFees: 25.50,
        avgTime: 15,
        uptime: 99.9,
        lastBlock: 18945123,
        blockTime: 12
      },
      {
        chainId: 'cosmos-1',
        name: 'Cosmos Hub',
        symbol: 'ATOM',
        totalVolume24h: 1800000,
        totalTransfers24h: 950,
        avgTransferValue: 1895,
        bridgeCount: 12,
        healthScore: 92,
        congestionLevel: 25,
        avgFees: 0.25,
        avgTime: 5,
        uptime: 99.7,
        lastBlock: 17234567,
        blockTime: 6
      },
      {
        chainId: 'bsc-1',
        name: 'BNB Smart Chain',
        symbol: 'BNB',
        totalVolume24h: 12000000,
        totalTransfers24h: 3200,
        avgTransferValue: 3750,
        bridgeCount: 18,
        healthScore: 85,
        congestionLevel: 45,
        avgFees: 2.50,
        avgTime: 8,
        uptime: 99.5,
        lastBlock: 34567890,
        blockTime: 3
      }
    ];

    const mockBridgeProtocols: BridgeProtocol[] = [
      {
        id: 'layerzero',
        name: 'LayerZero',
        supportedChains: ['Ethereum', 'Sei', 'BSC', 'Polygon', 'Arbitrum'],
        volume24h: 15000000,
        transfers24h: 2500,
        avgFees: 18.75,
        avgTime: 12,
        successRate: 98.5,
        securityScore: 92,
        liquidityScore: 88,
        riskLevel: 'low'
      },
      {
        id: 'ibc',
        name: 'IBC Protocol',
        supportedChains: ['Sei', 'Cosmos', 'Osmosis', 'Juno', 'Secret'],
        volume24h: 3500000,
        transfers24h: 1800,
        avgFees: 0.15,
        avgTime: 4,
        successRate: 99.2,
        securityScore: 95,
        liquidityScore: 85,
        riskLevel: 'low'
      },
      {
        id: 'wormhole',
        name: 'Wormhole',
        supportedChains: ['Ethereum', 'Sei', 'Solana', 'BSC', 'Polygon'],
        volume24h: 8500000,
        transfers24h: 1200,
        avgFees: 12.50,
        avgTime: 8,
        successRate: 96.8,
        securityScore: 85,
        liquidityScore: 90,
        riskLevel: 'medium'
      },
      {
        id: 'multichain',
        name: 'Multichain',
        supportedChains: ['Ethereum', 'BSC', 'Polygon', 'Fantom', 'Avalanche'],
        volume24h: 5200000,
        transfers24h: 850,
        avgFees: 15.25,
        avgTime: 18,
        successRate: 94.2,
        securityScore: 78,
        liquidityScore: 82,
        riskLevel: 'high',
        lastIncident: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockFlowPatterns: FlowPattern[] = [
      {
        id: 'pattern-1',
        pattern: 'arbitrage',
        fromChain: 'Ethereum',
        toChain: 'Sei',
        token: 'USDC',
        volume: 2500000,
        frequency: 45,
        confidence: 92,
        timeframe: '24h',
        participants: 12,
        avgAmount: 55556,
        riskScore: 15
      },
      {
        id: 'pattern-2',
        pattern: 'migration',
        fromChain: 'BSC',
        toChain: 'Sei',
        token: 'BNB',
        volume: 1200000,
        frequency: 28,
        confidence: 85,
        timeframe: '12h',
        participants: 8,
        avgAmount: 42857,
        riskScore: 25
      },
      {
        id: 'pattern-3',
        pattern: 'wash_trading',
        fromChain: 'Polygon',
        toChain: 'Ethereum',
        token: 'MATIC',
        volume: 450000,
        frequency: 120,
        confidence: 78,
        timeframe: '6h',
        participants: 3,
        avgAmount: 3750,
        riskScore: 85
      }
    ];

    setTransfers(mockTransfers);
    setChainMetrics(mockChainMetrics);
    setBridgeProtocols(mockBridgeProtocols);
    setFlowPatterns(mockFlowPatterns);
  };

  const runCrossChainMonitoring = () => {
    setIsMonitoring(true);
    setMonitoringProgress(0);
    
    const interval = setInterval(() => {
      setMonitoringProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsMonitoring(false);
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'stuck': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

  const getFlagIcon = (type: string) => {
    switch (type) {
      case 'large_amount': return <DollarSign className="h-4 w-4 text-orange-500" />;
      case 'suspicious_address': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'new_bridge': return <Network className="h-4 w-4 text-blue-500" />;
      case 'high_slippage': return <TrendingDown className="h-4 w-4 text-yellow-500" />;
      case 'unusual_route': return <ArrowRightLeft className="h-4 w-4 text-purple-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'arbitrage': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'migration': return <ArrowRightLeft className="h-4 w-4 text-blue-500" />;
      case 'farming': return <Activity className="h-4 w-4 text-purple-500" />;
      case 'wash_trading': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'bridge_exploit': return <Zap className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transfer.fromChain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transfer.toChain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transfer.bridgeProtocol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChain = filterChain === 'all' || 
                        transfer.fromChain.toLowerCase() === filterChain.toLowerCase() ||
                        transfer.toChain.toLowerCase() === filterChain.toLowerCase();
    const matchesStatus = filterStatus === 'all' || transfer.status === filterStatus;
    return matchesSearch && matchesChain && matchesStatus;
  });

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cross-Chain Monitor</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of cross-chain transfers and bridge activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search transfers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Select value={filterChain} onValueChange={setFilterChain}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chains</SelectItem>
              <SelectItem value="sei">Sei</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="cosmos">Cosmos</SelectItem>
              <SelectItem value="bsc">BSC</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="stuck">Stuck</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runCrossChainMonitoring} disabled={isMonitoring}>
            <Search className="h-4 w-4 mr-2" />
            {isMonitoring ? 'Monitoring...' : 'Monitor'}
          </Button>
        </div>
      </div>

      {/* Monitoring Progress */}
      {isMonitoring && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Cross-Chain Monitoring in Progress</span>
                <span>{monitoringProgress}% Complete</span>
              </div>
              <Progress value={monitoringProgress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Scanning bridge protocols, analyzing transfer patterns, and detecting anomalies...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="transfers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transfers">Recent Transfers</TabsTrigger>
          <TabsTrigger value="chains">Chain Metrics</TabsTrigger>
          <TabsTrigger value="bridges">Bridge Protocols</TabsTrigger>
          <TabsTrigger value="patterns">Flow Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="transfers" className="space-y-4">
          <div className="space-y-4">
            {filteredTransfers.map((transfer) => (
              <Card 
                key={transfer.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTransfer === transfer.id ? 'ring-2 ring-blue-500' : ''
                } ${transfer.status === 'failed' || transfer.status === 'stuck' ? 'border-red-200 bg-red-50' : ''}`}
                onClick={() => setSelectedTransfer(transfer.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ArrowRightLeft className="h-5 w-5 text-blue-500" />
                      <div>
                        <CardTitle className="text-lg">
                          {transfer.amount.toLocaleString()} {transfer.token}
                        </CardTitle>
                        <CardDescription>
                          {transfer.fromChain} → {transfer.toChain} via {transfer.bridgeProtocol}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(transfer.status)}>
                        {transfer.status.toUpperCase()}
                      </Badge>
                      <Badge className={getRiskColor(transfer.riskLevel)}>
                        {transfer.riskLevel.toUpperCase()}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${transfer.value.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Value</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <Network className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="font-medium">{formatAddress(transfer.fromAddress)}</div>
                        <div className="text-xs text-muted-foreground">From Address</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Network className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">{formatAddress(transfer.toAddress)}</div>
                        <div className="text-xs text-muted-foreground">To Address</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <div>
                        <div className="font-medium">
                          {transfer.actualTime ? `${transfer.actualTime}m` : `~${transfer.estimatedTime}m`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transfer.actualTime ? 'Actual Time' : 'Est. Time'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">${transfer.fees.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Fees</div>
                      </div>
                    </div>
                  </div>
                  
                  {transfer.status === 'pending' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Confirmations</span>
                        <span>{transfer.confirmations}/{transfer.requiredConfirmations}</span>
                      </div>
                      <Progress 
                        value={(transfer.confirmations / transfer.requiredConfirmations) * 100} 
                        className="h-2" 
                      />
                    </div>
                  )}
                  
                  {transfer.flags.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Flags ({transfer.flags.length})</span>
                      </div>
                      <div className="space-y-1">
                        {transfer.flags.map((flag, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            {getFlagIcon(flag.type)}
                            <span>{flag.message}</span>
                            <Badge className={getRiskColor(flag.severity)} variant="outline">
                              {flag.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatTimestamp(transfer.timestamp)}</span>
                    <span>TX: {transfer.txHashFrom.slice(0, 10)}...{transfer.txHashFrom.slice(-8)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chains" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {chainMetrics.map((chain) => (
              <Card key={chain.chainId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-blue-500" />
                      <div>
                        <CardTitle className="text-lg">{chain.name}</CardTitle>
                        <CardDescription>{chain.symbol}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{chain.healthScore}</div>
                      <div className="text-xs text-muted-foreground">Health Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium">24h Volume</div>
                      <div className="text-lg font-bold">${chain.totalVolume24h.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">24h Transfers</div>
                      <div className="text-lg font-bold">{chain.totalTransfers24h.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Avg Transfer</div>
                      <div className="text-lg font-bold">${chain.avgTransferValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Bridge Count</div>
                      <div className="text-lg font-bold">{chain.bridgeCount}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Avg Fees</div>
                      <div className="text-lg font-bold">${chain.avgFees.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Avg Time</div>
                      <div className="text-lg font-bold">{chain.avgTime}m</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Congestion Level</span>
                      <span>{chain.congestionLevel}%</span>
                    </div>
                    <Progress value={chain.congestionLevel} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Uptime</span>
                      <span>{chain.uptime}%</span>
                    </div>
                    <Progress value={chain.uptime} className="h-2" />
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Block #{chain.lastBlock.toLocaleString()}</span>
                    <span>{chain.blockTime}s block time</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bridges" className="space-y-4">
          <div className="space-y-4">
            {bridgeProtocols.map((bridge) => (
              <Card key={bridge.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Link className="h-5 w-5 text-purple-500" />
                      <div>
                        <CardTitle className="text-lg">{bridge.name}</CardTitle>
                        <CardDescription>
                          {bridge.supportedChains.length} supported chains
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(bridge.riskLevel)}>
                        {bridge.riskLevel.toUpperCase()}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{bridge.successRate}%</div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">${bridge.volume24h.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">24h Volume</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">{bridge.transfers24h.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">24h Transfers</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <div>
                        <div className="font-medium">{bridge.avgTime}m</div>
                        <div className="text-xs text-muted-foreground">Avg Time</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">${bridge.avgFees.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Avg Fees</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Security Score</span>
                      <span>{bridge.securityScore}/100</span>
                    </div>
                    <Progress value={bridge.securityScore} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Liquidity Score</span>
                      <span>{bridge.liquidityScore}/100</span>
                    </div>
                    <Progress value={bridge.liquidityScore} className="h-2" />
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Supported Chains</div>
                    <div className="flex flex-wrap gap-1">
                      {bridge.supportedChains.map((chain, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {chain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {bridge.lastIncident && (
                    <div className="mt-3 text-xs text-muted-foreground">
                      Last incident: {formatTimestamp(bridge.lastIncident)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="space-y-4">
            {flowPatterns.map((pattern) => (
              <Card key={pattern.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPatternIcon(pattern.pattern)}
                      <div>
                        <CardTitle className="text-lg capitalize">
                          {pattern.pattern.replace('_', ' ')} Pattern
                        </CardTitle>
                        <CardDescription>
                          {pattern.fromChain} → {pattern.toChain} • {pattern.token}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(pattern.riskScore > 70 ? 'high' : pattern.riskScore > 40 ? 'medium' : 'low')}>
                        RISK: {pattern.riskScore}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{pattern.confidence}%</div>
                        <div className="text-xs text-muted-foreground">Confidence</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">${pattern.volume.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Total Volume</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">{pattern.frequency}</div>
                        <div className="text-xs text-muted-foreground">Frequency</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Network className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="font-medium">{pattern.participants}</div>
                        <div className="text-xs text-muted-foreground">Participants</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-orange-500" />
                      <div>
                        <div className="font-medium">${pattern.avgAmount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Avg Amount</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Pattern Confidence</span>
                      <span>{pattern.confidence}%</span>
                    </div>
                    <Progress value={pattern.confidence} className="h-2" />
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Timeframe: {pattern.timeframe}</span>
                    <span>Risk Score: {pattern.riskScore}/100</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrossChainMonitor;
