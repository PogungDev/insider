// ============================================================================
// APP CONFIGURATION
// ============================================================================

export const APP_CONFIG = {
  name: 'Sei Insider',
  description: 'Advanced DeFi Analytics & Whale Tracking Platform',
  version: '1.0.0',
  author: 'Sei Insider Team',
  
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 30000,
    retries: 3,
    rateLimit: {
      requests: 1000,
      window: 60000 // 1 minute
    }
  },
  
  // Blockchain Configuration
  blockchain: {
    chainId: 'pacific-1',
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.sei-apis.com',
    explorerUrl: 'https://seitrace.com',
    nativeToken: {
      symbol: 'SEI',
      decimals: 6,
      name: 'Sei'
    }
  },
  
  // Features Configuration
  features: {
    walletTracking: true,
    whaleMonitoring: true,
    devScreener: true,
    alertSystem: true,
    unlockTracker: true,
    apiKeys: true,
    smartContracts: true,
    realTimeUpdates: true,
    aiInsights: true,
    reports: true
  },
  
  // UI Configuration
  ui: {
    theme: {
      default: 'dark',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      }
    },
    layout: {
      sidebar: {
        width: 280,
        collapsedWidth: 80
      },
      header: {
        height: 64
      }
    },
    animations: {
      enabled: true,
      duration: 200
    }
  },
  
  // Data Configuration
  data: {
    pagination: {
      defaultLimit: 20,
      maxLimit: 100
    },
    cache: {
      ttl: 300000, // 5 minutes
      maxSize: 1000
    },
    refresh: {
      interval: 30000, // 30 seconds
      enabled: true
    }
  },
  
  // Security Configuration
  security: {
    apiKeys: {
      prefix: 'sk_',
      length: 32,
      expiryDays: 365
    },
    rateLimit: {
      enabled: true,
      requests: 1000,
      window: 3600000 // 1 hour
    },
    cors: {
      origins: ['http://localhost:3000', 'https://sei-insider.vercel.app'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      headers: ['Content-Type', 'Authorization', 'X-API-Key']
    }
  },
  
  // Monitoring Configuration
  monitoring: {
    alerts: {
      enabled: true,
      channels: ['email', 'telegram', 'discord', 'webhook'],
      retries: 3,
      timeout: 10000
    },
    metrics: {
      enabled: true,
      interval: 60000, // 1 minute
      retention: 2592000000 // 30 days
    },
    logging: {
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      format: 'json',
      maxFiles: 10,
      maxSize: '10m'
    }
  },
  
  // External Services
  services: {
    coingecko: {
      apiUrl: 'https://api.coingecko.com/api/v3',
      enabled: true,
      rateLimit: 50 // requests per minute
    },
    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      enabled: !!process.env.TELEGRAM_BOT_TOKEN
    },
    discord: {
      webhookUrl: process.env.DISCORD_WEBHOOK_URL,
      enabled: !!process.env.DISCORD_WEBHOOK_URL
    },
    email: {
      provider: 'resend',
      apiKey: process.env.RESEND_API_KEY,
      from: 'noreply@sei-insider.com',
      enabled: !!process.env.RESEND_API_KEY
    }
  }
} as const

// ============================================================================
// ROUTE MAPPINGS (Server Actions)
// ============================================================================

export const ROUTE_MAPPINGS = {
  // Wallet Routes
  '/api/search/wallet': 'searchWallets',
  '/api/wallets/profile': 'getWalletProfile',
  
  // Dev Screener Routes
  '/api/screener/dev': 'getDevWallets',
  
  // Whale Routes
  '/api/whales/top': 'getTopWhales',
  
  // Alert Routes
  '/api/alerts/rules': 'getAlertRules',
  '/api/alerts/rules/create': 'createAlertRule',
  '/api/alerts/rules/update': 'updateAlertRule',
  '/api/alerts/rules/delete': 'deleteAlertRule',
  
  // Unlock Routes
  '/api/unlocks/screener': 'getUnlockEvents',
  
  // API Key Routes
  '/api/dev/keys': 'getApiKeys',
  '/api/dev/keys/create': 'createApiKey',
  '/api/dev/keys/update': 'updateApiKey',
  '/api/dev/keys/delete': 'deleteApiKey',
  
  // Analytics Routes
  '/api/analytics': 'getAnalyticsData',
  
  // System Routes
  '/api/status': 'getSystemStatus',
  '/api/tokens': 'getTokenData'
} as const

// ============================================================================
// NAVIGATION CONFIGURATION
// ============================================================================

