"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  Wallet,
  Bell,
  BarChart3,
  Users,
  DollarSign,
  Target,
  Brain,
  Database,
  Wifi,
  Search,
  Settings,
  CalendarDays,
  LogOut,
  AlertTriangle,
  Bot,
  CheckCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { UnlockCalendarModal } from "@/components/unlock-calendar-modal"
import { AIRecommendationPanel } from "@/components/ai-recommendation-panel"
import { AIChatSidebar } from "@/components/ai-chat-sidebar"
import { SpendingHeatmap } from "@/components/spending-heatmap"
import { TopTokensChart } from "@/components/top-tokens-chart"
import { WhaleTransferPlot } from "@/components/whale-transfer-plot"
import { AnomalyAlertList } from "@/components/anomaly-alert-list"
import { getBehaviorInsights, getAIRecommendation, getAnomalyAlerts } from "@/sdk"

// Define types for AI Insight and Behavior Data
interface AIInsightData {
  walletAddress: string
  summary: string
  riskScore: number
  riskExplanation: string
  recommendations: string[]
}

interface BehaviorData {
  walletAddress: string
  behaviorPatterns: { pattern: string; confidence: number; description: string }[]
  tokenDistribution: { name: string; value: number; color: string }[]
  dailyActivityHeatmap: { day: string; [key: string]: number | string }[]
  whaleMovements: { id: string; amount: number; token: string; from: string; to: string; timestamp: string }[]
}

interface AnomalyAlert {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  description: string
  time: string
  category: string
}

