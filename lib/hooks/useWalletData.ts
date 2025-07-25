import { useState, useEffect } from "react"

interface WalletProfile {
  address: string
  balance: number
  transactions: number
}

export function useWalletData(address: string) {
  const [data, setData] = useState<WalletProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    if (!address) return
    
    async function loadWalletData() {
      try {
        setLoading(true)
        const walletData: WalletProfile = {
          address,
          balance: Math.random() * 1000,
          transactions: Math.floor(Math.random() * 100)
        }
        setData(walletData)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    
    loadWalletData()
  }, [address])
  
  return { data, loading, error }
}