import { useState } from "react"
import { Home, Search, TrendingUp, Shield, Star, Wallet, Activity, PieChartIcon, BarChartIcon, Brain, Bot, Target, BarChart3, Bell, Zap, Settings, CalendarDays, Filter, FileText, Download, Clock, Database, Key, Users, LogOut, ChevronDown, ChevronRight, X, Menu, Tag, Eye, ArrowRightCircle, Unlock, Edit, Save, Code, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type SidebarProps = {
  setActiveTab: (tab: string) => void
}

export function Sidebar({ setActiveTab }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["wallet-intelligence-hub"])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId])
  }

  // Ultra-Dense Architecture - 5 Main Tabs
  const sidebarItems = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    subItems: []
  },
    {
      id: "wallet-intelligence-hub",
      label: "Wallet Intelligence Hub",
      icon: Brain,
      badge: "AI",
      subItems: [
        { id: "wallet-graph-explorer", label: "Graph Explorer", icon: Search },
        { id: "identity-profiler", label: "Identity Profiler", icon: Wallet },
        { id: "behavioral-clustering", label: "Behavioral Clustering", icon: Users },
        { id: "annotated-timeline", label: "Annotated Timeline", icon: Activity }
      ]
    },
    {
      id: "risk-radar",
      label: "Risk Radar",
      icon: Shield,
      badge: "Live",
      subItems: [
        { id: "threat-monitor", label: "Threat Monitor", icon: Bell },
        { id: "contract-auditor", label: "Contract Auditor", icon: Code },
        { id: "liquidity-scanner", label: "Liquidity Scanner", icon: Target },
        { id: "exploit-simulator", label: "Exploit Simulator", icon: Zap }
      ]
    },
    {
      id: "capital-flow-nexus",
      label: "Capital Flow Nexus",
      icon: TrendingUp,
      badge: "Hot",
      subItems: [
        { id: "liquidity-radar", label: "Liquidity Radar", icon: Eye },
        { id: "flow-pattern-detector", label: "Flow Pattern Detector", icon: ArrowRightCircle },
        { id: "smart-money-tracker", label: "Smart Money Tracker", icon: Star },
        { id: "cross-chain-monitor", label: "Cross-Chain Monitor", icon: BarChart3 }
      ]
    },
    {
      id: "behavioral-dna",
      label: "Behavioral DNA",
      icon: Bot,
      badge: "ML",
      subItems: [
        { id: "habit-analyzer", label: "Habit Analyzer", icon: PieChartIcon },
        { id: "sentiment-decoder", label: "Sentiment Decoder", icon: Brain },
        { id: "personality-profiler", label: "Personality Profiler", icon: Tag },
        { id: "predictive-model", label: "Predictive Model", icon: BarChartIcon }
      ]
    },
    {
      id: "alpha-synthesis-engine",
      label: "Alpha Synthesis Engine",
      icon: Database,
      badge: "Pro",
      subItems: [
        { id: "strategy-backtester", label: "Strategy Backtester", icon: BarChart3 },
        { id: "report-generator", label: "Report Generator", icon: FileText },
        { id: "alpha-ranking", label: "Alpha Ranking", icon: Star },
        { id: "ai-recommendations", label: "AI Recommendations", icon: Bot }
      ]
    }
  ];

  return (
    <div className={cn("bg-slate-50 border-r border-slate-200 transition-all duration-300 flex flex-col", sidebarOpen ? "w-64" : "w-16")}>
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h2 className="text-xl font-bold">SEI Insider</h2>}
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {sidebarItems.map((item) => (
          <div key={item.id}>
            <Button
              variant="ghost"
              className="sidebar-button interactive-button"
              onClick={() => {
                if (item.subItems.length > 0) {
                  toggleGroup(item.id);
                } else {
                  setActiveTab(item.id);
                }
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {sidebarOpen && item.label}
              {sidebarOpen && item.badge && <Badge className="ml-auto">{item.badge}</Badge>}
              {sidebarOpen && item.subItems.length > 0 && (
                <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", expandedGroups.includes(item.id) ? "rotate-180" : "")} />
              )}
            </Button>
            {sidebarOpen && expandedGroups.includes(item.id) && (
              <div className="ml-4">
                {item.subItems.map((subItem) => (
                  <Button
                    key={subItem.id}
                    variant="ghost"
                    className="sidebar-button interactive-button text-sm"
                    onClick={() => setActiveTab(subItem.id)}
                  >
                    <subItem.icon className="mr-2 h-4 w-4" />
                    {subItem.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full mb-2 interactive-button" onClick={() => console.log('Disconnect wallet')}>
          <LogOut className="mr-2 h-4 w-4" />
          {sidebarOpen && "Disconnect Wallet"}
        </Button>
      </div>
    </div>
  );
}