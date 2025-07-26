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
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["overview", "wallet-explorer"])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId])
  }

  // Sidebar items structure
  const sidebarItems = [
    {
      id: "overview",
      label: "Dashboard Overview",
      icon: Home,
      badge: null,
      subItems: []
    },
    {
      id: "wallet-explorer",
      label: "Wallet Explorer",
      icon: Search,
      badge: "Pro",
      subItems: [
        { id: "search", label: "Wallet Discovery", icon: Search },
        { id: "wallet-overview", label: "Wallet Profile", icon: Wallet },
        { id: "tx-log", label: "Transaction Log", icon: Activity },
        { id: "wallet-tagging", label: "Wallet Tagging", icon: Tag },
        { id: "tracked-wallets", label: "Tracked Wallets", icon: Users }
      ]
    },
    {
      id: "whale-tracking",
      label: "Whale Tracking",
      icon: TrendingUp,
      badge: "Hot",
      subItems: [
        { id: "whale-watch", label: "Whale Watch", icon: Eye },
        { id: "whale-alerts", label: "Whale Alerts", icon: Bell },
        { id: "whale-analytics", label: "Whale Analytics", icon: BarChart3 }
      ]
    },
    {
      id: "analytics",
      label: "Advanced Analytics",
      icon: PieChartIcon,
      badge: null,
      subItems: [
        { id: "dev-screener", label: "Dev Screener", icon: Bot },
        { id: "network-metrics", label: "Network Metrics", icon: Activity },
        { id: "token-flows", label: "Token Flows", icon: ArrowRightCircle },
        { id: "sentiment-analysis", label: "Sentiment Analysis", icon: Brain }
      ]
    },
    {
      id: "alerts",
      label: "Smart Alerts",
      icon: Bell,
      badge: "3",
      subItems: [
        { id: "alert-rules", label: "Alert Rules", icon: Settings },
        { id: "alert-history", label: "Alert History", icon: Clock }
      ]
    },
    {
      id: "unlocks",
      label: "Token Unlocks",
      icon: Unlock,
      badge: null,
      subItems: [
        { id: "unlock-calendar", label: "Unlock Calendar", icon: CalendarDays },
        { id: "unlock-impact", label: "Impact Analysis", icon: BarChartIcon }
      ]
    },
    {
      id: "reports",
      label: "Custom Reports",
      icon: FileText,
      badge: null,
      subItems: [
        { id: "report-history", label: "Report History", icon: FileText },
        { id: "report-builder", label: "Report Builder", icon: Edit }
      ]
    },
    {
      id: "api-management",
      label: "API Management",
      icon: Code,
      badge: "Dev",
      subItems: [
        { id: "api-docs", label: "API Documentation", icon: BookOpen },
        { id: "key-manager", label: "API Key Manager", icon: Key }
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
              className="w-full justify-start mb-1"
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
                    className="w-full justify-start text-sm"
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
        <Button variant="outline" className="w-full mb-2" onClick={() => console.log('Disconnect wallet')}>
          <LogOut className="mr-2 h-4 w-4" />
          {sidebarOpen && "Disconnect Wallet"}
        </Button>
      </div>
    </div>
  );
}