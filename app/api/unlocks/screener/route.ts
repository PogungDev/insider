import { NextRequest, NextResponse } from 'next/server';

interface UnlockEvent {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  unlockDate: string;
  unlockAmount: number;
  unlockAmountUsd: number;
  totalSupply: number;
  percentageOfSupply: number;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  category: 'team' | 'investor' | 'advisor' | 'ecosystem' | 'public' | 'treasury';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  impactScore: number;
  daysUntilUnlock: number;
  vestingSchedule: {
    totalVested: number;
    remainingVested: number;
    nextUnlockDate?: string;
    nextUnlockAmount?: number;
  };
  historicalImpact?: {
    avgPriceDropAfterUnlock: number;
    recoveryTimeInDays: number;
  };
}

// Mock data for unlock events
const generateMockUnlocks = (): UnlockEvent[] => {
  const tokens = [
    { name: 'Arbitrum', symbol: 'ARB', address: '0x912CE59144191C1204E64559FE8253a0e49E6548' },
    { name: 'Optimism', symbol: 'OP', address: '0x4200000000000000000000000000000000000042' },
    { name: 'Polygon', symbol: 'MATIC', address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0' },
    { name: 'Chainlink', symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' },
    { name: 'Uniswap', symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' },
    { name: 'Aave', symbol: 'AAVE', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' },
    { name: 'Compound', symbol: 'COMP', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888' },
    { name: 'SushiSwap', symbol: 'SUSHI', address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2' },
    { name: 'Curve DAO', symbol: 'CRV', address: '0xD533a949740bb3306d119CC777fa900bA034cd52' },
    { name: 'Yearn Finance', symbol: 'YFI', address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e' }
  ];

  const categories: UnlockEvent['category'][] = ['team', 'investor', 'advisor', 'ecosystem', 'public', 'treasury'];
  const riskLevels: UnlockEvent['riskLevel'][] = ['low', 'medium', 'high', 'critical'];

  return tokens.map((token, index) => {
    const daysUntilUnlock = Math.floor(Math.random() * 90) + 1;
    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + daysUntilUnlock);
    
    const unlockAmount = Math.floor(Math.random() * 10000000) + 100000;
    const currentPrice = Math.random() * 100 + 1;
    const unlockAmountUsd = unlockAmount * currentPrice;
    const totalSupply = unlockAmount * (Math.random() * 50 + 10);
    const percentageOfSupply = (unlockAmount / totalSupply) * 100;
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    // Calculate impact score based on various factors
    let impactScore = 0;
    impactScore += Math.min(percentageOfSupply * 2, 40); // % of supply impact
    impactScore += Math.min((unlockAmountUsd / 1000000) * 5, 30); // USD value impact
    impactScore += category === 'team' ? 20 : category === 'investor' ? 15 : 10; // Category impact
    impactScore += riskLevel === 'critical' ? 20 : riskLevel === 'high' ? 15 : riskLevel === 'medium' ? 10 : 5;
    
    return {
      id: `unlock-${index + 1}`,
      tokenName: token.name,
      tokenSymbol: token.symbol,
      tokenAddress: token.address,
      unlockDate: unlockDate.toISOString(),
      unlockAmount,
      unlockAmountUsd,
      totalSupply,
      percentageOfSupply,
      currentPrice,
      priceChange24h: (Math.random() - 0.5) * 20,
      marketCap: totalSupply * currentPrice,
      volume24h: Math.random() * 50000000,
      category,
      riskLevel,
      impactScore: Math.min(Math.max(impactScore, 0), 100),
      daysUntilUnlock,
      vestingSchedule: {
        totalVested: totalSupply * 0.6,
        remainingVested: totalSupply * 0.4,
        nextUnlockDate: new Date(unlockDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        nextUnlockAmount: unlockAmount * 0.5
      },
      historicalImpact: Math.random() > 0.5 ? {
        avgPriceDropAfterUnlock: Math.random() * 25 + 5,
        recoveryTimeInDays: Math.floor(Math.random() * 30) + 7
      } : undefined
    };
  });
};

const calculateSummary = (unlocks: UnlockEvent[]) => {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const upcomingIn24h = unlocks.filter(u => new Date(u.unlockDate) <= in24h).length;
  const upcomingIn7d = unlocks.filter(u => new Date(u.unlockDate) <= in7d).length;
  const highRiskUnlocks = unlocks.filter(u => u.riskLevel === 'high' || u.riskLevel === 'critical').length;
  const totalValueUsd = unlocks.reduce((sum, u) => sum + u.unlockAmountUsd, 0);
  const avgImpactScore = unlocks.reduce((sum, u) => sum + u.impactScore, 0) / unlocks.length;
  
  const categoryBreakdown = unlocks.reduce((acc, unlock) => {
    acc[unlock.category] = (acc[unlock.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const riskBreakdown = unlocks.reduce((acc, unlock) => {
    acc[unlock.riskLevel] = (acc[unlock.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalUnlocks: unlocks.length,
    totalValueUsd,
    highRiskUnlocks,
    avgImpactScore,
    upcomingIn24h,
    upcomingIn7d,
    categoryBreakdown,
    riskBreakdown
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'all';
    const category = searchParams.get('category') || 'all';
    const risk = searchParams.get('risk') || 'all';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'unlockDate';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Generate mock data
    let unlocks = generateMockUnlocks();

    // Apply filters
    if (timeframe !== 'all') {
      const now = new Date();
      let filterDate: Date;
      
      switch (timeframe) {
        case '24h':
          filterDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case '7d':
          filterDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          filterDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          filterDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          filterDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      }
      
      unlocks = unlocks.filter(unlock => new Date(unlock.unlockDate) <= filterDate);
    }

    if (category !== 'all') {
      unlocks = unlocks.filter(unlock => unlock.category === category);
    }

    if (risk !== 'all') {
      unlocks = unlocks.filter(unlock => unlock.riskLevel === risk);
    }

    if (search) {
      unlocks = unlocks.filter(unlock => 
        unlock.tokenName.toLowerCase().includes(search.toLowerCase()) ||
        unlock.tokenSymbol.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort results
    unlocks.sort((a, b) => {
      let aValue: any = a[sortBy as keyof UnlockEvent];
      let bValue: any = b[sortBy as keyof UnlockEvent];
      
      if (sortBy === 'unlockDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Calculate summary before pagination
    const summary = calculateSummary(unlocks);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUnlocks = unlocks.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedUnlocks,
      summary,
      pagination: {
        page,
        limit,
        total: unlocks.length,
        totalPages: Math.ceil(unlocks.length / limit)
      }
    });
  } catch (error) {
    console.error('Unlock screener API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch unlock events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenAddresses, analysisType = 'detailed' } = body;

    if (!tokenAddresses || !Array.isArray(tokenAddresses)) {
      return NextResponse.json(
        { success: false, error: 'Token addresses array is required' },
        { status: 400 }
      );
    }

    // Generate detailed analysis for specific tokens
    const mockAnalysis = tokenAddresses.map((address: string) => {
      const unlocks = generateMockUnlocks();
      const tokenUnlock = unlocks.find(u => u.tokenAddress.toLowerCase() === address.toLowerCase()) || unlocks[0];
      
      return {
        tokenAddress: address,
        tokenName: tokenUnlock.tokenName,
        tokenSymbol: tokenUnlock.tokenSymbol,
        upcomingUnlocks: [
          {
            date: tokenUnlock.unlockDate,
            amount: tokenUnlock.unlockAmount,
            amountUsd: tokenUnlock.unlockAmountUsd,
            category: tokenUnlock.category,
            riskLevel: tokenUnlock.riskLevel,
            impactScore: tokenUnlock.impactScore
          }
        ],
        vestingSchedule: tokenUnlock.vestingSchedule,
        historicalImpact: tokenUnlock.historicalImpact,
        riskAssessment: {
          overallRisk: tokenUnlock.riskLevel,
          factors: {
            supplyImpact: tokenUnlock.percentageOfSupply > 5 ? 'high' : tokenUnlock.percentageOfSupply > 2 ? 'medium' : 'low',
            valueImpact: tokenUnlock.unlockAmountUsd > 10000000 ? 'high' : tokenUnlock.unlockAmountUsd > 1000000 ? 'medium' : 'low',
            categoryRisk: tokenUnlock.category === 'team' ? 'high' : tokenUnlock.category === 'investor' ? 'medium' : 'low',
            marketConditions: Math.random() > 0.5 ? 'favorable' : 'unfavorable'
          }
        },
        recommendations: [
          tokenUnlock.impactScore > 70 ? 'Consider reducing position before unlock' : 'Monitor closely but no immediate action needed',
          tokenUnlock.category === 'team' ? 'Team unlocks typically have higher selling pressure' : 'Lower risk category unlock',
          tokenUnlock.percentageOfSupply > 5 ? 'Large percentage of supply - expect volatility' : 'Manageable supply impact'
        ]
      };
    });

    return NextResponse.json({
      success: true,
      data: mockAnalysis,
      analysisType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Unlock analysis API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze unlock events' },
      { status: 500 }
    );
  }
}