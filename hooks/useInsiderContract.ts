"use client";

import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, Contract, Signer } from 'ethers';
import { useToast } from '@/hooks/use-toast';

// Import ABI (this would be generated after contract compilation)
const INSIDER_ANALYTICS_ABI = [
  // Events
  "event WalletRegistered(address indexed wallet, uint256 timestamp)",
  "event AnomalyDetected(address indexed wallet, string anomalyType, uint256 severity, uint256 timestamp)",
  "event AlertTriggered(address indexed wallet, string alertType, uint256 threshold, uint256 actualValue)",
  "event RiskScoreUpdated(address indexed wallet, uint256 oldScore, uint256 newScore)",
  "event TokenUnlockScheduled(address indexed token, uint256 unlockTime, uint256 amount)",
  
  // Read functions
  "function walletProfiles(address) view returns (bool isRegistered, uint256 riskScore, uint256 totalTransactions, uint256 lastActivity, uint256 defiInteractions, bool isWhale)",
  "function getWalletRisk(address wallet) view returns (uint256 riskScore, bool isHighRisk, bool isWhale, uint256 anomalyCount)",
  "function getWalletAnomalies(address wallet) view returns (tuple(string anomalyType, uint256 severity, uint256 timestamp, bool isResolved, string metadata)[])",
  "function getUpcomingUnlocks(uint256 timeframe) view returns (tuple(address token, uint256 unlockTime, uint256 amount, address beneficiary, bool isExecuted, uint256 impactScore)[])",
  "function authorizedAnalyzers(address) view returns (bool)",
  "function nextUnlockId() view returns (uint256)",
  "function WHALE_THRESHOLD() view returns (uint256)",
  "function HIGH_RISK_THRESHOLD() view returns (uint256)",
  "function owner() view returns (address)",
  
  // Write functions
  "function registerWallet(address wallet)",
  "function updateRiskScore(address wallet, uint256 newScore)",
  "function recordAnomaly(address wallet, string anomalyType, uint256 severity, string metadata)",
  "function scheduleTokenUnlock(address token, uint256 unlockTime, uint256 amount, address beneficiary, uint256 impactScore)",
  "function updateWhaleStatus(address wallet, bool isWhale)",
  "function updateWalletMetrics(address wallet, uint256 transactionCount, uint256 defiInteractions)",
  "function resolveAnomaly(address wallet, uint256 anomalyIndex)",
  "function addAuthorizedAnalyzer(address analyzer)",
  "function removeAuthorizedAnalyzer(address analyzer)"
];

interface UseInsiderContractReturn {
  contract: Contract | null;
  provider: BrowserProvider | null;
  signer: Signer | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Contract functions
  registerWallet: (walletAddress: string) => Promise<any>;
  getWalletRisk: (walletAddress: string) => Promise<any>;
  getWalletAnomalies: (walletAddress: string) => Promise<any[]>;
  getUpcomingUnlocks: (timeframe: number) => Promise<any[]>;
  updateRiskScore: (walletAddress: string, newScore: number) => Promise<any>;
  recordAnomaly: (walletAddress: string, anomalyType: string, severity: number, metadata: string) => Promise<any>;
  scheduleTokenUnlock: (token: string, unlockTime: number, amount: string, beneficiary: string, impactScore: number) => Promise<any>;
  
  // Utility functions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  refreshConnection: () => Promise<void>;
}

