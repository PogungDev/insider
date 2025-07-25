import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, polygon, bsc } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Sei Network configuration
const seiTestnet = {
  id: 713715,
  name: 'Sei Testnet',
  network: 'sei-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SEI',
    symbol: 'SEI',
  },
  rpcUrls: {
    default: {
      http: ['https://evm-rpc-testnet.sei-apis.com'],
    },
    public: {
      http: ['https://evm-rpc-testnet.sei-apis.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Seitrace', url: 'https://seitrace.com' },
  },
  testnet: true,
} as const

const seiMainnet = {
  id: 1329,
  name: 'Sei Network',
  network: 'sei-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SEI',
    symbol: 'SEI',
  },
  rpcUrls: {
    default: {
      http: ['https://evm-rpc.sei-apis.com'],
    },
    public: {
      http: ['https://evm-rpc.sei-apis.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Seitrace', url: 'https://seitrace.com' },
  },
} as const

// WalletConnect project ID (you should get this from WalletConnect Cloud)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id'

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, bsc, seiTestnet, seiMainnet],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [seiTestnet.id]: http('https://evm-rpc-testnet.sei-apis.com'),
    [seiMainnet.id]: http('https://evm-rpc.sei-apis.com'),
  },
})

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  [sepolia.id]: {
    InsiderAnalytics: process.env.NEXT_PUBLIC_INSIDER_ANALYTICS_SEPOLIA || '',
  },
  [seiTestnet.id]: {
    InsiderAnalytics: process.env.NEXT_PUBLIC_INSIDER_ANALYTICS_SEI_TESTNET || '',
  },
  [seiMainnet.id]: {
    InsiderAnalytics: process.env.NEXT_PUBLIC_INSIDER_ANALYTICS_SEI_MAINNET || '',
  },
  [polygon.id]: {
    InsiderAnalytics: process.env.NEXT_PUBLIC_INSIDER_ANALYTICS_POLYGON || '',
  },
  [bsc.id]: {
    InsiderAnalytics: process.env.NEXT_PUBLIC_INSIDER_ANALYTICS_BSC || '',
  },
} as const

// Supported networks for the application
export const SUPPORTED_NETWORKS = [sepolia.id, seiTestnet.id, seiMainnet.id, polygon.id, bsc.id]

// Network names mapping
export const NETWORK_NAMES = {
  [mainnet.id]: 'Ethereum Mainnet',
  [sepolia.id]: 'Sepolia Testnet',
  [polygon.id]: 'Polygon',
  [bsc.id]: 'BNB Smart Chain',
  [seiTestnet.id]: 'Sei Testnet',
  [seiMainnet.id]: 'Sei Network',
} as const

// Default network (Sei Testnet for development)
export const DEFAULT_NETWORK = seiTestnet.id

// Gas settings for different networks
export const GAS_SETTINGS = {
  [sepolia.id]: {
    gasPrice: '20000000000', // 20 gwei
    gasLimit: '500000',
  },
  [seiTestnet.id]: {
    gasPrice: '10000000000', // 10 gwei
    gasLimit: '500000',
  },
  [seiMainnet.id]: {
    gasPrice: '10000000000', // 10 gwei
    gasLimit: '500000',
  },
  [polygon.id]: {
    gasPrice: '30000000000', // 30 gwei
    gasLimit: '500000',
  },
  [bsc.id]: {
    gasPrice: '5000000000', // 5 gwei
    gasLimit: '500000',
  },
} as const

export { seiTestnet, seiMainnet }