export const NAVIGATION = {
  main: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview and key metrics'
    },
    {
      title: 'Wallets',
      href: '/dashboard/wallets',
      icon: 'Wallet',
      description: 'Wallet tracking and analysis',
      children: [
        {
          title: 'Search',
          href: '/dashboard/wallets/search',
          description: 'Find and analyze wallets'
        },
        {
          title: 'Watchlist',
          href: '/dashboard/wallets/watchlist',
          description: 'Your tracked wallets'
        }
      ]
    },
    {
      title: 'Whales',
      href: '/dashboard/whales',
      icon: 'TrendingUp',
      description: 'Whale wallet monitoring',
      children: [
        {
          title: 'Top Whales',
          href: '/dashboard/whales/top',
          description: 'Largest wallet holders'
        },
        {
          title: 'Transfers',
          href: '/dashboard/whales/transfers',
          description: 'Large transfer tracking'
        }
      ]
    },
    {
      title: 'Screener',
      href: '/dashboard/screener',
      icon: 'Search',
      description: 'Advanced screening tools',
      children: [
        {
          title: 'Dev Screener',
          href: '/dashboard/screener/dev',
          description: 'Developer wallet analysis'
        },
        {
          title: 'Risk Scanner',
          href: '/dashboard/screener/risk',
          description: 'Risk assessment tools'
        }
      ]
    },
    {
      title: 'Alerts',
      href: '/dashboard/alerts',
      icon: 'Bell',
      description: 'Alert management',
      children: [
        {
          title: 'Rules',
          href: '/dashboard/alerts/rules',
          description: 'Manage alert rules'
        },
        {
          title: 'History',
          href: '/dashboard/alerts/history',
          description: 'Alert history and logs'
        }
      ]
    },
    {
      title: 'Unlocks',
      href: '/dashboard/unlocks',
      icon: 'Unlock',
      description: 'Token unlock tracking',
      children: [
        {
          title: 'Screener',
          href: '/dashboard/unlocks/screener',
          description: 'Upcoming unlock events'
        },
        {
          title: 'Calendar',
          href: '/dashboard/unlocks/calendar',
          description: 'Unlock calendar view'
        }
      ]
    },
    {
      title: 'Patterns',
      href: '/dashboard/patterns',
      icon: 'Activity',
      description: 'Pattern recognition and analysis'
    },
    {
      title: 'Strategy',
      href: '/dashboard/strategy',
      icon: 'Target',
      description: 'Investment strategy tools',
      children: [
        {
          title: 'Compare',
          href: '/dashboard/strategy/compare',
          description: 'Strategy comparison'
        },
        {
          title: 'Backtest',
          href: '/dashboard/strategy/backtest',
          description: 'Strategy backtesting'
        }
      ]
    },
    {
      title: 'Reports',
      href: '/dashboard/reports',
      icon: 'FileText',
      description: 'Report generation',
      children: [
        {
          title: 'New Report',
          href: '/dashboard/reports/new',
          description: 'Create new report'
        },
        {
          title: 'History',
          href: '/dashboard/reports/history',
          description: 'Report history'
        }
      ]
    }
  ],
  
  developer: [
    {
      title: 'API Keys',
      href: '/dashboard/dev/api',
      icon: 'Key',
      description: 'Manage API keys'
    },
    {
      title: 'Documentation',
      href: '/api-docs',
      icon: 'Book',
      description: 'API documentation'
    },
    {
      title: 'Smart Contracts',
      href: '/dashboard/dev/contracts',
      icon: 'Code',
      description: 'Smart contract integration'
    }
  ],
  
  footer: [
    {
      title: 'Behavioral Insights',
      href: '/behavioral-insights',
      description: 'Advanced behavioral analysis'
    },
    {
      title: 'Strategy Intelligence',
      href: '/strategy-intelligence',
      description: 'AI-powered strategy insights'
    },
    {
      title: 'Wallet Profile',
      href: '/wallet-profile',
      description: 'Detailed wallet profiling'
    }
  ]
} as const

// ============================================================================
// CONSTANTS
// ============================================================================

