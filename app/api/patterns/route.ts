import { NextRequest, NextResponse } from 'next/server';

interface SpendingPattern {
  category: string;
  amount: number;
  percentage: number;
  transactions: number;
  avgAmount: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface TimePattern {
  hour: number;
  volume: number;
  transactions: number;
}

interface VendorPattern {
  protocol: string;
  volume: number;
  transactions: number;
  uniqueUsers: number;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
}

// Mock data generators
function generateSpendingPatterns(timeframe: string): SpendingPattern[] {
  const basePatterns = [
    { category: 'DeFi Trading', baseAmount: 2450000, color: '#3B82F6' },
    { category: 'NFT Purchases', baseAmount: 1890000, color: '#8B5CF6' },
    { category: 'Token Swaps', baseAmount: 1234000, color: '#10B981' },
    { category: 'Staking/Yield', baseAmount: 890000, color: '#F59E0B' },
    { category: 'Bridge Transfers', baseAmount: 456000, color: '#EF4444' },
    { category: 'Gaming/Metaverse', baseAmount: 234000, color: '#06B6D4' },
    { category: 'Other', baseAmount: 80000, color: '#6B7280' }
  ];

  const multiplier = timeframe === '24h' ? 0.1 : timeframe === '7d' ? 1 : timeframe === '30d' ? 4 : 12;
  const totalAmount = basePatterns.reduce((sum, p) => sum + (p.baseAmount * multiplier), 0);

  return basePatterns.map(pattern => {
    const amount = pattern.baseAmount * multiplier;
    const transactions = Math.floor(amount / (Math.random() * 2000 + 500));
    const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
    
    return {
      category: pattern.category,
      amount,
      percentage: (amount / totalAmount) * 100,
      transactions,
      avgAmount: amount / transactions,
      trend: trends[Math.floor(Math.random() * trends.length)],
      color: pattern.color
    };
  });
}

function generateTimePatterns(): TimePattern[] {
  return Array.from({ length: 24 }, (_, hour) => {
    // Simulate realistic trading patterns (higher activity during certain hours)
    const baseVolume = hour >= 8 && hour <= 22 ? 500000 : 200000;
    const randomFactor = 0.5 + Math.random();
    
    return {
      hour,
      volume: Math.floor(baseVolume * randomFactor),
      transactions: Math.floor((baseVolume * randomFactor) / (Math.random() * 1000 + 500))
    };
  });
}

function generateVendorPatterns(): VendorPattern[] {
  const vendors = [
    { protocol: 'Uniswap V3', category: 'DEX', riskLevel: 'low' as const },
    { protocol: 'Aave', category: 'Lending', riskLevel: 'low' as const },
    { protocol: 'Compound', category: 'Lending', riskLevel: 'low' as const },
    { protocol: 'SushiSwap', category: 'DEX', riskLevel: 'medium' as const },
    { protocol: 'Curve Finance', category: 'DEX', riskLevel: 'low' as const },
    { protocol: 'Yearn Finance', category: 'Yield', riskLevel: 'medium' as const },
    { protocol: 'Balancer', category: 'DEX', riskLevel: 'medium' as const },
    { protocol: 'MakerDAO', category: 'Lending', riskLevel: 'low' as const },
    { protocol: '1inch', category: 'Aggregator', riskLevel: 'low' as const },
    { protocol: 'Convex Finance', category: 'Yield', riskLevel: 'medium' as const }
  ];

  return vendors.map(vendor => ({
    ...vendor,
    volume: Math.floor(Math.random() * 5000000) + 500000,
    transactions: Math.floor(Math.random() * 10000) + 1000,
    uniqueUsers: Math.floor(Math.random() * 5000) + 500
  })).sort((a, b) => b.volume - a.volume);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '7d';
    const walletType = searchParams.get('walletType') || 'all';
    const patternType = searchParams.get('type') || 'spending';

    let data;
    
    switch (patternType) {
      case 'spending':
        data = generateSpendingPatterns(timeframe);
        break;
      case 'time':
        data = generateTimePatterns();
        break;
      case 'vendors':
        data = generateVendorPatterns();
        break;
      default:
        data = {
          spending: generateSpendingPatterns(timeframe),
          time: generateTimePatterns(),
          vendors: generateVendorPatterns()
        };
    }

    // Calculate summary statistics
    const spendingData = patternType === 'spending' ? data as SpendingPattern[] : generateSpendingPatterns(timeframe);
    const summary = {
      totalVolume: spendingData.reduce((sum, p) => sum + p.amount, 0),
      totalTransactions: spendingData.reduce((sum, p) => sum + p.transactions, 0),
      topCategory: spendingData[0]?.category || 'N/A',
      avgTransactionSize: spendingData.reduce((sum, p) => sum + p.avgAmount, 0) / spendingData.length,
      timeframe,
      walletType
    };

    return NextResponse.json({
      success: true,
      data,
      summary,
      metadata: {
        timeframe,
        walletType,
        patternType,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Patterns API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch spending patterns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddresses, timeframe = '7d', analysisType = 'comprehensive' } = body;

    if (!walletAddresses || !Array.isArray(walletAddresses)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet addresses provided' },
        { status: 400 }
      );
    }

    // Mock analysis for specific wallets
    const walletAnalysis = walletAddresses.map(address => {
      const spendingPatterns = generateSpendingPatterns(timeframe);
      const timePatterns = generateTimePatterns();
      
      return {
        address,
        patterns: {
          spending: spendingPatterns,
          time: timePatterns,
          riskScore: Math.floor(Math.random() * 100),
          behaviorType: ['conservative', 'aggressive', 'balanced'][Math.floor(Math.random() * 3)],
          primaryCategory: spendingPatterns[0]?.category || 'Unknown'
        },
        insights: [
          'High DeFi trading activity detected',
          'Consistent staking behavior observed',
          'Low risk transaction patterns'
        ],
        recommendations: [
          'Consider diversifying into yield farming',
          'Monitor gas optimization opportunities',
          'Set up alerts for large transactions'
        ]
      };
    });

    return NextResponse.json({
      success: true,
      data: walletAnalysis,
      summary: {
        analyzedWallets: walletAddresses.length,
        timeframe,
        analysisType,
        completedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Patterns analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze wallet patterns' },
      { status: 500 }
    );
  }
}