export function useInsiderContract(): UseInsiderContractReturn {
  const { toast } = useToast();
  
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contract address (should be set via environment variable)
  const contractAddress = process.env.NEXT_PUBLIC_INSIDER_ANALYTICS_ADDRESS;

  // Initialize provider and contract
  const initializeContract = useCallback(async () => {
    if (!contractAddress) {
      setError('Contract address not configured');
      return;
    }

    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const web3Provider = new BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        const network = await web3Provider.getNetwork();
        const accounts = await web3Provider.listAccounts();

        setProvider(web3Provider);
        setSigner(web3Signer);
        setChainId(Number(network.chainId));
        
        if (accounts.length > 0) {
          setAccount(accounts[0] as unknown as string);
          setIsConnected(true);
          
          // Initialize contract with signer
          const contractInstance = new Contract(
            contractAddress,
            INSIDER_ANALYTICS_ABI,
            web3Signer
          );
          setContract(contractInstance);
        }
        
        setError(null);
      } else {
        setError('MetaMask not detected');
      }
    } catch (err: any) {
      console.error('Error initializing contract:', err);
      setError(err.message || 'Failed to initialize contract');
    }
  }, [contractAddress]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Web3 wallet",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await initializeContract();
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to smart contract"
      });
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      toast({
        title: "Connection Failed",
        description: err.message || 'Failed to connect wallet',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [initializeContract, toast]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    setError(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from smart contract"
    });
  }, [toast]);

  // Switch network
  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (err: any) {
      console.error('Error switching network:', err);
      toast({
        title: "Network Switch Failed",
        description: err.message || 'Failed to switch network',
        variant: "destructive"
      });
    }
  }, [toast]);

  // Refresh connection
  const refreshConnection = useCallback(async () => {
    setIsLoading(true);
    await initializeContract();
    setIsLoading(false);
  }, [initializeContract]);

  // Contract function wrappers
  const registerWallet = useCallback(async (walletAddress: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await contract.registerWallet(walletAddress);
      toast({
        title: "Transaction Sent",
        description: "Wallet registration transaction submitted"
      });
      return tx;
    } catch (err: any) {
      console.error('Error registering wallet:', err);
      toast({
        title: "Registration Failed",
        description: err.reason || err.message || 'Failed to register wallet',
        variant: "destructive"
      });
      throw err;
    }
  }, [contract, toast]);

  const getWalletRisk = useCallback(async (walletAddress: string) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.getWalletRisk(walletAddress);
  }, [contract]);

  const getWalletAnomalies = useCallback(async (walletAddress: string) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.getWalletAnomalies(walletAddress);
  }, [contract]);

  const getUpcomingUnlocks = useCallback(async (timeframe: number) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.getUpcomingUnlocks(timeframe);
  }, [contract]);

  const updateRiskScore = useCallback(async (walletAddress: string, newScore: number) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await contract.updateRiskScore(walletAddress, newScore);
      toast({
        title: "Transaction Sent",
        description: "Risk score update transaction submitted"
      });
      return tx;
    } catch (err: any) {
      console.error('Error updating risk score:', err);
      toast({
        title: "Update Failed",
        description: err.reason || err.message || 'Failed to update risk score',
        variant: "destructive"
      });
      throw err;
    }
  }, [contract, toast]);

  const recordAnomaly = useCallback(async (
    walletAddress: string, 
    anomalyType: string, 
    severity: number, 
    metadata: string
  ) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await contract.recordAnomaly(walletAddress, anomalyType, severity, metadata);
      toast({
        title: "Transaction Sent",
        description: "Anomaly record transaction submitted"
      });
      return tx;
    } catch (err: any) {
      console.error('Error recording anomaly:', err);
      toast({
        title: "Record Failed",
        description: err.reason || err.message || 'Failed to record anomaly',
        variant: "destructive"
      });
      throw err;
    }
  }, [contract, toast]);

  const scheduleTokenUnlock = useCallback(async (
    token: string,
    unlockTime: number,
    amount: string,
    beneficiary: string,
    impactScore: number
  ) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await contract.scheduleTokenUnlock(token, unlockTime, amount, beneficiary, impactScore);
      toast({
        title: "Transaction Sent",
        description: "Token unlock schedule transaction submitted"
      });
      return tx;
    } catch (err: any) {
      console.error('Error scheduling token unlock:', err);
      toast({
        title: "Schedule Failed",
        description: err.reason || err.message || 'Failed to schedule token unlock',
        variant: "destructive"
      });
      throw err;
    }
  }, [contract, toast]);

  // Event listeners
  useEffect(() => {
    if (contract) {
      // Listen for wallet registration events
      const onWalletRegistered = (wallet: string, timestamp: bigint) => {
        console.log('Wallet registered:', wallet, timestamp.toString());
        toast({
          title: "Wallet Registered",
          description: `Wallet ${wallet.slice(0, 10)}... has been registered`
        });
      };

      // Listen for anomaly detection events
      const onAnomalyDetected = (
        wallet: string, 
        anomalyType: string, 
        severity: bigint, 
        timestamp: bigint
      ) => {
        console.log('Anomaly detected:', { wallet, anomalyType, severity: severity.toString() });
        toast({
          title: "Anomaly Detected",
          description: `${anomalyType} detected for wallet ${wallet.slice(0, 10)}...`,
          variant: Number(severity) >= 4 ? "destructive" : "default"
        });
      };

      // Listen for risk score updates
      const onRiskScoreUpdated = (
        wallet: string, 
        oldScore: bigint, 
        newScore: bigint
      ) => {
        console.log('Risk score updated:', { wallet, oldScore: oldScore.toString(), newScore: newScore.toString() });
        toast({
          title: "Risk Score Updated",
          description: `Risk score for ${wallet.slice(0, 10)}... updated to ${newScore.toString()}`
        });
      };

      // Attach event listeners
      contract.on('WalletRegistered', onWalletRegistered);
      contract.on('AnomalyDetected', onAnomalyDetected);
      contract.on('RiskScoreUpdated', onRiskScoreUpdated);

      // Cleanup function
      return () => {
        contract.off('WalletRegistered', onWalletRegistered);
        contract.off('AnomalyDetected', onAnomalyDetected);
        contract.off('RiskScoreUpdated', onRiskScoreUpdated);
      };
    }
  }, [contract, toast]);

  // Handle account and network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
          initializeContract();
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16));
        initializeContract();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [disconnectWallet, initializeContract]);

  // Initialize on mount
  useEffect(() => {
    initializeContract();
  }, [initializeContract]);

  return {
    contract,
    provider,
    signer,
    account,
    chainId,
    isConnected,
    isLoading,
    error,
    
    // Contract functions
    registerWallet,
    getWalletRisk,
    getWalletAnomalies,
    getUpcomingUnlocks,
    updateRiskScore,
    recordAnomaly,
    scheduleTokenUnlock,
    
    // Utility functions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshConnection
  };
}

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}