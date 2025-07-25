import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"

interface GlobalMetricsProps {
  data: {
    totalWallets: number
    transactionVolume: number
    whaleIndex: number
    securityAlerts: number
  }
}

export function GlobalMetrics({ data }: GlobalMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white border border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Total Active Wallets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(data.totalWallets)}</div>
        </CardContent>
      </Card>
      {/* Kartu serupa untuk metrik lainnya */}
    </div>
  )
}