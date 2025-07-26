"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, Activity, TrendingUp, AlertTriangle, Eye, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useWallet } from '@/app/(core)/providers/WalletProvider'

interface WalletNode {
  id: string
  address: string
  label?: string
  type: 'wallet' | 'contract' | 'exchange'
  riskScore: number
  volume24h: number
  connections: number
}

interface WalletEdge {
  from: string
  to: string
  type: 'defi' | 'nft' | 'transfer' | 'bridge'
  volume: number
  frequency: number
  timestamp: number
}

interface NetworkNode {
  id: string
  address: string
  label?: string
  type: 'whale' | 'contract' | 'suspicious' | 'normal'
  riskScore: number
  transactionCount: number
  totalVolume: number
  connections: number
  cluster: string
  lastActivity: number
}

interface Connection {
  id: string
  fromNode: string
  toNode: string
  strength: number
  transactionCount: number
  totalVolume: number
  riskLevel: 'low' | 'medium' | 'high'
  connectionType: string
}

interface Cluster {
  id: string
  name: string
  nodeCount: number
  avgRiskScore: number
  totalVolume: number
  description: string
  riskLevel: 'low' | 'medium' | 'high'
}

export function WalletGraphExplorer() {
  const { targetWallet, analysisData } = useWallet()
  const [searchAddress, setSearchAddress] = useState("")
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  useEffect(() => {
    if (targetWallet) {
      setSearchAddress(targetWallet)
      loadNetworkData()
    }
  }, [targetWallet, analysisData])

  const loadNetworkData = () => {
    // Mock data untuk demo dengan data spesifik wallet jika tersedia
    let mockNodes: NetworkNode[] = [
      {
        id: "1",
        address: "sei1abc123def456ghi789jkl012mno345pqr678stu",
        label: "DeFi Whale",
        type: "whale",
        riskScore: 25,
        transactionCount: 1250,
        totalVolume: 2500000,
        connections: 45,
        cluster: "defi_traders",
        lastActivity: Date.now() - 3600000
      },
      {
        id: "2",
        address: "sei1xyz789abc123def456ghi789jkl012mno345pqr",
        label: "Smart Contract",
        type: "contract",
        riskScore: 15,
        transactionCount: 8900,
        totalVolume: 12000000,
        connections: 156,
        cluster: "dex_contracts",
        lastActivity: Date.now() - 1800000
      },
      {
        id: "3",
        address: "sei1mno456pqr789stu012vwx345yza678bcd901efg",
        label: "Suspicious Actor",
        type: "suspicious",
        riskScore: 85,
        transactionCount: 450,
        totalVolume: 890000,
        connections: 12,
        cluster: "high_risk",
        lastActivity: Date.now() - 7200000
      }
    ]

    // Add target wallet to network if available
    if (targetWallet && analysisData) {
      const targetNode: NetworkNode = {
        id: "target",
        address: targetWallet,
        label: "Target Wallet",
        type: analysisData.riskScore > 70 ? "normal" : "suspicious",
        riskScore: analysisData.riskScore || 50,
        transactionCount: analysisData.transactionCount || 100,
        totalVolume: analysisData.totalValue || 500000,
        connections: Math.floor((analysisData.riskScore || 50) / 10),
        cluster: analysisData.riskScore > 70 ? "normal_users" : "high_risk",
        lastActivity: Date.now() - 600000
      }
      mockNodes.unshift(targetNode)
    }

    const mockConnections: Connection[] = [
      {
        id: "1",
        fromNode: "1",
        toNode: "2",
        strength: 0.8,
        transactionCount: 45,
        totalVolume: 125000,
        riskLevel: "low",
        connectionType: "frequent_trading"
      },
      {
        id: "2",
        fromNode: "2",
        toNode: "3",
        strength: 0.3,
        transactionCount: 8,
        totalVolume: 25000,
        riskLevel: "high",
        connectionType: "suspicious_flow"
      }
    ]

    // Add connections for target wallet if available
    if (targetWallet && analysisData) {
      const targetConnection: Connection = {
        id: "target-conn",
        fromNode: "target",
        toNode: "1",
        strength: (analysisData.riskScore || 50) / 100,
        transactionCount: Math.floor((analysisData.transactionCount || 100) * 0.1),
        totalVolume: (analysisData.totalValue || 500000) * 0.2,
        riskLevel: analysisData.riskScore > 70 ? "low" : "medium",
        connectionType: "trading_activity"
      }
      mockConnections.push(targetConnection)
    }

    const mockClusters: Cluster[] = [
      {
        id: "1",
        name: "DeFi Traders",
        nodeCount: 45,
        avgRiskScore: 35,
        totalVolume: 8900000,
        description: "Active DeFi participants with consistent trading patterns",
        riskLevel: "medium"
      },
      {
        id: "2",
        name: "DEX Contracts",
        nodeCount: 12,
        avgRiskScore: 20,
        totalVolume: 25000000,
        description: "Decentralized exchange smart contracts",
        riskLevel: "low"
      },
      {
        id: "3",
        name: "High Risk Actors",
        nodeCount: 8,
        avgRiskScore: 78,
        totalVolume: 1200000,
        description: "Wallets flagged for suspicious activities",
        riskLevel: "high"
      }
    ]

    setNetworkNodes(mockNodes)
    setConnections(mockConnections)
    setClusters(mockClusters)
  }

  const [selectedNode, setSelectedNode] = useState<WalletNode | null>(null)
  const [graphData, setGraphData] = useState<{ nodes: WalletNode[], edges: WalletEdge[] }>({ nodes: [], edges: [] })

  // Mock data untuk demo
  const mockNodes: WalletNode[] = [
    {
      id: "1",
      address: "sei1abc...def",
      label: "Smart Money Wallet",
      type: "wallet",
      riskScore: 15,
      volume24h: 125000,
      connections: 47
    },
    {
      id: "2",
      address: "sei1xyz...789",
      label: "DeFi Aggregator",
      type: "contract",
      riskScore: 85,
      volume24h: 2500000,
      connections: 234
    },
    {
      id: "3",
      address: "sei1mno...pqr",
      type: "exchange",
      riskScore: 5,
      volume24h: 15000000,
      connections: 1250
    }
  ]

  const mockEdges: WalletEdge[] = [
    {
      from: "1",
      to: "2",
      type: "defi",
      volume: 50000,
      frequency: 12,
      timestamp: Date.now() - 3600000
    },
    {
      from: "2",
      to: "3",
      type: "transfer",
      volume: 125000,
      frequency: 3,
      timestamp: Date.now() - 1800000
    }
  ]

  useEffect(() => {
    let updatedNodes = [...mockNodes];
    let updatedEdges = [...mockEdges];

    if (targetWallet && analysisData) {
      const targetNode: WalletNode = {
        id: "target",
        address: targetWallet,
        label: "Target Wallet",
        type: analysisData.riskScore > 70 ? "wallet" : "exchange",
        riskScore: analysisData.riskScore || 50,
        volume24h: analysisData.totalValue || 500000,
        connections: Math.floor((analysisData.riskScore || 50) / 10)
      };
      updatedNodes.unshift(targetNode);
    
      const targetEdge: WalletEdge = {
        from: "target",
        to: "1",
        type: "transfer",
        volume: (analysisData.totalValue || 500000) * 0.2,
        frequency: Math.floor((analysisData.transactionCount || 100) * 0.1),
        timestamp: Date.now() - 600000
      };
      updatedEdges.push(targetEdge);
    }
  
    setGraphData({ nodes: updatedNodes, edges: updatedEdges });
  }, [targetWallet, analysisData]);

  const handleSearch = async () => {
    if (!searchAddress) return
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return "bg-green-500"
    if (score < 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wallet': return <Users className="h-4 w-4" />
      case 'contract': return <Zap className="h-4 w-4" />
      case 'exchange': return <TrendingUp className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wallet Graph Explorer</h2>
          <p className="text-muted-foreground">Visualisasi hubungan antar wallet dengan AI clustering</p>
        </div>
        <Badge variant="outline" className="bg-blue-50">
          <Eye className="h-3 w-3 mr-1" />
          Live Network Analysis
        </Badge>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Wallet Network Discovery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter SEI wallet address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Explore Network"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="graph" className="space-y-4">
        <TabsList>
          <TabsTrigger value="graph">Network Graph</TabsTrigger>
          <TabsTrigger value="nodes">Node Analysis</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
          <TabsTrigger value="intelligence">Smart Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graph Visualization */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Interactive Network Graph</CardTitle>
                <CardDescription>Click nodes for details, drag to navigate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-slate-50 rounded-lg flex items-center justify-center border-2 border-dashed">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-500">3D Network Visualization</p>
                    <p className="text-sm text-slate-400">Powered by D3.js & WebGL</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Node Details */}
            <Card>
              <CardHeader>
                <CardTitle>Node Inspector</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedNode ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(selectedNode.type)}
                      <span className="font-medium">{selectedNode.address}</span>
                    </div>
                    {selectedNode.label && (
                      <Badge variant="secondary">{selectedNode.label}</Badge>
                    )}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Risk Score</span>
                        <span className="text-sm font-medium">{selectedNode.riskScore}/100</span>
                      </div>
                      <Progress value={selectedNode.riskScore} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">24h Volume</p>
                        <p className="font-medium">${selectedNode.volume24h.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Connections</p>
                        <p className="font-medium">{selectedNode.connections}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Select a node to view details</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nodes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {graphData.nodes.map((node) => (
              <Card key={node.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedNode(node)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(node.type)}
                      <span className="font-medium text-sm">{node.address}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(node.riskScore)}`} />
                  </div>
                  {node.label && <Badge variant="outline" className="w-fit">{node.label}</Badge>}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Risk</p>
                      <p className="font-medium">{node.riskScore}/100</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-medium">${(node.volume24h / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Suspicious Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="font-medium text-red-800">Circular Transaction Pattern</p>
                    <p className="text-sm text-red-600">3 wallets performed circular transactions within 5 minutes</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium text-yellow-800">High Frequency Trading</p>
                    <p className="text-sm text-yellow-600">Wallet performed 50+ transactions within 1 hour</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Smart Money Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800">Early LP Provider</p>
                    <p className="text-sm text-green-600">Wallet provided liquidity 2 hours before listing</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">Cross-Protocol Arbitrage</p>
                    <p className="text-sm text-blue-600">Consistent profit from cross-DEX arbitrage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Network Intelligence</CardTitle>
              <CardDescription>Automated insights from machine learning analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Network Cluster Analysis</h4>
                  <p className="text-sm text-blue-600">Detected 3 main clusters: DeFi Farmers (45%), NFT Traders (30%), Arbitrageurs (25%)</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Behavioral Prediction</h4>
                  <p className="text-sm text-purple-600">ML model predicts 78% probability this wallet will make large transactions within 24 hours</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Risk Assessment</h4>
                  <p className="text-sm text-green-600">This network has a low risk score (23/100) with good diversification</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