export const CONSTANTS = {
  // Risk Levels
  RISK_LEVELS: {
    LOW: { value: 'low', label: 'Low Risk', color: 'green', threshold: 30 },
    MEDIUM: { value: 'medium', label: 'Medium Risk', color: 'yellow', threshold: 60 },
    HIGH: { value: 'high', label: 'High Risk', color: 'orange', threshold: 80 },
    CRITICAL: { value: 'critical', label: 'Critical Risk', color: 'red', threshold: 100 }
  },
  
  // Wallet Types
  WALLET_TYPES: {
    WHALE: { value: 'whale', label: 'Whale', icon: 'TrendingUp' },
    DEV: { value: 'dev', label: 'Developer', icon: 'Code' },
    USER: { value: 'user', label: 'User', icon: 'User' },
    EXCHANGE: { value: 'exchange', label: 'Exchange', icon: 'Building' },
    CONTRACT: { value: 'contract', label: 'Contract', icon: 'FileCode' }
  },
  
  // Whale Tiers
  WHALE_TIERS: {
    MEGA: { value: 'mega', label: 'Mega Whale', threshold: 10000000, color: 'purple' },
    LARGE: { value: 'large', label: 'Large Whale', threshold: 1000000, color: 'blue' },
    MEDIUM: { value: 'medium', label: 'Medium Whale', threshold: 100000, color: 'cyan' },
    SMALL: { value: 'small', label: 'Small Whale', threshold: 10000, color: 'green' }
  },
  
  // Alert Types
  ALERT_TYPES: {
    TRANSFER: { value: 'transfer_amount', label: 'Large Transfer', icon: 'ArrowRightLeft' },
    BALANCE: { value: 'wallet_balance', label: 'Balance Change', icon: 'Wallet' },
    PRICE: { value: 'price_change', label: 'Price Movement', icon: 'TrendingUp' },
    VOLUME: { value: 'volume_spike', label: 'Volume Spike', icon: 'BarChart3' },
    UNLOCK: { value: 'token_unlock', label: 'Token Unlock', icon: 'Unlock' },
    RUGPULL: { value: 'rugpull_risk', label: 'Rug Pull Risk', icon: 'AlertTriangle' }
  },
  
  // Unlock Categories
  UNLOCK_CATEGORIES: {
    TEAM: { value: 'team', label: 'Team', color: 'blue' },
    INVESTOR: { value: 'investor', label: 'Investor', color: 'green' },
    ADVISOR: { value: 'advisor', label: 'Advisor', color: 'purple' },
    ECOSYSTEM: { value: 'ecosystem', label: 'Ecosystem', color: 'orange' },
    COMMUNITY: { value: 'community', label: 'Community', color: 'cyan' }
  },
  
  // Time Frames
  TIME_FRAMES: {
    '1h': { label: '1 Hour', value: '1h' },
    '24h': { label: '24 Hours', value: '24h' },
    '7d': { label: '7 Days', value: '7d' },
    '30d': { label: '30 Days', value: '30d' },
    '90d': { label: '90 Days', value: '90d' },
    '1y': { label: '1 Year', value: '1y' }
  },
  
  // API Permissions
  API_PERMISSIONS: {
    'wallets:read': 'Read wallet data',
    'wallets:write': 'Modify wallet data',
    'alerts:read': 'Read alert data',
    'alerts:write': 'Manage alerts',
    'analytics:read': 'Access analytics',
    'reports:read': 'Read reports',
    'reports:write': 'Generate reports',
    'admin:read': 'Admin read access',
    'admin:write': 'Admin write access'
  }
} as const

// ============================================================================
// ENVIRONMENT HELPERS
// ============================================================================

export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // API Keys
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  resendApiKey: process.env.RESEND_API_KEY,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
  
  // Blockchain
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  
  // External APIs
  coingeckoApiKey: process.env.COINGECKO_API_KEY,
  
  // Monitoring
  sentryDsn: process.env.SENTRY_DSN,
  
  // Deployment
  vercelUrl: process.env.VERCEL_URL,
  deploymentUrl: process.env.NEXT_PUBLIC_DEPLOYMENT_URL
} as const

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getApiUrl(endpoint: string): string {
  const baseUrl = ENV.vercelUrl 
    ? `https://${ENV.vercelUrl}` 
    : ENV.deploymentUrl 
    ? ENV.deploymentUrl 
    : APP_CONFIG.api.baseUrl
  
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
}

export function getRiskLevel(score: number): keyof typeof CONSTANTS.RISK_LEVELS {
  if (score <= CONSTANTS.RISK_LEVELS.LOW.threshold) return 'LOW'
  if (score <= CONSTANTS.RISK_LEVELS.MEDIUM.threshold) return 'MEDIUM'
  if (score <= CONSTANTS.RISK_LEVELS.HIGH.threshold) return 'HIGH'
  return 'CRITICAL'
}

export function getWhaleTier(balance: number): keyof typeof CONSTANTS.WHALE_TIERS {
  if (balance >= CONSTANTS.WHALE_TIERS.MEGA.threshold) return 'MEGA'
  if (balance >= CONSTANTS.WHALE_TIERS.LARGE.threshold) return 'LARGE'
  if (balance >= CONSTANTS.WHALE_TIERS.MEDIUM.threshold) return 'MEDIUM'
  return 'SMALL'
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatNumber(num: number, decimals: number = 2): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(decimals) + 'B'
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(decimals) + 'M'
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(decimals) + 'K'
  }
  return num.toFixed(decimals)
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  if (diffMinutes > 0) return `${diffMinutes}m ago`
  return `${diffSeconds}s ago`
}