import { NextRequest, NextResponse } from 'next/server';

interface WalletSearchResult {
  address: string;
  label?: string;
  balance: number;
  type: 'whale' | 'dev' | 'user';
  riskScore: number;
  lastActivity: string;
  transactions24h: number;
}

// Mock data - replace with actual Sei indexer integration
const mockWallets: WalletSearchResult[] = [
  {
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9',
    label: 'Whale #1',
    balance: 1250000,
    type: 'whale',
    riskScore: 25,
    lastActivity: '2 hours ago',
    transactions24h: 15
  },
  {
    address: '0x8ba1f109551bD432803012645Hac136c22C85B',
    label: 'Dev Wallet',
    balance: 850000,
    type: 'dev',
    riskScore: 75,
    lastActivity: '1 day ago',
    transactions24h: 3
  },
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    label: 'DeFi Farmer',
    balance: 45000,
    type: 'user',
    riskScore: 15,
    lastActivity: '30 minutes ago',
    transactions24h: 42
  },
  {
    address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    balance: 125000,
    type: 'whale',
    riskScore: 30,
    lastActivity: '5 hours ago',
    transactions24h: 8
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    balance: 2500000,
    type: 'whale',
    riskScore: 20,
    lastActivity: '1 hour ago',
    transactions24h: 25
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // whale, dev, user
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let results = mockWallets;

    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(wallet => 
        wallet.address.toLowerCase().includes(lowerQuery) ||
        wallet.label?.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by type
    if (type && ['whale', 'dev', 'user'].includes(type)) {
      results = results.filter(wallet => wallet.type === type);
    }

    // Apply pagination
    const paginatedResults = results.slice(offset, offset + limit);

    // TODO: Replace with actual Sei indexer integration
    // const seiResults = await fetchFromSeiIndexer(query, type, limit, offset);
    // const redisCache = await getCachedResults(query);

    return NextResponse.json({
      success: true,
      data: paginatedResults,
      pagination: {
        total: results.length,
        limit,
        offset,
        hasMore: offset + limit < results.length
      },
      meta: {
        searchQuery: query,
        filterType: type,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Wallet search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search wallets',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { addresses } = body;

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

    // Batch lookup for multiple addresses
    const results = addresses.map(address => {
      const wallet = mockWallets.find(w => 
        w.address.toLowerCase() === address.toLowerCase()
      );
      
      if (wallet) {
        return wallet;
      }
      
      // Return basic info for unknown addresses
      return {
        address,
        balance: 0,
        type: 'user' as const,
        riskScore: 50,
        lastActivity: 'Unknown',
        transactions24h: 0
      };
    });

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        requestedAddresses: addresses.length,
        foundAddresses: results.filter(r => r.balance > 0).length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Batch wallet lookup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to lookup wallets',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function for future Sei indexer integration
async function fetchFromSeiIndexer(query: string, type?: string, limit = 10, offset = 0) {
  // TODO: Implement actual Sei blockchain indexer integration
  // This would connect to Sei RPC endpoints and query wallet data
  
  const seiRpcUrl = process.env.SEI_RPC_URL || 'https://rpc.sei-apis.com';
  
  // Example implementation:
  // const response = await fetch(`${seiRpcUrl}/cosmos/bank/v1beta1/balances/${query}`);
  // const data = await response.json();
  
  return [];
}

// Helper function for Redis caching
async function getCachedResults(query: string) {
  // TODO: Implement Redis caching for search results
  // This would cache frequently searched wallets for better performance
  
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;
  
  // Example implementation:
  // const redis = new Redis(redisUrl);
  // const cached = await redis.get(`wallet_search:${query}`);
  // return cached ? JSON.parse(cached) : null;
  
  return null;
}