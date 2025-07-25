export const mockData = {
  globalKPIs: {
    totalWallets: 2400000,
    transactionVolume: 847200000,
    whaleIndex: 1247,
    securityAlerts: 156
  },
  recentTransactions: [
    { id: "1", from: "0x1234...5678", to: "0x9876...4321", amount: "1,250 SEI", time: "2 min ago" },
    { id: "2", from: "0xabcd...efgh", to: "0xijkl...mnop", amount: "980 SEI", time: "5 min ago" },
    { id: "3", from: "0xqrst...uvwx", to: "0xyza...bcde", amount: "2,500 SEI", time: "8 min ago" }
  ],
  topWhales: [
    { rank: 1, address: "0x1234...5678", balance: "$2.4M", change: "+5.2%" },
    { rank: 2, address: "0xabcd...efgh", balance: "$2.1M", change: "-1.3%" },
    { rank: 3, address: "0xqrst...uvwx", balance: "$1.9M", change: "+3.7%" }
  ],
  whaleData: {
    population: 456,
    avgHoldings: "$1.2M",
    dailyActive: 89
  },
  devWallets: [
    { address: "0xdev1...2345", project: "Sei Protocol", holdings: "$500K", risk: "High" },
    { address: "0xdev2...6789", project: "Astroport", holdings: "$300K", risk: "Medium" }
  ],
  trackedWallets: [
    { address: "0xtrack1...abcd", added: "2 days ago", balance: "$150K", change: "+2.5%" },
    { address: "0xtrack2...efgh", added: "1 week ago", balance: "$220K", change: "-0.8%" }
  ],
  walletMetrics: {
    balance: "$45,678",
    securityRating: 85,
    transactions: 124,
    age: "2 years"
  },
  balanceHistory: [
    { date: "2023-01", value: 30000 },
    { date: "2023-02", value: 35000 },
    // Lebih banyak data
  ],
  walletTags: [
    { label: "Active Trader", color: "blue", progress: 75 },
    { label: "Diversified Portfolio", color: "green", progress: 60 },
    { label: "High Risk Tolerance", color: "red", progress: 90 }
  ],
  transactions: [
    { type: "Transfer", direction: "out", from: "0xself...1234", to: "0xother...5678", time: "2h ago", amount: "500 SEI", usd: "$1,250" },
    // Lebih banyak transaksi
  ]
};