import { NextRequest, NextResponse } from 'next/server';

interface WhaleWallet {
  address: string;
  label?: string;
  balance: number;
  balanceUSD: number;
  change24h: number;
  change7d: number;
  lastActivity: string;
  riskScore: number;
  transactionVolume24h: number;
  holdingTokens: {
    symbol: string;
    amount: number;
    valueUSD: number;
    percentage: number;
  }[];
  classification: 'mega_whale' | 'whale' | 'large_holder';
}

// Mock whale data - replace with actual AnalyticsRegistry contract calls
const mockWhales: WhaleWallet[] = [
  {
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9',
    label: 'Sei Foundation',
    balance: 15000000,
    balanceUSD: 4500000,
    change24h: 2.5,
    change7d: -1.2,
    lastActivity: '1 hour ago',
    riskScore: 15,
    transactionVolume24h: 2500000,
    classification: 'mega_whale',
    holdingTokens: [
      { symbol: 'SEI', amount: 12000000, valueUSD: 3600000, percentage: 80 },
      { symbol: 'USDC', amount: 500000, valueUSD: 500000, percentage: 11.1 },
      { symbol: 'ATOM', amount: 50000, valueUSD: 400000, percentage: 8.9 }
    ]
  },
  {
    address: '0x8ba1f109551bD432803012645Hac136c22C85B',
    label: 'Whale Trader #1',
    balance: 8500000,
    balanceUSD: 2550000,
    change24h: -5.8,
    change7d: 12.3,
    lastActivity: '30 minutes ago',
    riskScore: 25,
    transactionVolume24h: 1800000,
    classification: 'whale',
    holdingTokens: [
      { symbol: 'SEI', amount: 7000000, valueUSD: 2100000, percentage: 82.4 },
      { symbol: 'USDC', amount: 300000, valueUSD: 300000, percentage: 11.8 },
      { symbol: 'WETH', amount: 100, valueUSD: 150000, percentage: 5.8 }
    ]
  },
  {
    address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    label: 'DeFi Whale',
    balance: 5200000,
    balanceUSD: 1560000,
    change24h: 8.7,
    change7d: 5.4,
    lastActivity: '2 hours ago',
    riskScore: 30,
    transactionVolume24h: 950000,
    classification: 'whale',
    holdingTokens: [
      { symbol: 'SEI', amount: 4000000, valueUSD: 1200000, percentage: 76.9 },
      { symbol: 'USDC', amount: 200000, valueUSD: 200000, percentage: 12.8 },
      { symbol: 'ATOM', amount: 20000, valueUSD: 160000, percentage: 10.3 }
    ]
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    balance: 3800000,
    balanceUSD: 1140000,
    change24h: -2.1,
    change7d: -8.5,
    lastActivity: '4 hours ago',
    riskScore: 40,
    transactionVolume24h: 650000,
    classification: 'large_holder',
    holdingTokens: [
      { symbol: 'SEI', amount: 3500000, valueUSD: 1050000, percentage: 92.1 },
      { symbol: 'USDC', amount: 90000, valueUSD: 90000, percentage: 7.9 }
    ]
  },
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    label: 'Arbitrage Bot',
    balance: 2900000,
    balanceUSD: 870000,
    change24h: 15.2,
    change7d: 22.8,
    lastActivity: '15 minutes ago',
    riskScore: 20,
    transactionVolume24h: 3200000,
    classification: 'large_holder',
    holdingTokens: [
      { symbol: 'SEI', amount: 2000000, valueUSD: 600000, percentage: 69 },
      { symbol: 'USDC', amount: 150000, valueUSD: 150000, percentage: 17.2 },
      { symbol: 'WETH', amount: 80, valueUSD: 120000, percentage: 13.8 }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'balance'; // balance, change24h, volume, risk
    const order = searchParams.get('order') || 'desc'; // asc, desc
    const minBalance = parseInt(searchParams.get('minBalance') || '1000000');
    const classification = searchParams.get('classification'); // mega_whale, whale, large_holder

    let whales = [...mockWhales];

    // Filter by minimum balance
    whales = whales.filter(whale => whale.balance >= minBalance);

    // Filter by classification
    if (classification && ['mega_whale', 'whale', 'large_holder'].includes(classification)) {
      whales = whales.filter(whale => whale.classification === classification);
    }

    // Sort whales
    whales.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortBy) {
        case 'change24h':
          aValue = a.change24h;
          bValue = b.change24h;
          break;
        case 'volume':
          aValue = a.transactionVolume24h;
          bValue = b.transactionVolume24h;
          break;
        case 'risk':
          aValue = a.riskScore;
          bValue = b.riskScore;
          break;
        default:
          aValue = a.balanceUSD;
          bValue = b.balanceUSD;
      }
      
      return order === 'desc' ? bValue - aValue : aValue - bValue;
    });

    // Apply limit
    const limitedWhales = whales.slice(0, limit);

    // Calculate summary statistics
    const totalValue = whales.reduce((sum, whale) => sum + whale.balanceUSD, 0);
    const totalVolume24h = whales.reduce((sum, whale) => sum + whale.transactionVolume24h, 0);
    const avgRiskScore = whales.reduce((sum, whale) => sum + whale.riskScore, 0) / whales.length;

    // TODO: Replace with actual AnalyticsRegistry contract calls
    // const contractWhales = await fetchFromAnalyticsRegistry();

    return NextResponse.json({
      success: true,
      data: limitedWhales,
      summary: {
        totalWhales: whales.length,
        totalValueUSD: totalValue,
        totalVolume24h: totalVolume24h,
        averageRiskScore: Math.round(avgRiskScore * 10) / 10,
        classifications: {
          mega_whale: whales.filter(w => w.classification === 'mega_whale').length,
          whale: whales.filter(w => w.classification === 'whale').length,
          large_holder: whales.filter(w => w.classification === 'large_holder').length
        }
      },
      meta: {
        sortBy,
        order,
        minBalance,
        classification,
        limit,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Top whales API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch top whales',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { addresses, includeAnalytics = true } = body;

    if (!addresses || !Array.isArray(addresses)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'addresses array is required'
        },
        { status: 400 }
      );
    }

    // Batch analysis for specific whale addresses
    const whaleAnalysis = addresses.map(address => {
      const whale = mockWhales.find(w => 
        w.address.toLowerCase() === address.toLowerCase()
      );
      
      if (!whale) {
        return {
          address,
          found: false,
          error: 'Whale not found in top list'
        };
      }

      const analysis = {
        ...whale,
        found: true
      };

      if (includeAnalytics) {
        // Add additional analytics
        analysis.analytics = {
          dominanceScore: (whale.balanceUSD / 10000000) * 100, // % of total market
          velocityScore: whale.transactionVolume24h / whale.balanceUSD,
          diversificationScore: whale.holdingTokens.length * 10,
          activityPattern: getActivityPattern(whale.lastActivity)
        };
      }

      return analysis;
    });

    return NextResponse.json({
      success: true,
      data: whaleAnalysis,
      meta: {
        requestedAddresses: addresses.length,
        foundWhales: whaleAnalysis.filter(w => w.found).length,
        includeAnalytics,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Whale analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze whales',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to determine activity pattern
function getActivityPattern(lastActivity: string): string {
  if (lastActivity.includes('minute')) return 'high_frequency';
  if (lastActivity.includes('hour')) return 'active';
  if (lastActivity.includes('day')) return 'moderate';
  return 'low_activity';
}

// Helper function for future AnalyticsRegistry integration
async function fetchFromAnalyticsRegistry() {
  // TODO: Implement actual smart contract integration
  // This would call the AnalyticsRegistry contract to get real whale data
  
  // Example implementation:
  // const contract = new ethers.Contract(ANALYTICS_REGISTRY_ADDRESS, abi, provider);
  // const whales = await contract.getTopWhales(limit);
  
  return [];
}