"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, Activity, TrendingUp, AlertTriangle, Eye, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"

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

export function WalletGraphExplorer() {
  const [searchAddress, setSearchAddress] = useState("")
  const [selectedNode, setSelectedNode] = useState<WalletNode | null>(null)
  const [graphData, setGraphData] = useState<{ nodes: WalletNode[], edges: WalletEdge[] }>({ nodes: [], edges: [] })
  const [isLoading, setIsLoading] = useState(false)

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
    setGraphData({ nodes: mockNodes, edges: mockEdges })
  }, [])

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
              placeholder="Masukkan alamat wallet SEI..."
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
                <CardDescription>Klik node untuk detail, drag untuk navigasi</CardDescription>
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
                  <p className="text-muted-foreground text-center py-8">Pilih node untuk melihat detail</p>
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
                    <p className="text-sm text-red-600">3 wallets melakukan transaksi melingkar dalam 5 menit</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium text-yellow-800">High Frequency Trading</p>
                    <p className="text-sm text-yellow-600">Wallet melakukan 50+ transaksi dalam 1 jam</p>
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
                    <p className="text-sm text-green-600">Wallet menyediakan likuiditas 2 jam sebelum listing</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">Cross-Protocol Arbitrage</p>
                    <p className="text-sm text-blue-600">Profit konsisten dari arbitrase antar DEX</p>
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
              <CardDescription>Insight otomatis dari analisis machine learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Network Cluster Analysis</h4>
                  <p className="text-sm text-blue-600">Terdeteksi 3 cluster utama: DeFi Farmers (45%), NFT Traders (30%), Arbitrageurs (25%)</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Behavioral Prediction</h4>
                  <p className="text-sm text-purple-600">Model ML memprediksi 78% kemungkinan wallet ini akan melakukan transaksi besar dalam 24 jam</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Risk Assessment</h4>
                  <p className="text-sm text-green-600">Network ini memiliki risk score rendah (23/100) dengan diversifikasi yang baik</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}