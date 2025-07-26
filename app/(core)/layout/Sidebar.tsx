"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  Eye,
  Zap,
  Target,
  Brain,
  Network,
  Shield,
  Radar,
  GitBranch,
  Clock,
  MessageSquare,
  User,
  LineChart,
  TestTube,
  FileText,
  Trophy,
  Home,
  Bell
} from "lucide-react"

interface SidebarProps {
  setActiveTab: (tab: string) => void
  demoMode?: boolean
}

const menuItems = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    category: "main"
  },
  {
    id: "wallet-graph-explorer",
    label: "Graph Explorer",
    icon: Network,
    category: "wallet-intelligence",
    badge: "AI"
  },
  {
    id: "identity-profiler",
    label: "Identity Profiler",
    icon: User,
    category: "wallet-intelligence",
    badge: "NEW"
  },
  {
    id: "behavioral-clustering",
    label: "Behavioral Clustering",
    icon: Users,
    category: "behavioral-dna"
  },
  {
    id: "annotated-timeline",
    label: "Timeline Analysis",
    icon: Clock,
    category: "wallet-intelligence"
  },
  {
    id: "threat-monitor",
    label: "Threat Monitor",
    icon: Shield,
    category: "risk-radar",
    badge: "LIVE"
  },
  {
    id: "contract-auditor",
    label: "Contract Auditor",
    icon: Eye,
    category: "risk-radar"
  },
  {
    id: "exploit-simulator",
    label: "Exploit Simulator",
    icon: TestTube,
    category: "risk-radar"
  },
  {
    id: "liquidity-scanner",
    label: "Liquidity Scanner",
    icon: Radar,
    category: "capital-flow"
  },
  {
    id: "liquidity-radar",
    label: "Liquidity Radar",
    icon: Target,
    category: "capital-flow"
  },
  {
    id: "flow-pattern-detector",
    label: "Flow Patterns",
    icon: GitBranch,
    category: "capital-flow"
  },
  {
    id: "smart-money-tracker",
    label: "Smart Money",
    icon: Brain,
    category: "capital-flow",
    badge: "HOT"
  },
  {
    id: "cross-chain-monitor",
    label: "Cross-Chain Monitor",
    icon: Zap,
    category: "capital-flow"
  },
  {
    id: "habit-analyzer",
    label: "Habit Analyzer",
    icon: Activity,
    category: "behavioral-dna"
  },
  {
    id: "sentiment-decoder",
    label: "Sentiment Decoder",
    icon: MessageSquare,
    category: "behavioral-dna"
  },
  {
    id: "personality-profiler",
    label: "Personality Profiler",
    icon: User,
    category: "behavioral-dna"
  },
  {
    id: "predictive-model",
    label: "Predictive Model",
    icon: TrendingUp,
    category: "alpha-synthesis",
    badge: "AI"
  },
  {
    id: "strategy-backtester",
    label: "Strategy Backtester",
    icon: LineChart,
    category: "alpha-synthesis"
  },
  {
    id: "report-generator",
    label: "Report Generator",
    icon: FileText,
    category: "alpha-synthesis"
  },
  {
    id: "alpha-ranking",
    label: "Alpha Ranking",
    icon: Trophy,
    category: "alpha-synthesis",
    badge: "PREMIUM"
  },
  {
    id: "alerts",
    label: "Multi-Layer Alerts",
    icon: Bell,
    category: "main",
    badge: "3"
  }
]

const categories = {
  main: "Main",
  "wallet-intelligence": "Wallet Intelligence",
  "behavioral-dna": "Behavioral DNA",
  "risk-radar": "Risk Radar",
  "capital-flow": "Capital Flow",
  "alpha-synthesis": "Alpha Synthesis"
}

export function Sidebar({ setActiveTab, demoMode = false }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("overview")
  const [collapsed, setCollapsed] = useState(false)

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId)
    setActiveTab(itemId)
  }

  // Demo mode: Show only 5 key tabs for streamlined demo experience
  const demoTabs = [
    "overview",
    "wallet-graph-explorer", 
    "threat-monitor",
    "predictive-model",
    "smart-money-tracker"
  ]

  const filteredItems = demoMode 
    ? menuItems.filter(item => demoTabs.includes(item.id))
    : menuItems

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof menuItems>)

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg">SEI Insider</h1>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">Ultra-Dense Analytics</p>
                {demoMode && (
                  <Badge variant="secondary" className="text-xs h-4 px-1.5">
                    DEMO
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              {!collapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                  {categories[category as keyof typeof categories]}
                </h3>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeItem === item.id
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start h-9 px-2",
                        collapsed ? "px-2" : "px-3",
                        isActive && "bg-blue-600 text-white hover:bg-blue-700",
                        !isActive && "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <Icon className={cn(
                        "h-4 w-4",
                        collapsed ? "mx-auto" : "mr-2"
                      )} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left text-sm">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.badge === "LIVE" ? "destructive" : 
                                      item.badge === "NEW" ? "default" : 
                                      item.badge === "AI" ? "secondary" :
                                      item.badge === "HOT" ? "destructive" :
                                      item.badge === "PREMIUM" ? "outline" : "secondary"}
                              className="text-xs h-5 px-1.5"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>
    </div>
  )
}