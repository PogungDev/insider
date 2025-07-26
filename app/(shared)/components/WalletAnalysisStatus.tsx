"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Target, CheckCircle, AlertCircle, Clock, TrendingUp, Shield, Activity, X } from "lucide-react"
import { useWallet } from "@/app/(core)/providers/WalletProvider"

export function WalletAnalysisStatus() {
  const { targetWallet, analysisData, isAnalyzing, stopAnalysis } = useWallet()

  if (!targetWallet && !analysisData) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Target className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Wallet Selected</h3>
          <p className="text-sm text-gray-500 text-center">
            Select a wallet address to begin behavioral analysis
          </p>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = () => {
    if (isAnalyzing) return <Clock className="h-5 w-5 text-blue-500 animate-spin" />
    if (analysisData?.analysisStatus === 'completed') return <CheckCircle className="h-5 w-5 text-green-500" />
    if (analysisData?.analysisStatus === 'error') return <AlertCircle className="h-5 w-5 text-red-500" />
    return <Brain className="h-5 w-5 text-gray-500" />
  }

  const getStatusText = () => {
    if (isAnalyzing) return 'Analyzing...'
    if (analysisData?.analysisStatus === 'completed') return 'Analysis Complete'
    if (analysisData?.analysisStatus === 'error') return 'Analysis Failed'
    return 'Ready'
  }

  const getStatusColor = () => {
    if (isAnalyzing) return 'bg-blue-100 text-blue-800'
    if (analysisData?.analysisStatus === 'completed') return 'bg-green-100 text-green-800'
    if (analysisData?.analysisStatus === 'error') return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getRiskBadgeColor = (risk?: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">Wallet Analysis</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor()}>
              {getStatusText()}
            </Badge>
            {(targetWallet || analysisData) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={stopAnalysis}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          {targetWallet && (
            <span className="font-mono text-xs break-all">
              {targetWallet}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      
      {isAnalyzing && (
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analysis Progress</span>
                <span>Processing...</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span>Scanning transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span>Analyzing patterns</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Risk assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span>Behavior scoring</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
      
      {analysisData?.analysisStatus === 'completed' && (
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Behavior Score</div>
              <div className="text-2xl font-bold text-blue-600">
                {analysisData.behaviorScore}/100
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Risk Level</div>
              <Badge className={getRiskBadgeColor(analysisData.riskLevel)}>
                {analysisData.riskLevel?.toUpperCase()} RISK
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Total Transactions</div>
              <div className="text-lg font-semibold">
                {analysisData.totalTransactions ? analysisData.totalTransactions.toLocaleString() : '0'}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Total Volume</div>
              <div className="text-lg font-semibold">
                ${analysisData.totalVolume ? analysisData.totalVolume.toLocaleString() : '0'}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-gray-500">
              Last analyzed: {new Date(analysisData.lastAnalyzed).toLocaleString()}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
