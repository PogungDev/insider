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
  // Legacy data removed - Ultra-Dense Architecture uses its own mock data within components
};