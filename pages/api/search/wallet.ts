import { NextApiRequest, NextApiResponse } from 'next';

// Mock wallet data for search
interface Wallet {
  address: string;
  balance: number;
  transactions: number;
  riskScore: number;
}

const mockWallets: Wallet[] = [
  { address: '0x1234567890abcdef1234567890abcdef12345678', balance: 1000, transactions: 150, riskScore: 20 },
  { address: '0xabcdef1234567890abcdef1234567890abcdef12', balance: 2500, transactions: 300, riskScore: 45 },
  { address: '0x7890abcdef1234567890abcdef1234567890abcd', balance: 500, transactions: 50, riskScore: 10 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const filteredWallets = mockWallets.filter(wallet => 
      wallet.address.toLowerCase().includes((query as string).toLowerCase())
    );

    res.status(200).json(filteredWallets);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}