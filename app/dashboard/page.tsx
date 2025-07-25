"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
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
  Menu,
  X,
  TrendingUp,
  Eye,
  Shield,
  FileText,
  Key,
  ChevronDown,
  ChevronRight,
  Home,
  Zap,
  Clock,
  Filter,
  Download,
  Star,
  Globe,
  Layers,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
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

// Define types
interface SidebarItem {
  id: string
  label: string
  icon: any
  subItems?: SidebarItem[]
  badge?: string
}

interface AIInsightData {
  walletAddress: string
  summary: string
  riskScore: number
  riskExplanation: string
  recommendations: string[]
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
  const [selectedWallet, setSelectedWallet] = useState("")
  const [connectedWallet, setConnectedWallet] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["overview", "wallet-explorer"])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

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

  const handleDisconnect = () => {
    localStorage.removeItem("connectedWallet")
    setSelectedWallet("")
    setConnectedWallet("")
    window.location.href = "/"
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  // Sidebar structure based on the roadmap
  const sidebarItems: SidebarItem[] = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
    },
    {
      id: "wallet-explorer",
      label: "Wallet Explorer",
      icon: Search,
      subItems: [
        { id: "search", label: "Search", icon: Search },
        { id: "whale-watch", label: "Whale Watch", icon: TrendingUp, badge: "NEW" },
        { id: "dev-screener", label: "Dev Screener", icon: Shield },
        { id: "tracked-wallets", label: "My Tracked", icon: Star },
      ]
    },
    {
      id: "wallet-detail",
      label: "Wallet Detail",
      icon: Wallet,
      subItems: [
        { id: "wallet-overview", label: "Overview", icon: Eye },
        { id: "tx-log", label: "Transaction Log", icon: Activity },
        { id: "holdings", label: "Holdings", icon: PieChartIcon },
      ]
    },
    {
      id: "spending-patterns",
      label: "Spending Patterns",
      icon: BarChartIcon,
      subItems: [
        { id: "heatmap", label: "Heatmap", icon: Activity },
        { id: "counterparties", label: "Top Counterparties", icon: Users },
        { id: "category-split", label: "Category Split", icon: PieChartIcon },
      ]
    },
    {
      id: "investment-strategy",
      label: "Investment Strategy",
      icon: Brain,
      subItems: [
        { id: "ai-recommendation", label: "AI Recommendation", icon: Bot, badge: "AI" },
        { id: "simulator", label: "Simulator", icon: Target },
        { id: "compare-wallets", label: "Compare Wallets", icon: BarChart3 },
      ]
    },
    {
      id: "alerts-anomalies",
      label: "Alerts & Anomalies",
      icon: Bell,
      subItems: [
        { id: "live-alerts", label: "Live Alerts", icon: Zap, badge: "LIVE" },
        { id: "rule-builder", label: "Rule Builder", icon: Settings },
      ]
    },
    {
      id: "unlock-events",
      label: "Unlock Events",
      icon: CalendarDays,
      subItems: [
        { id: "calendar", label: "Calendar", icon: CalendarDays },
        { id: "impact-screener", label: "Impact Screener", icon: Filter },
      ]
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      subItems: [
        { id: "generate", label: "Generate Report", icon: Download },
        { id: "history", label: "Report History", icon: Clock },
      ]
    },
    {
      id: "developer",
      label: "Developer",
      icon: Database,
      subItems: [
        { id: "api-keys", label: "API Keys", icon: Key },
        { id: "sdk-docs", label: "SDK & Docs", icon: FileText },
      ]
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      subItems: [
        { id: "profile", label: "Profile", icon: Users },
        { id: "notifications", label: "Notifications", icon: Bell },
      ]
    },
  ]

  // Mock data for demonstration
  const mockData = {
    globalKPIs: {
      totalWallets: "2.4M",
      totalVolume: "$847.2M",
      activeWhales: "1,247",
      alertsToday: "156"
    },
    recentTransactions: [
      { id: 1, from: "0x1234...5678", to: "0x9876...4321", amount: "1,250 SEI", time: "2 min ago", type: "transfer" },
      { id: 2, from: "0x2345...6789", to: "0x8765...3210", amount: "850 SEI", time: "5 min ago", type: "swap" },
      { id: 3, from: "0x3456...7890", to: "0x7654...2109", amount: "2,100 SEI", time: "8 min ago", type: "stake" },
    ],
    topWhales: [
      { rank: 1, address: "0x1234...5678", balance: "$2.4M", change: "+5.2%" },
      { rank: 2, address: "0x2345...6789", balance: "$1.8M", change: "-2.1%" },
      { rank: 3, address: "0x3456...7890", balance: "$1.5M", change: "+8.7%" },
    ]
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

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Global Network Overview</h2>
            <p className="text-slate-500">Key metrics and insights for Sei ecosystem</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Active Wallets</CardTitle>
                  <Users className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{mockData.globalKPIs.totalWallets}</div>
                  <p className="text-xs text-green-600">+15% growth</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">24h Transaction Volume</CardTitle>
                  <DollarSign className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{mockData.globalKPIs.totalVolume}</div>
                  <p className="text-xs text-green-600">+10% increase</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Whale Activity Index</CardTitle>
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{mockData.globalKPIs.activeWhales}</div>
                  <p className="text-xs text-blue-600">High activity</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Security Alerts</CardTitle>
                  <Bell className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{mockData.globalKPIs.alertsToday}</div>
                  <p className="text-xs text-orange-600">Monitor closely</p>
                </CardContent>
              </Card>
            </div>

            {/* Live Transaction Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Live Transaction Feed</CardTitle>
                  <CardDescription className="text-slate-500">Real-time transactions across Sei network</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.recentTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            tx.type === "transfer" ? "bg-blue-500" :
                            tx.type === "swap" ? "bg-green-500" : "bg-purple-500"
                          )} />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{tx.from} → {tx.to}</p>
                            <p className="text-xs text-slate-500">{tx.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">{tx.amount}</p>
                          <Badge variant="outline" className="text-xs">{tx.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Top Whales</CardTitle>
                  <CardDescription className="text-slate-500">Largest wallet holders by balance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.topWhales.map((whale) => (
                      <div key={whale.rank} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">#{whale.rank}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{whale.address}</p>
                            <p className="text-xs text-slate-500">Whale Wallet</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">{whale.balance}</p>
                          <p className={cn(
                            "text-xs",
                            whale.change.startsWith("+") ? "text-green-600" : "text-red-600"
                          )}>{whale.change}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case "search":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Wallet Discovery Tool</h2>
            <p className="text-slate-500">Advanced search with filters and analytics</p>
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Search Interface</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Input placeholder="Address, tag, or pattern" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1" />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Search className="h-4 w-4 mr-2" /> Find Wallets</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Results Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Globe className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Use advanced filters for precise results</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "whale-watch":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Whale Monitoring Dashboard</h2>
            <p className="text-slate-500">Track large holders and their activities in real-time</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Whale Population</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">1,247</div>
                  <p className="text-xs text-green-600">+18% growth</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Average Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">$2.8M</div>
                  <p className="text-xs text-blue-600">Stable trend</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Daily Active Whales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">342</div>
                  <p className="text-xs text-orange-600">Above average</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Whale Rankings</CardTitle>
                <CardDescription className="text-slate-500">Top whale wallets by balance (>$100k)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">#{i + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">0x{Math.random().toString(16).substr(2, 8)}...{Math.random().toString(16).substr(2, 6)}</p>
                          <p className="text-xs text-slate-500">{Math.floor(Math.random() * 500 + 100)} transactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">${(Math.random() * 5 + 1).toFixed(1)}M</p>
                        <p className={cn(
                          "text-xs",
                          Math.random() > 0.5 ? "text-green-600" : "text-red-600"
                        )}>{Math.random() > 0.5 ? "+" : "-"}{(Math.random() * 10).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "dev-screener":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Dev Wallet Analyzer</h2>
            <p className="text-slate-500">Screen for developer-related holdings and risks</p>
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Screening Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-900">Detected Dev Wallets</p>
                    <p className="text-2xl font-bold text-blue-600">127</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-900">Total Holdings</p>
                    <p className="text-2xl font-bold text-green-600">$45.2M</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-900">High Risk</p>
                    <p className="text-2xl font-bold text-orange-600">23</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-900">Active</p>
                    <p className="text-2xl font-bold text-purple-600">89</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          i % 3 === 0 ? "bg-red-500" : i % 3 === 1 ? "bg-orange-500" : "bg-green-500"
                        )} />
                        <div>
                          <p className="text-sm font-medium text-slate-900">0x{Math.random().toString(16).substr(2, 8)}...{Math.random().toString(16).substr(2, 6)}</p>
                          <p className="text-xs text-slate-500">Project: {["DeFi Protocol", "NFT Marketplace", "Gaming Token", "Layer 2 Solution"][i % 4]}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">${(Math.random() * 10 + 1).toFixed(1)}M</p>
                        <Badge variant={i % 3 === 0 ? "destructive" : i % 3 === 1 ? "secondary" : "default"} className="text-xs">
                          {i % 3 === 0 ? "High Risk" : i % 3 === 1 ? "Medium" : "Low Risk"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "tracked-wallets":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Tracked Wallet Manager</h2>
            <p className="text-slate-500">Monitor and analyze your watched addresses</p>
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Watchlist Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex space-x-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white"><Star className="h-4 w-4 mr-2" /> Track New</Button>
                    <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Sort</Button>
                  </div>
                  <Badge variant="outline" className="text-slate-600">Active Watchlist</Badge>
                </div>
                
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">0x{Math.random().toString(16).substr(2, 8)}...{Math.random().toString(16).substr(2, 6)}</p>
                          <p className="text-xs text-slate-500">Added {Math.floor(Math.random() * 30 + 1)} days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">${(Math.random() * 5 + 0.5).toFixed(1)}M</p>
                          <p className={cn(
                            "text-xs",
                            Math.random() > 0.5 ? "text-green-600" : "text-red-600"
                          )}>{Math.random() > 0.5 ? "+" : "-"}{(Math.random() * 15).toFixed(1)}%</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "wallet-overview":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Wallet Profile Summary</h2>
            <p className="text-slate-500">Detailed metrics and history</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Current Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">$1,247,892</div>
                  <p className="text-xs text-green-600">Stable growth</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Security Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">7.2/10</div>
                  <p className="text-xs text-slate-500">Secure</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">2,847</div>
                  <p className="text-xs text-blue-600">+12 today</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Age</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">247 days</div>
                  <p className="text-xs text-slate-500">First tx: Mar 2024</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Balance History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[...Array(30)].map((_, i) => ({
                      day: i + 1,
                      balance: Math.floor(Math.random() * 500000 + 800000)
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Wallet Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-800">DeFi User</Badge>
                      <Badge className="bg-green-100 text-green-800">Long-term Holder</Badge>
                      <Badge className="bg-purple-100 text-purple-800">NFT Collector</Badge>
                      <Badge className="bg-orange-100 text-orange-800">Active Trader</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Activity Level</span>
                        <span className="text-sm font-medium text-slate-900">High</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Diversification</span>
                        <span className="text-sm font-medium text-slate-900">Medium</span>
                      </div>
                      <Progress value={65} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Risk Tolerance</span>
                        <span className="text-sm font-medium text-slate-900">Low</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "tx-log":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Transaction History Viewer</h2>
            <p className="text-slate-500">Detailed log of all wallet activities</p>
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Refine</Button>
                    <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Save CSV</Button>
                  </div>
                  <Badge variant="outline" className="text-slate-600">Recent Transactions</Badge>
                </div>
                
                <div className="space-y-4">
                  {[...Array(15)].map((_, i) => {
                    const txTypes = ["Transfer", "Swap", "Stake", "Unstake", "Mint", "Burn"]
                    const txType = txTypes[i % txTypes.length]
                    const isIncoming = Math.random() > 0.5
                    return (
                      <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            isIncoming ? "bg-green-100" : "bg-red-100"
                          )}>
                            {isIncoming ? 
                              <TrendingUp className="h-5 w-5 text-green-600" /> : 
                              <Activity className="h-5 w-5 text-red-600" />
                            }
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{txType}</p>
                            <p className="text-xs text-slate-500">
                              {isIncoming ? "From" : "To"}: 0x{Math.random().toString(16).substr(2, 8)}...{Math.random().toString(16).substr(2, 6)}
                            </p>
                            <p className="text-xs text-slate-400">{Math.floor(Math.random() * 24 + 1)} hours ago</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-sm font-medium",
                            isIncoming ? "text-green-600" : "text-red-600"
                          )}>
                            {isIncoming ? "+" : "-"}{(Math.random() * 1000 + 10).toFixed(2)} SEI
                          </p>
                          <p className="text-xs text-slate-500">${(Math.random() * 5000 + 50).toFixed(2)}</p>
                          <Badge variant="outline" className="text-xs mt-1">{txType}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "holdings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Asset Holdings Breakdown</h2>
            <p className="text-slate-500">Portfolio composition and values</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Portfolio Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">$1,247,892</div>
                  <p className="text-xs text-green-600">Positive trend</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Token Diversity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">23</div>
                  <p className="text-xs text-blue-600">Varied assets</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Largest Holding</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">SEI</div>
                  <p className="text-xs text-slate-500">67.3% of portfolio</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Portfolio Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "SEI", value: 67.3, fill: "#3b82f6" },
                          { name: "USDC", value: 15.2, fill: "#10b981" },
                          { name: "WETH", value: 8.7, fill: "#8b5cf6" },
                          { name: "Others", value: 8.8, fill: "#f59e0b" }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({name, value}) => `${name}: ${value}%`}
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Top Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { token: "SEI", amount: "125,847.23", value: "$839,234", change: "+5.2%" },
                      { token: "USDC", amount: "189,456.78", value: "$189,456", change: "+0.1%" },
                      { token: "WETH", amount: "45.67", value: "$108,234", change: "+3.8%" },
                      { token: "ATOM", amount: "2,345.89", value: "$67,892", change: "-1.2%" },
                      { token: "OSMO", amount: "8,934.12", value: "$45,678", change: "+2.1%" }
                    ].map((holding, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">{holding.token.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{holding.token}</p>
                            <p className="text-xs text-slate-500">{holding.amount}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">{holding.value}</p>
                          <p className={cn(
                            "text-xs",
                            holding.change.startsWith("+") ? "text-green-600" : "text-red-600"
                          )}>{holding.change}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "heatmap":
        return (
          <div className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Spending Heatmap</CardTitle>
                <CardDescription className="text-slate-500">Visual representation of spending patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-slate-600 p-2">
                      {day}
                    </div>
                  ))}
                  {[...Array(28)].map((_, i) => {
                    const intensity = Math.random()
                    return (
                      <div
                        key={i}
                        className={cn(
                          "h-8 rounded border border-slate-200 flex items-center justify-center text-xs",
                          intensity > 0.8 ? "bg-blue-600 text-white" :
                          intensity > 0.6 ? "bg-blue-400 text-white" :
                          intensity > 0.4 ? "bg-blue-200 text-slate-700" :
                          intensity > 0.2 ? "bg-blue-100 text-slate-600" : "bg-slate-50 text-slate-400"
                        )}
                      >
                        {i + 1}
                      </div>
                    )
                  })}
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Less activity</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-slate-50 border border-slate-200 rounded"></div>
                    <div className="w-3 h-3 bg-blue-100 border border-slate-200 rounded"></div>
                    <div className="w-3 h-3 bg-blue-200 border border-slate-200 rounded"></div>
                    <div className="w-3 h-3 bg-blue-400 border border-slate-200 rounded"></div>
                    <div className="w-3 h-3 bg-blue-600 border border-slate-200 rounded"></div>
                  </div>
                  <span>More activity</span>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Peak Activity Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[...Array(24)].map((_, i) => ({
                      hour: i,
                      activity: Math.floor(Math.random() * 100 + 10)
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="activity" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Weekly Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, i) => {
                      const activity = Math.floor(Math.random() * 100 + 20)
                      return (
                        <div key={day} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 w-20">{day}</span>
                          <div className="flex-1 mx-4">
                            <Progress value={activity} className="h-2" />
                          </div>
                          <span className="text-sm font-medium text-slate-900 w-12">{activity}%</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case "top-counterparties":
        return (
          <div className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Top Counterparties</CardTitle>
                <CardDescription className="text-slate-500">Most frequent transaction partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4", label: "Uniswap V3", txCount: 247, volume: "$1,234,567", type: "DEX" },
                    { address: "0x532925a3b8D4C0532925a3b8D4C0532925a3b8D4", label: "Binance Hot Wallet", txCount: 189, volume: "$987,654", type: "CEX" },
                    { address: "0x8D4C0532925a3b8D4C0532925a3b8D4C0532925a", label: "Compound", txCount: 156, volume: "$765,432", type: "DeFi" },
                    { address: "0x925a3b8D4C0532925a3b8D4C0532925a3b8D4C05", label: "OpenSea", txCount: 134, volume: "$543,210", type: "NFT" },
                    { address: "0x532925a3b8D4C0532925a3b8D4C0532925a3b8D4", label: "Aave", txCount: 98, volume: "$432,109", type: "DeFi" }
                  ].map((counterparty, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{counterparty.label.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{counterparty.label}</p>
                          <p className="text-xs text-slate-500">{counterparty.address.slice(0, 10)}...{counterparty.address.slice(-8)}</p>
                          <Badge variant="outline" className="text-xs mt-1">{counterparty.type}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{counterparty.txCount} txs</p>
                        <p className="text-xs text-slate-500">{counterparty.volume}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "category-split":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">DeFi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">45.2%</div>
                  <p className="text-xs text-slate-500">$564,321</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">CEX</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">28.7%</div>
                  <p className="text-xs text-slate-500">$358,142</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">NFT</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">15.8%</div>
                  <p className="text-xs text-slate-500">$197,234</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Gaming</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">10.3%</div>
                  <p className="text-xs text-slate-500">$128,195</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Category Distribution Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[...Array(12)].map((_, i) => ({
                    month: i + 1,
                    DeFi: Math.floor(Math.random() * 50 + 30),
                    CEX: Math.floor(Math.random() * 40 + 20),
                    NFT: Math.floor(Math.random() * 30 + 10),
                    Gaming: Math.floor(Math.random() * 20 + 5)
                  }))}>  
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="DeFi" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="CEX" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="NFT" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Gaming" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      case "portfolio-optimizer":
        return (
          <div className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Portfolio Optimizer</CardTitle>
                <CardDescription className="text-slate-500">AI-powered investment recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-slate-900">Current vs Recommended Allocation</h4>
                    <div className="space-y-3">
                      {[
                        { asset: "SEI", current: 67.3, recommended: 45.0, risk: "High" },
                        { asset: "USDC", current: 15.2, recommended: 25.0, risk: "Low" },
                        { asset: "WETH", current: 8.7, recommended: 15.0, risk: "Medium" },
                        { asset: "ATOM", current: 5.4, recommended: 10.0, risk: "Medium" },
                        { asset: "Others", current: 3.4, recommended: 5.0, risk: "High" }
                      ].map((allocation, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-slate-900 w-16">{allocation.asset}</span>
                            <Badge variant={allocation.risk === "High" ? "destructive" : allocation.risk === "Medium" ? "default" : "secondary"} className="text-xs">
                              {allocation.risk}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm text-slate-600">Current: {allocation.current}%</p>
                              <p className="text-sm text-blue-600">Target: {allocation.recommended}%</p>
                            </div>
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              allocation.current > allocation.recommended ? "bg-red-500" : "bg-green-500"
                            )}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-slate-900">AI Recommendations</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">Reduce SEI Exposure</p>
                            <p className="text-xs text-blue-700">Consider selling 22.3% of SEI holdings to reduce concentration risk</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-900">Increase Stablecoin Holdings</p>
                            <p className="text-xs text-green-700">Add 9.8% more USDC for better risk management</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Activity className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-purple-900">Diversify with WETH</p>
                            <p className="text-xs text-purple-700">Increase WETH allocation by 6.3% for better diversification</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "risk-alerts":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border border-red-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-red-600">High Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <p className="text-xs text-slate-500">Active alerts</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-yellow-600">Medium Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">7</div>
                  <p className="text-xs text-slate-500">Monitoring</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-green-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-green-600">Low Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <p className="text-xs text-slate-500">Resolved</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Active Risk Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "High Risk", title: "Large Transaction Detected", description: "Transaction of $50,000+ detected", time: "2 hours ago", severity: "high" },
                    { type: "High Risk", title: "Unusual Activity Pattern", description: "Multiple transactions to new addresses", time: "4 hours ago", severity: "high" },
                    { type: "High Risk", title: "Smart Contract Interaction", description: "Interaction with unverified contract", time: "6 hours ago", severity: "high" },
                    { type: "Medium Risk", title: "Concentration Risk", description: "67% of portfolio in single asset", time: "1 day ago", severity: "medium" },
                    { type: "Medium Risk", title: "Gas Price Spike", description: "Paid 3x normal gas fees", time: "2 days ago", severity: "medium" }
                  ].map((alert, i) => (
                    <div key={i} className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      alert.severity === "high" ? "bg-red-50 border-red-200" :
                      alert.severity === "medium" ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"
                    )}>
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          alert.severity === "high" ? "bg-red-100" :
                          alert.severity === "medium" ? "bg-yellow-100" : "bg-green-100"
                        )}>
                          <AlertTriangle className={cn(
                            "h-5 w-5",
                            alert.severity === "high" ? "text-red-600" :
                            alert.severity === "medium" ? "text-yellow-600" : "text-green-600"
                          )} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                          <p className="text-xs text-slate-500">{alert.description}</p>
                          <p className="text-xs text-slate-400">{alert.time}</p>
                        </div>
                      </div>
                      <Badge variant={alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "secondary"}>
                        {alert.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "unlock-calendar":
        return (
          <div className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Token Unlock Calendar</CardTitle>
                <CardDescription className="text-slate-500">Upcoming token unlock events that may impact your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { token: "SEI", amount: "125,000", value: "$156,250", date: "2024-01-15", type: "Vesting", impact: "High" },
                    { token: "ATOM", amount: "5,000", value: "$45,000", date: "2024-01-20", type: "Staking Rewards", impact: "Medium" },
                    { token: "OSMO", amount: "12,500", value: "$32,500", date: "2024-01-25", type: "Liquidity Mining", impact: "Low" },
                    { token: "WETH", amount: "2.5", value: "$6,250", date: "2024-02-01", type: "DeFi Rewards", impact: "Low" },
                    { token: "SEI", amount: "50,000", value: "$62,500", date: "2024-02-15", type: "Vesting", impact: "Medium" }
                  ].map((unlock, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{unlock.token.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{unlock.token} Unlock</p>
                          <p className="text-xs text-slate-500">{unlock.amount} tokens • {unlock.value}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">{unlock.type}</Badge>
                            <Badge variant={unlock.impact === "High" ? "destructive" : unlock.impact === "Medium" ? "default" : "secondary"} className="text-xs">
                              {unlock.impact} Impact
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{unlock.date}</p>
                        <p className="text-xs text-slate-500">{Math.ceil((new Date(unlock.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "portfolio-reports":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Monthly Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-slate-900">December 2024</div>
                    <p className="text-xs text-slate-500">Performance summary</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Tax Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-slate-900">2024 Tax Year</div>
                    <p className="text-xs text-slate-500">Capital gains & losses</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-slate-900">Q4 2024</div>
                    <p className="text-xs text-slate-500">Detailed risk analysis</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Custom Report Builder</CardTitle>
                <CardDescription className="text-slate-500">Create custom reports with specific metrics and timeframes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Report Type</label>
                    <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                      <option>Performance Summary</option>
                      <option>Transaction History</option>
                      <option>Risk Analysis</option>
                      <option>Tax Summary</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Time Period</label>
                    <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>Last 6 months</option>
                      <option>Last year</option>
                      <option>All time</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Format</label>
                    <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                      <option>PDF</option>
                      <option>CSV</option>
                      <option>Excel</option>
                      <option>JSON</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Generate</label>
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "api-docs":
        return (
          <div className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">API Documentation</CardTitle>
                <CardDescription className="text-slate-500">Integrate Insider data into your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-slate-900">Quick Start</h4>
                      <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm font-mono">
                        <div className="text-green-400"># Get wallet overview</div>
                        <div>curl -X GET \</div>
                        <div className="ml-4">https://api.insider.com/v1/wallet/overview \</div>
                        <div className="ml-4">-H "Authorization: Bearer YOUR_API_KEY"</div>
                      </div>
                      
                      <h4 className="text-lg font-medium text-slate-900">Available Endpoints</h4>
                      <div className="space-y-2">
                        {[
                          { method: "GET", endpoint: "/v1/wallet/overview", description: "Get wallet summary" },
                          { method: "GET", endpoint: "/v1/wallet/transactions", description: "List transactions" },
                          { method: "GET", endpoint: "/v1/wallet/holdings", description: "Get current holdings" },
                          { method: "GET", endpoint: "/v1/wallet/risk-score", description: "Calculate risk score" },
                          { method: "GET", endpoint: "/v1/alerts", description: "Get active alerts" }
                        ].map((endpoint, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Badge variant={endpoint.method === "GET" ? "secondary" : "default"} className="text-xs">
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm text-slate-700">{endpoint.endpoint}</code>
                            </div>
                            <p className="text-xs text-slate-500">{endpoint.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-slate-900">API Keys</h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-900">Production Key</span>
                            <Badge variant="secondary" className="text-xs">Active</Badge>
                          </div>
                          <code className="text-xs text-blue-700 font-mono">sk_prod_1234567890abcdef...</code>
                          <div className="flex space-x-2 mt-3">
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                            <Button variant="outline" size="sm">
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Regenerate
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-yellow-900">Test Key</span>
                            <Badge variant="outline" className="text-xs">Sandbox</Badge>
                          </div>
                          <code className="text-xs text-yellow-700 font-mono">sk_test_abcdef1234567890...</code>
                          <div className="flex space-x-2 mt-3">
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                            <Button variant="outline" size="sm">
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Regenerate
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-medium text-slate-900">Usage Stats</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Requests this month</span>
                          <span className="text-sm font-medium text-slate-900">1,247 / 10,000</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '12.47%'}}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Rate limit</span>
                          <span className="text-sm font-medium text-slate-900">100 req/min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "preferences":
        return (
          <div className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Preferences</CardTitle>
                <CardDescription className="text-slate-500">Customize your Insider experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-slate-900">Notifications</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Email notifications", description: "Receive alerts via email", enabled: true },
                        { label: "Push notifications", description: "Browser push notifications", enabled: false },
                        { label: "Risk alerts", description: "High-risk transaction alerts", enabled: true },
                        { label: "Portfolio updates", description: "Daily portfolio summaries", enabled: true },
                        { label: "Market news", description: "Relevant market updates", enabled: false }
                      ].map((setting, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{setting.label}</p>
                            <p className="text-xs text-slate-500">{setting.description}</p>
                          </div>
                          <div className={cn(
                            "w-12 h-6 rounded-full border-2 transition-colors cursor-pointer",
                            setting.enabled ? "bg-blue-600 border-blue-600" : "bg-slate-200 border-slate-300"
                          )}>
                            <div className={cn(
                              "w-4 h-4 rounded-full bg-white transition-transform",
                              setting.enabled ? "translate-x-6" : "translate-x-0"
                            )}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-slate-900">Display</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Currency</label>
                        <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                          <option>JPY (¥)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Theme</label>
                        <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                          <option>Light</option>
                          <option>Dark</option>
                          <option>Auto</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Date Format</label>
                        <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                          <option>MM/DD/YYYY</option>
                          <option>DD/MM/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Timezone</label>
                        <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                          <option>UTC</option>
                          <option>EST</option>
                          <option>PST</option>
                          <option>GMT</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "anomaly-detection":
        return (
          <div className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Anomaly Detection</CardTitle>
                <CardDescription className="text-slate-500">Real-time monitoring for unusual wallet activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Unusual Volume", description: "Transaction volume 5x above average", time: "2h ago", severity: "high" },
                    { type: "New Address Interaction", description: "First-time transfer to unknown wallet", time: "4h ago", severity: "medium" },
                    { type: "Gas Fee Anomaly", description: "Paid 3x normal gas fees", time: "6h ago", severity: "low" },
                    { type: "Pattern Break", description: "Deviation from regular spending pattern", time: "1d ago", severity: "medium" },
                    { type: "Contract Alert", description: "Interaction with flagged contract", time: "2d ago", severity: "high" }
                  ].map((anomaly, i) => (
                    <div key={i} className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      anomaly.severity === "high" ? "bg-red-50 border-red-200" :
                      anomaly.severity === "medium" ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"
                    )}>
                      <div className="flex items-center space-x-4">
                        <AlertTriangle className={cn(
                          "h-6 w-6",
                          anomaly.severity === "high" ? "text-red-600" :
                          anomaly.severity === "medium" ? "text-yellow-600" : "text-green-600"
                        )} />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{anomaly.type}</p>
                          <p className="text-xs text-slate-500">{anomaly.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{anomaly.time}</p>
                        <Badge variant={anomaly.severity === "high" ? "destructive" : anomaly.severity === "medium" ? "default" : "secondary"}>
                          {anomaly.severity.charAt(0).toUpperCase() + anomaly.severity.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "ai-insights":
        return (
          <div className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">AI Insights</CardTitle>
                <CardDescription className="text-slate-500">Intelligent analysis of wallet behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-blue-50 border border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-blue-900">Behavior Pattern</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-blue-900">Conservative Investor</p>
                        <p className="text-xs text-blue-700 mt-2">Low-risk, long-term holding strategy detected</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border border-green-200">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-green-900">Risk Level</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-green-900">Low</p>
                        <p className="text-xs text-green-700 mt-2">Minimal exposure to volatile assets</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-slate-900">Key Insights</h4>
                    {[
                      "Consistent monthly investments in blue-chip tokens",
                      "Low frequency of trades, averaging 2 per month",
                      "High allocation to stablecoins (45% of portfolio)",
                      "No interactions with high-risk DeFi protocols",
                      "Potential for yield optimization in safe pools"
                    ].map((insight, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                        <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
                        <p className="text-sm text-slate-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Feature Overview</CardTitle>
                <CardDescription className="text-slate-500">Explore available features and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-blue-50 border border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-blue-900">Wallet Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-blue-700">Deep dive into wallet behavior patterns and transaction history</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-green-900">Risk Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-green-700">AI-powered risk analysis and anomaly detection</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-purple-900">Portfolio Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-purple-700">Comprehensive portfolio analysis and optimization</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="text-center py-8">
                    <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Welcome to Insider Analytics</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Select a feature from the sidebar to begin analyzing wallet behavior, tracking transactions, and discovering insights.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
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

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={cn(
          "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-16"
        )}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className={cn("flex items-center space-x-3", !sidebarOpen && "justify-center")}>
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                {sidebarOpen && (
                  <div>
                    <h1 className="text-lg font-bold text-slate-900">Insider</h1>
                    <p className="text-xs text-slate-500">Wallet Behavior Analyst</p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-8 w-8 p-0"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isExpanded = expandedGroups.includes(item.id)
                const hasSubItems = item.subItems && item.subItems.length > 0
                
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        if (hasSubItems) {
                          toggleGroup(item.id)
                        } else {
                          setActiveTab(item.id)
                        }
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors",
                        activeTab === item.id && !hasSubItems
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                        !sidebarOpen && "justify-center"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {sidebarOpen && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </div>
                      {sidebarOpen && (
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              {item.badge}
                            </Badge>
                          )}
                          {hasSubItems && (
                            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      )}
                    </button>
                    
                    {/* Sub Items */}
                    {hasSubItems && isExpanded && sidebarOpen && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.subItems!.map((subItem) => {
                          const SubIcon = subItem.icon
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => setActiveTab(subItem.id)}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-sm",
                                activeTab === subItem.id
                                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <SubIcon className="h-4 w-4 flex-shrink-0" />
                                <span>{subItem.label}</span>
                              </div>
                              {subItem.badge && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                  {subItem.badge}
                                </Badge>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-200">
            {sidebarOpen && (
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Connected Wallet</p>
                <p className="text-sm font-mono text-slate-700 truncate">
                  {connectedWallet.substring(0, 8)}...{connectedWallet.substring(connectedWallet.length - 6)}
                </p>
              </div>
            )}
            <div className={cn("space-y-2", !sidebarOpen && "flex flex-col items-center")}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className={cn(
                  "border-slate-300 text-slate-700 hover:bg-slate-100",
                  sidebarOpen ? "w-full" : "w-10 h-10 p-0"
                )}
              >
                <LogOut className="h-4 w-4" />
                {sidebarOpen && <span className="ml-2">Disconnect</span>}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {sidebarItems.find(item => 
                    item.id === activeTab || 
                    item.subItems?.some(sub => sub.id === activeTab)
                  )?.label || 
                  sidebarItems.find(item => 
                    item.subItems?.some(sub => sub.id === activeTab)
                  )?.subItems?.find(sub => sub.id === activeTab)?.label || 
                  "Dashboard"}
                </h2>
                <p className="text-slate-500">Real-time wallet monitoring and analysis</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-slate-600">
                  <Globe className="h-3 w-3 mr-1" />
                  Sei Network
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/api-docs', '_blank')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  API Docs
                </Button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
