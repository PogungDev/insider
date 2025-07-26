// ============================================================================
// ROUTE MAPPINGS - API to Server Actions
// ============================================================================

export const ROUTE_MAPPINGS = {
  '/api/search/wallet': 'searchWallet',
  '/api/screener/dev': 'screenDevelopers',
  '/api/whales/top': 'getTopWhales',
  '/api/alerts/rules': 'getAlertRules',
  '/api/unlocks/screener': 'screenUnlocks',
  '/api/dev/keys': 'getApiKeys',
  '/api/status': 'getSystemStatus',
  '/api/tokens': 'getTokens',
  '/api/analytics/global': 'getGlobalAnalytics',
  '/api/wallet/intelligence': 'getWalletIntelligence',
  '/api/risk/monitor': 'getRiskMonitor',
  '/api/capital/flow': 'getCapitalFlow',
  '/api/behavioral/dna': 'getBehavioralDNA',
  '/api/alpha/synthesis': 'getAlphaSynthesis'
} as const

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

export const APP_CONFIG = {
  name: 'Insider Analytics',
  version: '1.0.0',
  description: 'Ultra-Dense Architecture for Web3 Intelligence',
  
  // Security Configuration
  security: {
    // Rate Limiting
    rateLimit: {
      enabled: true,
      requests: 1000, // requests per window
      window: 60 * 60 * 1000, // 1 hour in milliseconds
    },
    
    // API Keys
    apiKeys: {
      prefix: 'insider_',
      length: 32,
      algorithm: 'sha256'
    },
    
    // CORS Configuration
    cors: {
      origins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://insider-analytics.vercel.app',
        'https://*.insider-analytics.com'
      ] as readonly string[],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: [
        'Content-Type',
        'Authorization',
        'X-API-Key',
        'X-Requested-With',
        'Accept',
        'Origin'
      ]
    },
    
    // Session Configuration
    session: {
      secret: process.env.SESSION_SECRET || 'insider-ultra-dense-secret-key',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict' as const
    }
  },
  
  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/insider',
    pool: {
      min: 2,
      max: 10,
      idle: 10000
    }
  },
  
  // Cache Configuration
  cache: {
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      ttl: 300, // 5 minutes default TTL
      maxMemory: '100mb'
    }
  },
  
  // Blockchain Configuration
  blockchain: {
    networks: {
      ethereum: {
        rpc: process.env.ETHEREUM_RPC_URL || 'https://eth-mainnet.alchemyapi.io/v2/demo',
        chainId: 1,
        blockTime: 12000
      },
      polygon: {
        rpc: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
        chainId: 137,
        blockTime: 2000
      },
      arbitrum: {
        rpc: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
        chainId: 42161,
        blockTime: 1000
      }
    }
  },
  
  // Feature Flags
  features: {
    walletIntelligence: true,
    riskRadar: true,
    capitalFlow: true,
    behavioralDNA: true,
    alphaSynthesis: true,
    realTimeAlerts: true,
    advancedAnalytics: true
  },
  
  // Ultra-Dense Architecture Settings
  ultraDense: {
    maxConcurrentConnections: 10000,
    dataCompressionLevel: 9,
    cacheStrategy: 'aggressive',
    realTimeUpdates: true,
    batchProcessing: {
      enabled: true,
      batchSize: 1000,
      interval: 5000 // 5 seconds
    }
  }
} as const

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type RouteMapping = typeof ROUTE_MAPPINGS
export type AppConfig = typeof APP_CONFIG
export type NetworkConfig = typeof APP_CONFIG.blockchain.networks
export type SecurityConfig = typeof APP_CONFIG.security