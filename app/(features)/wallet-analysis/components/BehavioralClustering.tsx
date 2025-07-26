"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, TrendingUp, AlertTriangle, Target, Brain, Activity } from 'lucide-react';
import { useWallet } from '@/app/(core)/providers/WalletProvider'

interface ClusterData {
  id: string;
  name: string;
  description: string;
  walletCount: number;
  avgTransactionValue: number;
  riskLevel: 'low' | 'medium' | 'high';
  characteristics: string[];
  confidence: number;
}

interface BehaviorPattern {
  pattern: string;
  frequency: number;
  impact: string;
  examples: string[];
}

const BehavioralClustering: React.FC = () => {
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [patterns, setPatterns] = useState<BehaviorPattern[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { targetWallet, analysisData } = useWallet();

  useEffect(() => {
    // Simulate data loading
    const mockClusters: ClusterData[] = [
      {
        id: 'cluster-1',
        name: 'High-Frequency Traders',
        description: 'Wallets with rapid, high-volume trading patterns',
        walletCount: 1247,
        avgTransactionValue: 15420.50,
        riskLevel: 'medium',
        characteristics: ['High transaction frequency', 'Short holding periods', 'Arbitrage patterns', 'MEV activities'],
        confidence: 94
      },
      {
        id: 'cluster-2',
        name: 'Long-term Holders',
        description: 'Conservative investors with minimal trading activity',
        walletCount: 3891,
        avgTransactionValue: 8750.25,
        riskLevel: 'low',
        characteristics: ['Low transaction frequency', 'Long holding periods', 'DCA patterns', 'Staking activities'],
        confidence: 98
      },
      {
        id: 'cluster-3',
        name: 'Suspicious Actors',
        description: 'Wallets showing potential malicious behavior',
        walletCount: 156,
        avgTransactionValue: 2340.75,
        riskLevel: 'high',
        characteristics: ['Unusual transaction patterns', 'Multiple small transfers', 'Privacy coin usage', 'Mixer interactions'],
        confidence: 87
      },
      {
        id: 'cluster-4',
        name: 'DeFi Power Users',
        description: 'Active participants in DeFi protocols',
        walletCount: 2103,
        avgTransactionValue: 12890.40,
        riskLevel: 'medium',
        characteristics: ['Multi-protocol interactions', 'Yield farming', 'Liquidity provision', 'Governance participation'],
        confidence: 91
      },
      {
        id: 'cluster-5',
        name: 'NFT Collectors',
        description: 'Focused on NFT trading and collection',
        walletCount: 892,
        avgTransactionValue: 3420.80,
        riskLevel: 'low',
        characteristics: ['NFT marketplace activity', 'Collection patterns', 'Mint participation', 'Secondary trading'],
        confidence: 89
      }
    ];

    const mockPatterns: BehaviorPattern[] = [
      {
        pattern: 'Sandwich Attack Pattern',
        frequency: 23,
        impact: 'High MEV extraction',
        examples: ['Front-running large swaps', 'Back-running transactions', 'Price manipulation']
      },
      {
        pattern: 'Wash Trading Pattern',
        frequency: 15,
        impact: 'Artificial volume inflation',
        examples: ['Self-trading loops', 'Volume manipulation', 'Price support schemes']
      },
      {
        pattern: 'Accumulation Pattern',
        frequency: 67,
        impact: 'Long-term position building',
        examples: ['DCA strategies', 'Dip buying', 'Gradual accumulation']
      },
      {
        pattern: 'Liquidation Cascade',
        frequency: 8,
        impact: 'Market volatility amplification',
        examples: ['Forced selling', 'Margin calls', 'Deleveraging events']
      }
    ];

    if (targetWallet && analysisData) {
      const walletCluster: ClusterData = {
        id: `wallet-${targetWallet.slice(0, 6)}`,
        name: 'Target Wallet Cluster',
        description: 'Behavioral cluster for the analyzed wallet',
        walletCount: 1,
        avgTransactionValue: analysisData?.averageTransactionValue || 10000,
        riskLevel: analysisData?.riskLevel || 'medium',
        characteristics: analysisData?.behavioralCharacteristics || ['Custom analysis', 'Wallet-specific patterns'],
        confidence: 95
      };

      const walletPattern: BehaviorPattern = {
        pattern: 'Wallet-Specific Pattern',
        frequency: analysisData?.transactionCount || 10,
        impact: 'Custom impact based on analysis',
        examples: ['Target wallet behaviors', 'Unique patterns detected']
      };

      setClusters([...mockClusters, walletCluster]);
      setPatterns([...mockPatterns, walletPattern]);
    } else {
      setClusters(mockClusters);
      setPatterns(mockPatterns);
    }
  }, [targetWallet, analysisData]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const runClusterAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Behavioral Clustering</h2>
          <p className="text-muted-foreground">
            AI-powered clustering analysis to identify wallet behavior patterns and group similar actors
          </p>
        </div>
        <Button onClick={runClusterAnalysis} disabled={isAnalyzing} className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </Button>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Clustering Analysis in Progress</span>
                <span>Processing wallet behaviors...</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="clusters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clusters">Behavior Clusters</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="clusters" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clusters.map((cluster) => (
              <Card 
                key={cluster.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCluster === cluster.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCluster(cluster.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cluster.name}</CardTitle>
                    <Badge className={getRiskColor(cluster.riskLevel)}>
                      {cluster.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription>{cluster.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Wallets
                      </span>
                      <span className="font-medium">{cluster.walletCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Avg Value
                      </span>
                      <span className="font-medium">${cluster.avgTransactionValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Confidence
                      </span>
                      <span className="font-medium">{cluster.confidence}%</span>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Key Characteristics:</p>
                      <div className="flex flex-wrap gap-1">
                        {cluster.characteristics.slice(0, 2).map((char, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {char}
                          </Badge>
                        ))}
                        {cluster.characteristics.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{cluster.characteristics.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed View */}
          {selectedCluster && (
            <Card>
              <CardHeader>
                <CardTitle>Cluster Details</CardTitle>
                <CardDescription>
                  Detailed analysis of {clusters.find(c => c.id === selectedCluster)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const cluster = clusters.find(c => c.id === selectedCluster);
                  if (!cluster) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{cluster.walletCount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Wallets</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">${cluster.avgTransactionValue.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Avg Transaction</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{cluster.confidence}%</div>
                          <div className="text-sm text-muted-foreground">Confidence Score</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Behavioral Characteristics</h4>
                        <div className="grid gap-2 md:grid-cols-2">
                          {cluster.characteristics.map((char, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                              <Activity className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">{char}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()
                }
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid gap-4">
            {patterns.map((pattern, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pattern.pattern}</CardTitle>
                    <Badge variant="outline">{pattern.frequency} detected</Badge>
                  </div>
                  <CardDescription>{pattern.impact}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Common Examples:</h4>
                      <ScrollArea className="h-20">
                        <div className="space-y-1">
                          {pattern.examples.map((example, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-1 h-1 bg-blue-500 rounded-full" />
                              {example}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">Market Behavior Trend</p>
                    <p className="text-sm text-blue-700 mt-1">
                      High-frequency trading activity has increased by 34% in the last 7 days, 
                      indicating potential market volatility ahead.
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-900">Risk Alert</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Suspicious actor cluster shows coordinated behavior patterns, 
                      suggesting potential market manipulation attempts.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-900">Opportunity</p>
                    <p className="text-sm text-green-700 mt-1">
                      Long-term holder accumulation patterns suggest strong support levels 
                      around current price ranges.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Risk Level</span>
                      <span className="font-medium">Medium</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Manipulation Risk</span>
                      <span className="font-medium">High</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Liquidity Risk</span>
                      <span className="font-medium">Low</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Volatility Risk</span>
                      <span className="font-medium">Medium</span>
                    </div>
                    <Progress value={55} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BehavioralClustering;
