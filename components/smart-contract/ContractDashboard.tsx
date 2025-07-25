"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
 
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useInsiderContract } from '@/hooks/useInsiderContract';
import { formatDistanceToNow } from 'date-fns';

interface WalletRisk {
  riskScore: number;
  isHighRisk: boolean;
  isWhale: boolean;
  anomalyCount: number;
}

interface Anomaly {
  anomalyType: string;
  severity: number;
  timestamp: number;
  isResolved: boolean;
  metadata: string;
}

interface TokenUnlock {
  token: string;
  unlockTime: number;
  amount: string;
  beneficiary: string;
  impactScore: number;
  isExecuted: boolean;
}

interface ContractDashboardProps {
  walletAddress: string;
}

export function ContractDashboard({ walletAddress }: ContractDashboardProps) {
  const { toast } = useToast();
  const {
    contract,
    registerWallet,
    getWalletRisk,
    getWalletAnomalies,
    getUpcomingUnlocks,
    isConnected,
    isLoading
  } = useInsiderContract();

  const [walletRisk, setWalletRisk] = useState<WalletRisk | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [upcomingUnlocks, setUpcomingUnlocks] = useState<TokenUnlock[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load wallet data
  const loadWalletData = async () => {
    if (!contract || !walletAddress) return;
    
    setLoading(true);
    try {
      // Check if wallet is registered
      const profile = await contract.walletProfiles(walletAddress);
      setIsRegistered(profile.isRegistered);
      
      if (profile.isRegistered) {
        // Get risk assessment
        const risk = await getWalletRisk(walletAddress);
        setWalletRisk({
          riskScore: risk.riskScore.toNumber(),
          isHighRisk: risk.isHighRisk,
          isWhale: risk.isWhale,
          anomalyCount: risk.anomalyCount.toNumber()
        });
        
        // Get anomalies
        const walletAnomalies = await getWalletAnomalies(walletAddress);
        setAnomalies(walletAnomalies.map((anomaly: any) => ({
          anomalyType: anomaly.anomalyType,
          severity: anomaly.severity,
          timestamp: anomaly.timestamp.toNumber(),
          isResolved: anomaly.isResolved,
          metadata: anomaly.metadata
        })));
      }
      
      // Get upcoming unlocks (24 hours)
      const unlocks = await getUpcomingUnlocks(86400);
      setUpcomingUnlocks(unlocks.map((unlock: any) => ({
        token: unlock.token,
        unlockTime: unlock.unlockTime.toNumber(),
        amount: unlock.amount.toString(),
        beneficiary: unlock.beneficiary,
        impactScore: unlock.impactScore.toNumber(),
        isExecuted: unlock.isExecuted
      })));
      
    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet data from smart contract",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Register wallet
  const handleRegisterWallet = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    try {
      await registerWallet(walletAddress);
      toast({
        title: "Success",
        description: "Wallet registered successfully for smart contract monitoring"
      });
      await loadWalletData();
    } catch (error) {
      console.error('Error registering wallet:', error);
      toast({
        title: "Error",
        description: "Failed to register wallet",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWalletData();
    setRefreshing(false);
  };

  // Load data on component mount
  useEffect(() => {
    if (isConnected && walletAddress) {
      loadWalletData();
    }
  }, [isConnected, walletAddress, contract]);

  // Risk score color
  const getRiskColor = (score: number) => {
    if (score >= 700) return 'text-red-500';
    if (score >= 400) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Risk level text
  const getRiskLevel = (score: number) => {
    if (score >= 700) return 'High Risk';
    if (score >= 400) return 'Medium Risk';
    return 'Low Risk';
  };

  // Severity badge variant
  const getSeverityVariant = (severity: number) => {
    if (severity >= 4) return 'destructive';
    if (severity >= 3) return 'default';
    return 'secondary';
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to access smart contract features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading && !walletRisk) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading smart contract data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isRegistered) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Smart Contract Registration</span>
          </CardTitle>
          <CardDescription>
            Register your wallet for advanced on-chain analytics and monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your wallet is not registered for smart contract monitoring. 
                Register to access advanced features like risk scoring, anomaly detection, and unlock tracking.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleRegisterWallet} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register Wallet'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Contract Analytics</h2>
          <p className="text-muted-foreground">On-chain monitoring and risk assessment</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Risk Overview */}
      {walletRisk && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Risk Score</span>
              </div>
              <div className="mt-2">
                <div className={`text-2xl font-bold ${getRiskColor(walletRisk.riskScore)}`}>
                  {walletRisk.riskScore}/1000
                </div>
                <div className="text-sm text-muted-foreground">
                  {getRiskLevel(walletRisk.riskScore)}
                </div>
                <Progress 
                  value={walletRisk.riskScore / 10} 
                  className="mt-2" 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Whale Status</span>
              </div>
              <div className="mt-2">
                <Badge variant={walletRisk.isWhale ? "default" : "secondary"}>
                  {walletRisk.isWhale ? "Whale" : "Regular"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Anomalies</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{walletRisk.anomalyCount}</div>
                <div className="text-sm text-muted-foreground">Detected</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Risk Level</span>
              </div>
              <div className="mt-2">
                <Badge variant={walletRisk.isHighRisk ? "destructive" : "default"}>
                  {walletRisk.isHighRisk ? "High Risk" : "Normal"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics */}
      <Tabs defaultValue="anomalies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="unlocks">Token Unlocks</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Detected Anomalies</span>
              </CardTitle>
              <CardDescription>
                AI-powered anomaly detection from smart contract monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              {anomalies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No anomalies detected</p>
                  <p className="text-sm">Your wallet activity appears normal</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {anomalies.map((anomaly, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getSeverityVariant(anomaly.severity)}>
                            Severity {anomaly.severity}
                          </Badge>
                          <span className="font-medium">{anomaly.anomalyType}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {anomaly.isResolved ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(anomaly.timestamp * 1000), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{anomaly.metadata}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unlocks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Upcoming Token Unlocks</span>
              </CardTitle>
              <CardDescription>
                Scheduled token unlock events in the next 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingUnlocks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>No upcoming unlocks</p>
                  <p className="text-sm">No token unlocks scheduled in the next 24 hours</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingUnlocks.map((unlock, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">Token: {unlock.token.slice(0, 10)}...</div>
                          <div className="text-sm text-muted-foreground">
                            Beneficiary: {unlock.beneficiary.slice(0, 10)}...
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {(parseInt(unlock.amount) / 1e18).toLocaleString()} tokens
                          </div>
                          <Badge variant={unlock.impactScore >= 700 ? "destructive" : "default"}>
                            Impact: {unlock.impactScore}/1000
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Unlock: {new Date(unlock.unlockTime * 1000).toLocaleString()}
                        </span>
                        <span className={unlock.isExecuted ? "text-green-500" : "text-orange-500"}>
                          {unlock.isExecuted ? "Executed" : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Smart Contract Activity</span>
              </CardTitle>
              <CardDescription>
                Recent interactions and updates from the smart contract
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Wallet Registered</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your wallet has been successfully registered for smart contract monitoring
                  </p>
                </div>
                
                {walletRisk && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Risk Assessment Updated</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Current risk score: {walletRisk.riskScore}/1000 ({getRiskLevel(walletRisk.riskScore)})
                    </p>
                  </div>
                )}
                
                {walletRisk?.isWhale && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Whale Status Detected</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This wallet has been identified as a whale based on holdings and activity
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}