import { NextRequest, NextResponse } from 'next/server';

interface DevWallet {
  address: string;
  projectName?: string;
  tokenSymbol?: string;
  totalSupply: number;
  devHolding: number;
  devPercentage: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: string;
  recentTransactions: {
    type: 'mint' | 'transfer' | 'burn';
    amount: number;
    timestamp: string;
    toAddress?: string;
  }[];
  flags: string[];
  marketCap?: number;
  liquidityLocked: boolean;
  contractVerified: boolean;
}

// Mock dev wallet data - replace with actual RiskScorer.calculateDevRisk implementation
const mockDevWallets: DevWallet[] = [
  {
    address: '0x8ba1f109551bD432803012645Hac136c22C85B',
    projectName: 'SeiMoon Token',
    tokenSymbol: 'SMOON',
    totalSupply: 1000000000,
    devHolding: 350000000,
    devPercentage: 35,
    riskScore: 85,
    riskLevel: 'critical',
    lastActivity: '2 hours ago',
    marketCap: 2500000,
    liquidityLocked: false,
    contractVerified: false,
    recentTransactions: [
      {
        type: 'mint',
        amount: 50000000,
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        type: 'transfer',
        amount: 25000000,
        timestamp: '2024-01-15T09:15:00Z',
        toAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9'
      }
    ],
    flags: [
      'High dev allocation (>30%)',
      'Recent large mints',
      'Liquidity not locked',
      'Contract not verified',
      'Suspicious transfer patterns'
    ]
  },
  {
    address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    projectName: 'Sei DeFi Protocol',
    tokenSymbol: 'SDP',
    totalSupply: 500000000,
    devHolding: 75000000,
    devPercentage: 15,
    riskScore: 45,
    riskLevel: 'medium',
    lastActivity: '1 day ago',
    marketCap: 8500000,
    liquidityLocked: true,
    contractVerified: true,
    recentTransactions: [
      {
        type: 'transfer',
        amount: 5000000,
        timestamp: '2024-01-14T14:20:00Z',
        toAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
      }
    ],
    flags: [
      'Moderate dev allocation (10-20%)',
      'Liquidity locked',
      'Contract verified'
    ]
  },
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    projectName: 'Sei Governance Token',
    tokenSymbol: 'SGT',
    totalSupply: 1000000000,
    devHolding: 50000000,
    devPercentage: 5,
    riskScore: 20,
    riskLevel: 'low',
    lastActivity: '3 days ago',
    marketCap: 15000000,
    liquidityLocked: true,
    contractVerified: true,
    recentTransactions: [
      {
        type: 'burn',
        amount: 10000000,
        timestamp: '2024-01-12T16:45:00Z'
      }
    ],
    flags: [
      'Low dev allocation (<10%)',
      'Recent token burns',
      'Liquidity locked',
      'Contract verified',
      'Transparent governance'
    ]
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    projectName: 'SeiRug Coin',
    tokenSymbol: 'SRUG',
    totalSupply: 1000000000,
    devHolding: 900000000,
    devPercentage: 90,
    riskScore: 95,
    riskLevel: 'critical',
    lastActivity: '30 minutes ago',
    marketCap: 500000,
    liquidityLocked: false,
    contractVerified: false,
    recentTransactions: [
      {
        type: 'mint',
        amount: 100000000,
        timestamp: '2024-01-15T11:00:00Z'
      },
      {
        type: 'transfer',
        amount: 200000000,
        timestamp: '2024-01-15T10:45:00Z',
        toAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9'
      }
    ],
    flags: [
      'EXTREME dev allocation (>80%)',
      'Continuous minting',
      'Large recent transfers',
      'No liquidity lock',
      'Unverified contract',
      'POTENTIAL RUGPULL'
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const riskLevel = searchParams.get('riskLevel'); // low, medium, high, critical
    const minRiskScore = parseInt(searchParams.get('minRiskScore') || '0');
    const maxRiskScore = parseInt(searchParams.get('maxRiskScore') || '100');
    const sortBy = searchParams.get('sortBy') || 'riskScore'; // riskScore, devPercentage, marketCap
    const order = searchParams.get('order') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const verified = searchParams.get('verified'); // true, false
    const liquidityLocked = searchParams.get('liquidityLocked'); // true, false

    let devWallets = [...mockDevWallets];

    // Filter by risk level
    if (riskLevel && ['low', 'medium', 'high', 'critical'].includes(riskLevel)) {
      devWallets = devWallets.filter(wallet => wallet.riskLevel === riskLevel);
    }

    // Filter by risk score range
    devWallets = devWallets.filter(wallet => 
      wallet.riskScore >= minRiskScore && wallet.riskScore <= maxRiskScore
    );

    // Filter by contract verification
    if (verified !== null) {
      const isVerified = verified === 'true';
      devWallets = devWallets.filter(wallet => wallet.contractVerified === isVerified);
    }

    // Filter by liquidity lock
    if (liquidityLocked !== null) {
      const isLocked = liquidityLocked === 'true';
      devWallets = devWallets.filter(wallet => wallet.liquidityLocked === isLocked);
    }

    // Sort wallets
    devWallets.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortBy) {
        case 'devPercentage':
          aValue = a.devPercentage;
          bValue = b.devPercentage;
          break;
        case 'marketCap':
          aValue = a.marketCap || 0;
          bValue = b.marketCap || 0;
          break;
        default:
          aValue = a.riskScore;
          bValue = b.riskScore;
      }
      
      return order === 'desc' ? bValue - aValue : aValue - bValue;
    });

    // Apply limit
    const limitedWallets = devWallets.slice(0, limit);

    // Calculate summary statistics
    const riskDistribution = {
      low: devWallets.filter(w => w.riskLevel === 'low').length,
      medium: devWallets.filter(w => w.riskLevel === 'medium').length,
      high: devWallets.filter(w => w.riskLevel === 'high').length,
      critical: devWallets.filter(w => w.riskLevel === 'critical').length
    };

    const avgDevPercentage = devWallets.reduce((sum, w) => sum + w.devPercentage, 0) / devWallets.length;
    const totalMarketCap = devWallets.reduce((sum, w) => sum + (w.marketCap || 0), 0);

    // TODO: Replace with actual RiskScorer.calculateDevRisk implementation
    // const riskScores = await calculateDevRiskScores(addresses);

    return NextResponse.json({
      success: true,
      data: limitedWallets,
      summary: {
        totalProjects: devWallets.length,
        riskDistribution,
        averageDevPercentage: Math.round(avgDevPercentage * 10) / 10,
        totalMarketCap,
        verifiedContracts: devWallets.filter(w => w.contractVerified).length,
        lockedLiquidity: devWallets.filter(w => w.liquidityLocked).length
      },
      meta: {
        filters: {
          riskLevel,
          minRiskScore,
          maxRiskScore,
          verified,
          liquidityLocked
        },
        sortBy,
        order,
        limit,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Dev screener API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dev wallet data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, tokenAddress } = body;

    if (!address && !tokenAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'Either address or tokenAddress is required'
        },
        { status: 400 }
      );
    }

    // Analyze specific dev wallet or token
    let targetWallet: DevWallet | null = null;
    
    if (address) {
      targetWallet = mockDevWallets.find(w => 
        w.address.toLowerCase() === address.toLowerCase()
      ) || null;
    }

    if (!targetWallet) {
      // TODO: Implement real-time analysis for unknown addresses
      // This would use RiskScorer.calculateDevRisk to analyze any address
      targetWallet = {
        address: address || tokenAddress,
        totalSupply: 0,
        devHolding: 0,
        devPercentage: 0,
        riskScore: 50,
        riskLevel: 'medium',
        lastActivity: 'Unknown',
        recentTransactions: [],
        flags: ['Analysis in progress'],
        liquidityLocked: false,
        contractVerified: false
      };
    }

    // Enhanced analysis with additional metrics
    const enhancedAnalysis = {
      ...targetWallet,
      analysis: {
        rugpullProbability: calculateRugpullProbability(targetWallet),
        liquidityRisk: assessLiquidityRisk(targetWallet),
        contractRisk: assessContractRisk(targetWallet),
        behaviorRisk: assessBehaviorRisk(targetWallet),
        recommendations: generateRecommendations(targetWallet)
      }
    };

    return NextResponse.json({
      success: true,
      data: enhancedAnalysis,
      meta: {
        analysisType: 'dev_risk_assessment',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Dev analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze dev wallet',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions for risk assessment
function calculateRugpullProbability(wallet: DevWallet): number {
  let probability = 0;
  
  // Dev percentage weight (40% of total score)
  if (wallet.devPercentage > 80) probability += 40;
  else if (wallet.devPercentage > 50) probability += 30;
  else if (wallet.devPercentage > 30) probability += 20;
  else if (wallet.devPercentage > 10) probability += 10;
  
  // Contract verification (20% weight)
  if (!wallet.contractVerified) probability += 20;
  
  // Liquidity lock (20% weight)
  if (!wallet.liquidityLocked) probability += 20;
  
  // Recent activity patterns (20% weight)
  const hasSuspiciousActivity = wallet.recentTransactions.some(tx => 
    tx.type === 'mint' && tx.amount > wallet.totalSupply * 0.1
  );
  if (hasSuspiciousActivity) probability += 20;
  
  return Math.min(probability, 100);
}

function assessLiquidityRisk(wallet: DevWallet): string {
  if (!wallet.liquidityLocked) return 'high';
  if (wallet.devPercentage > 50) return 'medium';
  return 'low';
}

function assessContractRisk(wallet: DevWallet): string {
  if (!wallet.contractVerified) return 'high';
  if (wallet.recentTransactions.some(tx => tx.type === 'mint')) return 'medium';
  return 'low';
}

function assessBehaviorRisk(wallet: DevWallet): string {
  const recentMints = wallet.recentTransactions.filter(tx => tx.type === 'mint').length;
  const recentTransfers = wallet.recentTransactions.filter(tx => tx.type === 'transfer').length;
  
  if (recentMints > 2 || recentTransfers > 5) return 'high';
  if (recentMints > 0 || recentTransfers > 2) return 'medium';
  return 'low';
}

function generateRecommendations(wallet: DevWallet): string[] {
  const recommendations: string[] = [];
  
  if (wallet.devPercentage > 30) {
    recommendations.push('⚠️ High dev allocation - Monitor for large sells');
  }
  
  if (!wallet.liquidityLocked) {
    recommendations.push('🔒 Liquidity not locked - High rug risk');
  }
  
  if (!wallet.contractVerified) {
    recommendations.push('✅ Contract not verified - Verify before investing');
  }
  
  if (wallet.riskScore > 70) {
    recommendations.push('🚨 High risk project - Avoid or invest minimal amounts');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ Project appears relatively safe based on current metrics');
  }
  
  return recommendations;
}