export default function Dashboard() {
  const [selectedWallet, setSelectedWallet] = useState("") // Start empty
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [realTimeData, setRealTimeData] = useState([])
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState("")
  const [backendStatus, setBackendStatus] = useState<any>(null)
  const [apiEndpointStatus, setApiEndpointStatus] = useState<any>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // New states for AI Insights and Behavior Data
  const [aiInsight, setAiInsight] = useState<AIInsightData | null>(null)
  const [behaviorData, setBehaviorData] = useState<BehaviorData | null>(null)
  const [anomalyAlerts, setAnomalyAlerts] = useState<AnomalyAlert[]>([])

  // Load wallet from localStorage on component mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("connectedWallet")
    if (savedWallet) {
      setSelectedWallet(savedWallet)
      setConnectedWallet(savedWallet)
      showSuccessToast(`Restored session for ${savedWallet.substring(0, 10)}...`)
    } else {
      // Redirect to landing page if no wallet connected
      window.location.href = "/"
    }
  }, [])

  const showSuccessToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Fetch real-time wallet data
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isMonitoring && selectedWallet) {
      interval = setInterval(async () => {
        try {
          const response = await fetch("/api/realtime-wallet-data")
          const newPoint = await response.json()
          setRealTimeData((prev) => {
            const newData = [...prev, newPoint]
            return newData.slice(-6) // Keep only last 6 points
          })
        } catch (error) {
          console.error("Failed to fetch real-time wallet data:", error)
        }
      }, 3000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMonitoring, selectedWallet])

  // Fetch backend status and API endpoint status
  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        const response = await fetch("/api/status")
        const data = await response.json()
        setBackendStatus(data)
        setApiEndpointStatus(data.apiEndpoints)
      } catch (error) {
        console.error("Failed to fetch backend status:", error)
      }
    }

    fetchBackendStatus()
    const interval = setInterval(fetchBackendStatus, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  // Fetch AI Insights and Behavior Data when selectedWallet changes
  useEffect(() => {
    const fetchInsights = async () => {
      if (selectedWallet) {
        try {
          const aiData = await getAIRecommendation(selectedWallet)
          setAiInsight(aiData)

          const behavior = await getBehaviorInsights(selectedWallet)
          setBehaviorData(behavior)
        } catch (error) {
          console.error("Failed to fetch insights:", error)
        }
      }
    }
    fetchInsights()
  }, [selectedWallet])

  // Fetch Anomaly Alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      if (!selectedWallet) return;
      try {
        const alerts = await getAnomalyAlerts(selectedWallet);
        setAnomalyAlerts(alerts);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // Refresh anomaly alerts every 15 seconds
    return () => clearInterval(interval);
  }, [selectedWallet]);

  const handleWalletChange = (newWallet: string) => {
    setSelectedWallet(newWallet)
    setConnectedWallet(newWallet)
    localStorage.setItem("connectedWallet", newWallet)
    showSuccessToast(`Connected to ${newWallet.substring(0, 10)}...`)
  }

  const handleDisconnect = () => {
    localStorage.removeItem("connectedWallet")
    setSelectedWallet("")
    setConnectedWallet("")
    window.location.href = "/"
  }

  // Helper to get alert icon based on severity
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "info":
        return <AlertTriangle className="h-4 w-4 text-blue-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-slate-600" />
    }
  }

  // If no wallet connected, show loading or redirect
  if (!connectedWallet) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No wallet connected. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{toastMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AI Agent Dashboard</h1>
                <p className="text-slate-500">Monitoring: {connectedWallet.substring(0, 8)}...{connectedWallet.substring(-6)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/api-docs', '_blank')}
                className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
              >
                <Settings className="h-4 w-4 mr-2" />
                API Docs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChatOpen(true)}
                className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* AI Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-900">Detection Accuracy</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">97.3%</div>
              <p className="text-xs text-green-600">+0.8% this week</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-900">API Calls/Day</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">847K</div>
              <p className="text-xs text-green-600">+15.2% vs last week</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-900">Active Agents</CardTitle>
              <Bot className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">234</div>
              <p className="text-xs text-blue-600">+23 new today</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-900">Response Time</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">47ms</div>
              <p className="text-xs text-green-600">-12ms improved</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Activity className="h-4 w-4 mr-2" />
              Live Data
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Bot className="h-4 w-4 mr-2" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="architecture" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Live Data Tab - Real-time Activity */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                    Live Transaction Stream
                  </CardTitle>
                  <CardDescription className="text-slate-500">
                    Real-time Sei blockchain activity and AI detection results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center space-x-4">
                    <Input
                      placeholder="Enter wallet address (0x...)"
                      value={selectedWallet}
                      onChange={(e) => setSelectedWallet(e.target.value)}
                      className="bg-slate-50 border-slate-300 text-slate-900"
                    />
                    <Button
                      onClick={() => handleWalletChange(selectedWallet)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Update Wallet
                    </Button>
                    <Button
                      onClick={() => setIsMonitoring(!isMonitoring)}
                      className={isMonitoring ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                    >
                      {isMonitoring ? "Stop" : "Start"} Monitoring
                    </Button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={realTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="time" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E2E8F0",
                            borderRadius: "8px",
                            color: "#1E293B",
                          }}
                          itemStyle={{ color: "#1E293B" }}
                        />
                        <Line type="monotone" dataKey="volume" stroke="#8B5CF6" strokeWidth={2} />
                        <Line type="monotone" dataKey="transactions" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-purple-600" />
                      AI Infrastructure
                    </CardTitle>
                    <CardDescription className="text-slate-500">AI agent and ML pipeline status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">ML Detection Engine</span>
                      <Badge
                        variant="outline"
                        className={
                          backendStatus?.seiRpcEndpoint.status === "Connected"
                            ? "text-green-600 border-green-600"
                            : "text-red-600 border-red-600"
                        }
                      >
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Data Pipeline</span>
                      <Badge
                        variant="outline"
                        className={
                          backendStatus?.webSocketStream.status === "Active"
                            ? "text-green-600 border-green-600"
                            : "text-red-600 border-red-600"
                        }
                      >
                        Streaming
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">API Gateway</span>
                      <Badge
                        variant="outline"
                        className={
                          backendStatus?.cronJobs.status === "Running"
                            ? "text-green-600 border-green-600"
                            : "text-red-600 border-red-600"
                        }
                      >
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Alert System</span>
                      <Badge
                        variant="outline"
                        className={
                          backendStatus?.alertEngine.status === "Ready"
                            ? "text-blue-600 border-blue-600"
                            : "text-red-600 border-red-600"
                        }
                      >
                        Ready
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-blue-600" />
                      Developer Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-purple-300 text-purple-700 bg-transparent hover:bg-purple-50"
                      onClick={() => window.open('/api-docs', '_blank')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      API Documentation
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100"
                      onClick={() => window.open('/sdk', '_blank')}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      SDK & Libraries
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100"
                      onClick={() => window.open('/examples', '_blank')}
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      AI Agent Examples
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100"
                      onClick={() => setIsChatOpen(true)}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      AI Assistant
                    </Button>
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => (window.location.href = "/behavioral-insights")}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Advanced Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI Recommendation Panel */}
            <AIRecommendationPanel walletAddress={selectedWallet} />
          </TabsContent>

          {/* AI Insights Tab - Comprehensive Analysis */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Behavior Patterns</CardTitle>
                  <CardDescription className="text-slate-500">
                    AI-detected wallet behavior classifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {behaviorData?.behaviorPatterns.length > 0 ? (
                    behaviorData.behaviorPatterns.map((pattern, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 font-medium">{pattern.pattern}</span>
                          <Badge variant="outline" className="text-purple-600 border-purple-600">
                            {pattern.confidence}%
                          </Badge>
                        </div>
                        <Progress value={pattern.confidence} className="h-2" />
                        <p className="text-sm text-slate-500">{pattern.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500">No behavior patterns found for this wallet.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Token Distribution</CardTitle>
                  <CardDescription className="text-slate-500">Portfolio composition analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={behaviorData?.tokenDistribution || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {behaviorData?.tokenDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E2E8F0",
                            borderRadius: "8px",
                            color: "#1E293B",
                          }}
                          itemStyle={{ color: "#1E293B" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {behaviorData?.tokenDistribution.map((token, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: token.color }} />
                        <span className="text-slate-700 text-sm">
                          {token.name}: {token.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Analytics Components */}
            <SpendingHeatmap walletAddress={selectedWallet} />
            <TopTokensChart walletAddress={selectedWallet} />
            <WhaleTransferPlot walletAddress={selectedWallet} />
          </TabsContent>

          {/* Alerts Tab - Anomaly Detection */}
          <TabsContent value="alerts" className="space-y-6">
            <AnomalyAlertList />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Transaction Volume Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={realTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="time" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E2E8F0",
                            borderRadius: "8px",
                            color: "#1E293B",
                          }}
                          itemStyle={{ color: "#1E293B" }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Transaction Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={realTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="time" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E2E8F0",
                            borderRadius: "8px",
                            color: "#1E293B",
                          }}
                          itemStyle={{ color: "#1E293B" }}
                        />
                        <Bar dataKey="transactions" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-lg">DeFi Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">847</div>
                  <p className="text-slate-500 text-sm">Smart contract calls</p>
                  <Progress value={75} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-lg">Whale Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">23</div>
                  <p className="text-slate-500 text-sm">Large transactions</p>
                  <Progress value={45} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-lg">Arbitrage Ops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
                  <p className="text-slate-500 text-sm">Cross-exchange trades</p>
                  <Progress value={60} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-lg">Token Unlocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
                  <p className="text-slate-500 text-sm">Upcoming events</p>
                  <Progress value={30} className="mt-3" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Status Tab */}
          <TabsContent value="architecture" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Backend Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-700">API Response Time</span>
                      <span className="text-slate-700">{backendStatus?.seiRpcEndpoint.latency || "N/A"}</span>
                    </div>
                    <Progress
                      value={backendStatus ? (Number.parseInt(backendStatus.seiRpcEndpoint.latency) / 100) * 100 : 0}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-700">WebSocket Latency</span>
                      <span className="text-slate-700">{backendStatus?.webSocketStream.latency || "N/A"}</span>
                    </div>
                    <Progress
                      value={backendStatus ? (Number.parseInt(backendStatus.webSocketStream.latency) / 100) * 100 : 0}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-700">Database Query Time</span>
                      <span className="text-slate-700">{backendStatus?.mongoDb.queryTime || "N/A"}</span>
                    </div>
                    <Progress
                      value={backendStatus ? (Number.parseInt(backendStatus.mongoDb.queryTime) / 100) * 100 : 0}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-700">Alert Delivery Time</span>
                      <span className="text-slate-700">{backendStatus?.alertEngine.deliveryTime || "N/A"}</span>
                    </div>
                    <Progress
                      value={
                        backendStatus ? (Number.parseInt(backendStatus.alertEngine.deliveryTime) / 60000) * 100 : 0
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">System Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Sei RPC Endpoint</span>
                    <Badge
                      className={
                        backendStatus?.seiRpcEndpoint.status === "Connected"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }
                    >
                      {backendStatus?.seiRpcEndpoint.status || "N/A"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">CryptoRank API</span>
                    <Badge
                      className={
                        backendStatus?.cryptoRankApi.status === "Active"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }
                    >
                      {backendStatus?.cryptoRankApi.status || "N/A"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Messari API</span>
                    <Badge
                      className={
                        backendStatus?.messariApi.status === "Active"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }
                    >
                      {backendStatus?.messariApi.status || "N/A"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">MongoDB</span>
                    <Badge
                      className={
                        backendStatus?.mongoDb.status === "Connected"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }
                    >
                      {backendStatus?.mongoDb.status || "N/A"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Alert Channels</span>
                    <Badge
                      className={
                        backendStatus?.alertEngine.status === "Ready"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }
                    >
                      {backendStatus?.alertEngine.status || "N/A"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Endpoints Status */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">API Endpoints Status</CardTitle>
                <CardDescription className="text-slate-500">Real-time status of backend endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {apiEndpointStatus &&
                    Object.entries(apiEndpointStatus).map(([endpoint, data]: [string, any]) => (
                      <div key={endpoint} className="p-4 border rounded-lg bg-slate-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900">{endpoint}</span>
                          <Badge
                            className={data.status === "200 OK" ? "bg-green-600 text-white" : "bg-red-600 text-white"}
                          >
                            {data.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500">Response: {data.responseTime}</p>
                      </div>
                    ))}
                  {!apiEndpointStatus && <p className="text-center text-slate-500 col-span-4">Loading API status...</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Unlock Calendar Modal */}
      <UnlockCalendarModal isOpen={isUnlockModalOpen} onClose={() => setIsUnlockModalOpen(false)} />

      {/* AI Chat Sidebar */}
      <AIChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} walletContext={selectedWallet} />
    </div>
  )
}

<TabsContent value="alerts">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-purple-600" />
        Anomaly Alerts
      </CardTitle>
      <CardDescription>Real-time unusual activity detection with rugpull and unlock risks</CardDescription>
    </CardHeader>
    <CardContent>
      <AnomalyAlertList alerts={anomalyAlerts} getAlertIcon={getAlertIcon} />
    </CardContent>
  </Card>
</TabsContent>
