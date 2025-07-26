"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Shield, Zap, Eye, Clock, TrendingDown, TrendingUp, Activity, Target } from "lucide-react"
import { useWallet } from '@/app/(core)/providers/WalletProvider'

interface ThreatAlert {
  id: string
  type: 'rug_pull' | 'liquidity_drain' | 'flash_loan' | 'sandwich' | 'mev' | 'suspicious_transfer'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  timestamp: number
  affectedWallets: number
  estimatedLoss: number
  status: 'active' | 'investigating' | 'resolved'
  confidence: number
}

interface RiskMetrics {
  overallRisk: number
  liquidityRisk: number
  contractRisk: number
  networkRisk: number
  marketRisk: number
  behavioralRisk: number
}

interface LiveThreat {
  contractAddress: string
  threatType: string
  riskScore: number
  timeDetected: number
  affectedUsers: number
  potentialLoss: number
}

export function ThreatMonitor() {
  const { targetWallet, analysisData } = useWallet()
  const [threats, setThreats] = useState<ThreatAlert[]>([])
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null)
  const [liveThreats, setLiveThreats] = useState<LiveThreat[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [alertCount, setAlertCount] = useState(0)

  // Mock data untuk demo
  const mockThreats: ThreatAlert[] = [
    {
      id: "1",
      type: "rug_pull",
      severity: "critical",
      title: "Potential Rug Pull Detected",
      description: "Contract owner removed 95% liquidity from DEX pool within 5 minutes",
      timestamp: Date.now() - 300000,
      affectedWallets: 247,
      estimatedLoss: 1250000,
      status: "active",
      confidence: 94
    },
    {
      id: "2",
      type: "flash_loan",
      severity: "high",
      title: "Flash Loan Attack in Progress",
      description: "Unusual flash loan pattern detected on lending protocol",
      timestamp: Date.now() - 600000,
      affectedWallets: 12,
      estimatedLoss: 450000,
      status: "investigating",
      confidence: 87
    }
  ]

  const mockRiskMetrics: RiskMetrics = {
    overallRisk: 67,
    liquidityRisk: 78,
    contractRisk: 45,
    networkRisk: 23,
    marketRisk: 89,
    behavioralRisk: 56
  }

  const mockLiveThreats: LiveThreat[] = [
    {
      contractAddress: "sei1abc...def",
      threatType: "Liquidity Drain",
      riskScore: 92,
      timeDetected: Date.now() - 120000,
      affectedUsers: 156,
      potentialLoss: 890000
    }
  ]

  useEffect(() => {
    let threats = [...mockThreats]
    let riskMetrics = { ...mockRiskMetrics }
    let liveThreats = [...mockLiveThreats]

    if (targetWallet && analysisData) {
      const walletThreat: ThreatAlert = {
        id: `threat-${targetWallet.slice(-8)}`,
        type: analysisData.riskScore > 70 ? 'suspicious_transfer' : 'mev',
        severity: analysisData.riskScore > 80 ? 'low' : analysisData.riskScore > 60 ? 'medium' : 'high',
        title: `Wallet Risk Assessment: ${targetWallet.slice(0, 6)}...${targetWallet.slice(-4)}`,
        description: `Wallet shows ${analysisData.riskScore > 70 ? 'normal' : 'suspicious'} activity patterns with risk score ${analysisData.riskScore}`,
        timestamp: Date.now() - 30 * 60 * 1000,
        affectedWallets: 1,
        estimatedLoss: analysisData.totalValue || 50000,
        status: analysisData.riskScore > 70 ? 'resolved' : 'active',
        confidence: 90
      }
      threats.unshift(walletThreat)

      riskMetrics = {
        ...riskMetrics,
        overallRisk: analysisData.riskScore || riskMetrics.overallRisk,
        behavioralRisk: analysisData.behaviorScore || riskMetrics.behavioralRisk
      }

      const walletLiveThreat: LiveThreat = {
        contractAddress: targetWallet,
        threatType: analysisData.riskScore > 70 ? 'Normal Activity' : 'Suspicious Pattern',
        riskScore: analysisData.riskScore || 50,
        timeDetected: Date.now() - 5 * 60 * 1000,
        affectedUsers: 1,
        potentialLoss: analysisData.totalValue || 50000
      }
      liveThreats.unshift(walletLiveThreat)
    }

    setThreats(threats)
    setRiskMetrics(riskMetrics)
    setLiveThreats(liveThreats)
    setAlertCount(threats.filter(t => t.status === 'active').length)
  }, [targetWallet, analysisData])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'rug_pull': return <TrendingDown className="h-4 w-4" />
      case 'flash_loan': return <Zap className="h-4 w-4" />
      case 'sandwich': return <Target className="h-4 w-4" />
      case 'liquidity_drain': return <TrendingDown className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600"
    if (score >= 60) return "text-orange-600"
    if (score >= 40) return "text-yellow-600"
    return "text-green-600"
  }

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Threat Monitor</h2>
          <p className="text-muted-foreground">Real-time security monitoring and early warning system</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isMonitoring ? "default" : "secondary"} className="bg-green-500">
            <Activity className="h-3 w-3 mr-1" />
            {isMonitoring ? "Live Monitoring" : "Paused"}
          </Badge>
          <Badge variant="destructive">
            {alertCount} Active Alerts
          </Badge>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {riskMetrics && Object.entries(riskMetrics).map(([key, value]) => {
          const labels: Record<string, { label: string, icon: any }> = {
            overallRisk: { label: "Overall Risk", icon: Shield },
            liquidityRisk: { label: "Liquidity Risk", icon: TrendingDown },
            contractRisk: { label: "Contract Risk", icon: Zap },
            networkRisk: { label: "Network Risk", icon: Activity },
            marketRisk: { label: "Market Risk", icon: TrendingUp },
            behavioralRisk: { label: "Behavioral Risk", icon: Eye }
          }
          
          const metric = labels[key]
          const IconComponent = metric.icon
          
          return (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-lg font-bold ${getRiskColor(value)}`}>{value}</span>
                </div>
                <p className="text-sm font-medium mt-1">{metric.label}</p>
                <Progress value={value} className="h-1 mt-2" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="active-threats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active-threats">Active Threats</TabsTrigger>
          <TabsTrigger value="live-monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="threat-history">Threat History</TabsTrigger>
        </TabsList>

        <TabsContent value="active-threats" className="space-y-4">
          <div className="space-y-4">
            {threats.filter(t => t.status === 'active').map((threat) => (
              <Alert key={threat.id} className="border-l-4 border-red-500">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getThreatIcon(threat.type)}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{threat.title}</h4>
                        <Badge className={getSeverityColor(threat.severity)}>
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {threat.confidence}% confidence
                        </Badge>
                      </div>
                      <AlertDescription className="text-sm">
                        {threat.description}
                      </AlertDescription>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(threat.timestamp)}
                        </span>
                        <span>{threat.affectedWallets} wallets affected</span>
                        <span className="text-red-600 font-medium">
                          ${threat.estimatedLoss.toLocaleString()} potential loss
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Investigate
                    </Button>
                    <Button size="sm" variant="destructive">
                      Block
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live-monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Threat Detection
              </CardTitle>
              <CardDescription>Real-time monitoring of blockchain events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveThreats.map((threat, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{threat.contractAddress}</span>
                      <Badge variant={threat.riskScore >= 80 ? "destructive" : "secondary"}>
                        Risk: {threat.riskScore}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{threat.threatType}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Detected</p>
                        <p className="font-medium">{formatTimeAgo(threat.timeDetected)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Users</p>
                        <p className="font-medium">{threat.affectedUsers}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Potential Loss</p>
                        <p className="font-medium text-red-600">${(threat.potentialLoss / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threat-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Threat History</CardTitle>
              <CardDescription>Riwayat ancaman yang telah terdeteksi dan ditangani</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {threats.map((threat) => (
                  <div key={threat.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getThreatIcon(threat.type)}
                      <div>
                        <p className="font-medium">{threat.title}</p>
                        <p className="text-sm text-muted-foreground">{formatTimeAgo(threat.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(threat.severity)}>
                        {threat.severity}
                      </Badge>
                      <Badge variant={threat.status === 'resolved' ? 'default' : threat.status === 'investigating' ? 'secondary' : 'destructive'}>
                        {threat.status}
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
