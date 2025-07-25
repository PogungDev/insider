import { NextApiRequest, NextApiResponse } from 'next';

// Mock whale data
interface Whale {
  address: string;
  balance: number;
  balanceUSD: number;
  change24h: number;
  change7d: number;
  lastActivity: string;
  riskScore: number;
  transactionVolume24h: number;
  classification: 'mega_whale' | 'whale' | 'large_holder';
}

const mockWhales: Whale[] = [
  { address: '0x1234...5678', balance: 1000000, balanceUSD: 5000000, change24h: 2.5, change7d: 10.2, lastActivity: '2 hours ago', riskScore: 25, transactionVolume24h: 1000000, classification: 'mega_whale' },
  { address: '0x2345...6789', balance: 500000, balanceUSD: 2500000, change24h: -1.2, change7d: 5.4, lastActivity: '1 day ago', riskScore: 45, transactionVolume24h: 500000, classification: 'whale' },
  // Add more mock data as needed
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Simulate filtering and sorting based on params
    const { sortBy = 'balance', classification, limit = 20 } = req.query;
    let filtered = mockWhales;
    if (classification && classification !== 'all') {
      filtered = filtered.filter(w => w.classification === classification);
    }
    // Sort logic (simplified)
    filtered.sort((a, b) => b[sortBy as keyof Whale] as number - (a[sortBy as keyof Whale] as number));
    const result = filtered.slice(0, parseInt(limit as string));
    const summary = {
      totalWhales: filtered.length,
      totalValueUSD: filtered.reduce((sum, w) => sum + w.balanceUSD, 0),
      totalVolume24h: filtered.reduce((sum, w) => sum + w.transactionVolume24h, 0),
      averageRiskScore: Math.round(filtered.reduce((sum, w) => sum + w.riskScore, 0) / filtered.length)
    };
    res.status(200).json({ success: true, data: result, summary });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}