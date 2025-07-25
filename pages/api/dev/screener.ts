import { NextApiRequest, NextApiResponse } from 'next';
import { RiskScorer } from '@/lib/risk-scorer';

// Mock dev wallet data
interface DevWallet {
  address: string;
  balance: number;
  transactions: number;
  age: number;
  anomalyScore: number;
}

const mockDevWallets: DevWallet[] = [
  { address: '0xdev1...abcd', balance: 500000, transactions: 200, age: 45, anomalyScore: 15 },
  { address: '0xdev2...efgh', balance: 1200000, transactions: 1500, age: 20, anomalyScore: 40 },
  { address: '0xdev3...ijkl', balance: 300000, transactions: 80, age: 200, anomalyScore: 5 },
  // Add more as needed
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const scoredWallets = mockDevWallets.map(wallet => ({
      ...wallet,
      riskScore: RiskScorer.calculateRisk(wallet),
      riskLevel: RiskScorer.getRiskLevel(RiskScorer.calculateRisk(wallet)),
      riskExplanation: RiskScorer.getRiskExplanation(RiskScorer.calculateRisk(wallet))
    }));
    res.status(200).json(scoredWallets);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}