'use client';

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";

interface WalletAnalysisData {
  address: string;
  label?: string;
  lastAnalyzed: number;
  analysisStatus: 'idle' | 'analyzing' | 'completed' | 'error';
  behaviorScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  totalTransactions?: number;
  totalVolume?: number;
}

interface WalletContextType {
  connectedWallet: string;
  selectedWallet: string;
  setSelectedWallet: Dispatch<SetStateAction<string>>;
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  // Analysis-specific state
  targetWallet: string | null;
  setTargetWallet: (address: string | null) => void;
  analysisData: WalletAnalysisData | null;
  setAnalysisData: Dispatch<SetStateAction<WalletAnalysisData | null>>;
  analysisHistory: WalletAnalysisData[];
  isAnalyzing: boolean;
  startAnalysis: (address: string) => void;
  stopAnalysis: () => void;
}


const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connectedWallet, setConnectedWallet] = useState("")
  const [selectedWallet, setSelectedWallet] = useState("")
  
  // Analysis-specific state
  const [targetWallet, setTargetWallet] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<WalletAnalysisData | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<WalletAnalysisData[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  useEffect(() => {
    // Ensure this code only runs in the browser
    if (typeof window !== 'undefined') {
      // Load wallet from localStorage
      const savedWallet = localStorage.getItem("connectedWallet")
      if (savedWallet) {
        setConnectedWallet(savedWallet)
      }
      
      // Load analysis history
      const savedHistory = localStorage.getItem("walletAnalysisHistory")
      if (savedHistory) {
        try {
          setAnalysisHistory(JSON.parse(savedHistory))
        } catch (error) {
          console.error('Failed to parse analysis history:', error)
        }
      }
    }
  }, [])
  
  const connectWallet = (address: string) => {
    setConnectedWallet(address)
    if (typeof window !== 'undefined') {
      localStorage.setItem("connectedWallet", address)
    }
  }
  
  const disconnectWallet = () => {
    setConnectedWallet("")
    if (typeof window !== 'undefined') {
      localStorage.removeItem("connectedWallet")
    }
  }

  const startAnalysis = (address: string) => {
    setTargetWallet(address)
    setIsAnalyzing(true)
    
    // Create initial analysis data
    const newAnalysisData: WalletAnalysisData = {
      address,
      lastAnalyzed: Date.now(),
      analysisStatus: 'analyzing'
    }
    
    setAnalysisData(newAnalysisData)
    
    // Simulate analysis completion (replace with real API call)
    setTimeout(() => {
      const completedAnalysis: WalletAnalysisData = {
        ...newAnalysisData,
        analysisStatus: 'completed',
        behaviorScore: Math.floor(Math.random() * 100),
        riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        totalTransactions: Math.floor(Math.random() * 10000),
        totalVolume: Math.floor(Math.random() * 1000000)
      }
      
      setAnalysisData(completedAnalysis)
      setIsAnalyzing(false)
      
      // Add to history
      setAnalysisHistory(prev => {
        const updated = [completedAnalysis, ...prev.filter(item => item.address !== address)].slice(0, 10)
        if (typeof window !== 'undefined') {
          localStorage.setItem("walletAnalysisHistory", JSON.stringify(updated))
        }
        return updated
      })
    }, 2000)
  }

  const stopAnalysis = () => {
    setTargetWallet(null)
    setAnalysisData(null)
    setIsAnalyzing(false)
  }
  
  return (
    <WalletContext.Provider value={{
      connectedWallet,
      selectedWallet,
      setSelectedWallet,
      connectWallet,
      disconnectWallet,
      targetWallet,
      setTargetWallet,
      analysisData,
      setAnalysisData,
      analysisHistory,
      isAnalyzing,
      startAnalysis,
      stopAnalysis
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
