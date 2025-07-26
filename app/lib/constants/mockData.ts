// Mock data for Ultra-Dense Architecture components
export const mockData = {
  globalKPIs: {
    totalWallets: 15420,
    transactionVolume: 2400000000,
    whaleIndex: 342,
    securityAlerts: 7
  },
  recentTransactions: [
    {
      id: "1",
      from: "0xabcd...efgh",
      to: "0x9876...5432",
      amount: "1,250 ETH",
      time: "2 mins ago"
    },
    {
      id: "2",
      from: "0xbcde...fghi",
      to: "0x8765...4321",
      amount: "500 ETH",
      time: "5 mins ago"
    },
    {
      id: "3",
      from: "0xcdef...ghij",
      to: "0x7654...3210",
      amount: "2,100 ETH",
      time: "8 mins ago"
    }
  ],
  topWhales: [
    {
      rank: 1,
      address: "0x1234...5678",
      balance: "45,230 ETH",
      change: "+2.5%"
    },
    {
      rank: 2,
      address: "0x2345...6789",
      balance: "32,100 ETH",
      change: "-1.2%"
    },
    {
      rank: 3,
      address: "0x3456...789a",
      balance: "28,950 ETH",
      change: "+0.8%"
    }
  ]
};