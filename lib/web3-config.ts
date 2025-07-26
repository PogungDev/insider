import { createConfig, http, fallback } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains' // Adjust chains as needed, e.g., include Sei if available
import { QueryClient } from '@tanstack/react-query'

// Create config with fallback providers and better error handling
export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: fallback([
      http('https://eth-mainnet.g.alchemy.com/v2/demo', {
        batch: true,
        retryCount: 3,
        retryDelay: 1000,
        timeout: 10000,
      }),
      http('https://cloudflare-eth.com', {
        batch: true,
        retryCount: 3,
        retryDelay: 1000,
        timeout: 10000,
      }),
    ], { rank: true }),
    [sepolia.id]: fallback([
      http('https://eth-sepolia.g.alchemy.com/v2/demo', {
        batch: true,
        retryCount: 3,
        retryDelay: 1000,
        timeout: 10000,
      }),
      http('https://rpc.sepolia.org', {
        batch: true,
        retryCount: 3,
        retryDelay: 1000,
        timeout: 10000,
      }),
    ], { rank: true }),
  },
  syncConnectedChain: true,
  batch: {
    multicall: true
  },
  multiInjectedProviderDiscovery: true,
  pollingInterval: 5000,
})

// Configure QueryClient with retry logic
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      // Prevent unnecessary refetches
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
})