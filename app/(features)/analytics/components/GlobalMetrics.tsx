import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"
import { TrendingUp, TrendingDown, Users, Shield, AlertTriangle, DollarSign, Activity, Target } from "lucide-react"

interface GlobalMetricsProps {
  data: {
    totalWallets: number
    transactionVolume: number
    whaleIndex: number
    securityAlerts: number
    totalValue?: number
    activeTraders?: number
    riskScore?: number
    networkHealth?: number
  }
}

export function GlobalMetrics({ data }: GlobalMetricsProps) {
  const metrics = [
    {
      title: "Total Active Wallets",
      value: formatNumber(data.totalWallets),
      icon: Users,
      change: "+12.5%",
      trend: "up" as const,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Transaction Volume",
      value: `$${formatNumber(data.transactionVolume)}`,
      icon: DollarSign,
      change: "+8.3%",
      trend: "up" as const,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Whale Index",
      value: data.whaleIndex.toFixed(2),
      icon: Target,
      change: "-2.1%",
      trend: "down" as const,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Security Alerts",
      value: data.securityAlerts.toString(),
      icon: AlertTriangle,
      change: "-15.7%",
      trend: "down" as const,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Total Value Locked",
      value: `$${formatNumber(data.totalValue || 2847000000)}`,
      icon: Shield,
      change: "+5.2%",
      trend: "up" as const,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Active Traders",
      value: formatNumber(data.activeTraders || 156789),
      icon: Activity,
      change: "+18.9%",
      trend: "up" as const,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown
        
        return (
          <Card key={index} className="bg-white border border-slate-200 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">{metric.title}</CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${metric.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{metric.value}</div>
              <div className={`text-xs flex items-center ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {metric.change} from last week
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
