"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, TrendingUp, TrendingDown, Target, Zap, AlertTriangle, CheckCircle, XCircle, BarChart3, Activity, Clock, Cpu, Database, LineChart } from "lucide-react"
import { useWallet } from '@/app/(core)/providers/WalletProvider'

interface PredictionModel {
  id: string
  name: string
  type: 'price' | 'behavior' | 'risk' | 'sentiment'
  accuracy: number
  confidence: number
  timeframe: string
  status: 'active' | 'training' | 'paused'
  lastUpdated: number
  predictions: number
  successRate: number
  description: string
}

interface Prediction {
  id: string
  modelId: string
  target: string
  prediction: string
  confidence: number
  probability: number
  timeframe: string
  createdAt: number
  status: 'pending' | 'confirmed' | 'failed'
  actualOutcome?: string
  accuracy?: number
}

interface ModelMetrics {
  modelId: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  mse: number
  mae: number
  trainingTime: number
  dataPoints: number
  features: number
}

interface FeatureImportance {
  feature: string
  importance: number
  category: 'technical' | 'behavioral' | 'social' | 'onchain'
  description: string
}

function PredictiveModel() {
  const { targetWallet, analysisData } = useWallet()
  const [selectedModel, setSelectedModel] = useState("price_lstm")
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [models, setModels] = useState<PredictionModel[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [metrics, setMetrics] = useState<ModelMetrics[]>([])
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([])
  const [isTraining, setIsTraining] = useState(false)

  // Mock data for demo
  const mockModels: PredictionModel[] = [
    {
      id: 'price_lstm',
      name: 'Price LSTM Neural Network',
      type: 'price',
      accuracy: 87.5,
      confidence: 92,
      timeframe: '1h-24h',
      status: 'active',
      lastUpdated: Date.now() - 1800000,
      predictions: 1247,
      successRate: 85.2,
      description: 'Deep learning model for price prediction using LSTM'
    },
    {
      id: 'behavior_rf',
      name: 'Behavioral Random Forest',
      type: 'behavior',
      accuracy: 82.1,
      confidence: 88,
      timeframe: '4h-7d',
      status: 'active',
      lastUpdated: Date.now() - 3600000,
      predictions: 892,
      successRate: 79.8,
      description: 'Ensemble model for trading behavior prediction'
    },
    {
      id: 'risk_svm',
      name: 'Risk Assessment SVM',
      type: 'risk',
      accuracy: 91.3,
      confidence: 95,
      timeframe: '1h-48h',
      status: 'active',
      lastUpdated: Date.now() - 900000,
      predictions: 2156,
      successRate: 89.7,
      description: 'Support Vector Machine for risk analysis'
    },
    {
      id: 'sentiment_bert',
      name: 'Sentiment BERT Transformer',
      type: 'sentiment',
      accuracy: 89.8,
      confidence: 91,
      timeframe: '15m-6h',
      status: 'training',
      lastUpdated: Date.now() - 7200000,
      predictions: 3421,
      successRate: 87.4,
      description: 'Transformer model for real-time sentiment analysis'
    }
  ]

  const mockPredictions: Prediction[] = [
    {
      id: '1',
      modelId: 'price_lstm',
      target: 'SEI/USDT',
      prediction: 'Bullish breakout expected',
      confidence: 92,
      probability: 87.5,
      timeframe: '4-6 hours',
      createdAt: Date.now() - 1800000,
      status: 'confirmed',
      actualOutcome: 'Price increased 12.5%',
      accuracy: 94.2
    },
    {
      id: '2',
      modelId: 'behavior_rf',
      target: 'Whale Wallet 0x1a2b...',
      prediction: 'Large sell order incoming',
      confidence: 85,
      probability: 78.3,
      timeframe: '2-4 hours',
      createdAt: Date.now() - 3600000,
      status: 'pending',
    },
    {
      id: '3',
      modelId: 'risk_svm',
      target: 'DeFi Protocol XYZ',
      prediction: 'High risk of exploit',
      confidence: 96,
      probability: 91.2,
      timeframe: '24-48 hours',
      createdAt: Date.now() - 7200000,
      status: 'failed',
      actualOutcome: 'No exploit detected',
      accuracy: 0
    },
    {
      id: '4',
      modelId: 'sentiment_bert',
      target: 'Market Sentiment',
      prediction: 'Sentiment shift to bearish',
      confidence: 88,
      probability: 82.7,
      timeframe: '1-2 hours',
      createdAt: Date.now() - 900000,
      status: 'confirmed',
      actualOutcome: 'Sentiment dropped 15%',
      accuracy: 89.1
    }
  ]

  const mockMetrics: ModelMetrics[] = [
    {
      modelId: 'price_lstm',
      accuracy: 87.5,
      precision: 89.2,
      recall: 85.8,
      f1Score: 87.4,
      mse: 0.0234,
      mae: 0.0156,
      trainingTime: 4.2,
      dataPoints: 125000,
      features: 42
    },
    {
      modelId: 'behavior_rf',
      accuracy: 82.1,
      precision: 84.5,
      recall: 79.7,
      f1Score: 82.0,
      mse: 0.0312,
      mae: 0.0198,
      trainingTime: 2.8,
      dataPoints: 89000,
      features: 28
    },
    {
      modelId: 'risk_svm',
      accuracy: 91.3,
      precision: 93.1,
      recall: 89.5,
      f1Score: 91.2,
      mse: 0.0187,
      mae: 0.0124,
      trainingTime: 1.9,
      dataPoints: 156000,
      features: 35
    },
    {
      modelId: 'sentiment_bert',
      accuracy: 89.8,
      precision: 91.4,
      recall: 88.2,
      f1Score: 89.7,
      mse: 0.0201,
      mae: 0.0143,
      trainingTime: 8.7,
      dataPoints: 234000,
      features: 768
    }
  ]

  const mockFeatureImportance: FeatureImportance[] = [
    {
      feature: 'Volume Weighted Average Price',
      importance: 0.234,
      category: 'technical',
      description: 'VWAP sebagai indikator momentum harga'
    },
    {
      feature: 'Social Media Sentiment',
      importance: 0.198,
      category: 'social',
      description: 'Agregasi sentiment dari platform media sosial'
    },
    {
      feature: 'Whale Transaction Volume',
      importance: 0.187,
      category: 'onchain',
      description: 'Volume transaksi dari wallet whale'
    },
    {
      feature: 'Trading Pattern Consistency',
      importance: 0.156,
      category: 'behavioral',
      description: 'Konsistensi pola trading historis'
    },
    {
      feature: 'RSI Divergence',
      importance: 0.143,
      category: 'technical',
      description: 'Divergensi Relative Strength Index'
    },
    {
      feature: 'Fear & Greed Index',
      importance: 0.128,
      category: 'social',
      description: 'Indeks emosi pasar secara keseluruhan'
    },
    {
      feature: 'Gas Fee Trends',
      importance: 0.112,
      category: 'onchain',
      description: 'Tren biaya gas sebagai indikator aktivitas'
    },
    {
      feature: 'Portfolio Diversification',
      importance: 0.098,
      category: 'behavioral',
      description: 'Tingkat diversifikasi portfolio wallet'
    }
  ]

  useEffect(() => {
    let models = [...mockModels]
    let predictions = [...mockPredictions]
    let metrics = [...mockMetrics]
    let featureImportance = [...mockFeatureImportance]

    if (targetWallet && analysisData) {
      const walletPrediction: Prediction = {
        id: 'wallet-prediction',
        modelId: 'behavior_rf',
        target: `Wallet ${targetWallet.slice(0, 6)}...${targetWallet.slice(-4)}`,
        prediction: analysisData.riskScore > 70 ? 'High activity expected' : 'Stable behavior predicted',
        confidence: 88,
        probability: analysisData.behaviorScore || 75,
        timeframe: '2-6 hours',
        createdAt: Date.now() - 15 * 60 * 1000,
        status: 'pending'
      }
      predictions.unshift(walletPrediction)

      const walletFeature: FeatureImportance = {
        feature: `Wallet ${targetWallet.slice(0, 6)} Behavior Pattern`,
        importance: 0.165,
        category: 'behavioral',
        description: `Behavioral analysis for wallet ${targetWallet.slice(0, 6)}...${targetWallet.slice(-4)}`
      }
      featureImportance.unshift(walletFeature)
    }

    setModels(models)
    setPredictions(predictions)
    setMetrics(metrics)
    setFeatureImportance(featureImportance)
  }, [targetWallet, analysisData])

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'price': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'behavior': return <Brain className="h-4 w-4 text-blue-500" />
      case 'risk': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'sentiment': return <Activity className="h-4 w-4 text-purple-500" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'training': return <Cpu className="h-4 w-4 text-blue-500" />
      case 'paused': return <XCircle className="h-4 w-4 text-gray-500" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getPredictionStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800'
      case 'behavioral': return 'bg-purple-100 text-purple-800'
      case 'social': return 'bg-pink-100 text-pink-800'
      case 'onchain': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const hours = Math.floor((Date.now() - timestamp) / 3600000)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const trainModel = () => {
    setIsTraining(true)
    setTimeout(() => {
      setIsTraining(false)
    }, 5000)
  }

  const selectedModelData = models.find(m => m.id === selectedModel)
  const selectedModelMetrics = metrics.find(m => m.modelId === selectedModel)
  const modelPredictions = predictions.filter(p => p.modelId === selectedModel)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Predictive Model</h2>
          <p className="text-muted-foreground">AI models for price, behavior, and risk prediction</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={trainModel} disabled={isTraining}>
            {isTraining ? 'Training...' : 'Retrain Model'}
          </Button>
        </div>
      </div>

      {/* Model Overview */}
      {selectedModelData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getModelTypeIcon(selectedModelData.type)}
                <div>
                  <CardTitle>{selectedModelData.name}</CardTitle>
                  <CardDescription>{selectedModelData.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedModelData.status)}
                <Badge variant={selectedModelData.status === 'active' ? 'default' : 'secondary'}>
                  {selectedModelData.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{selectedModelData.accuracy}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-2xl font-bold text-blue-600">{selectedModelData.confidence}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">{selectedModelData.successRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Predictions</p>
                <p className="text-2xl font-bold">{selectedModelData.predictions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictions">Live Predictions</TabsTrigger>
          <TabsTrigger value="metrics">Model Metrics</TabsTrigger>
          <TabsTrigger value="features">Feature Importance</TabsTrigger>
          <TabsTrigger value="models">All Models</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <div className="space-y-3">
            {modelPredictions.map((prediction) => (
              <Card key={prediction.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{prediction.target}</span>
                          <Badge className={getPredictionStatusColor(prediction.status)}>
                            {prediction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{prediction.prediction}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{prediction.confidence}%</span>
                        <span className="text-sm text-muted-foreground">{formatTimeAgo(prediction.createdAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Timeframe: {prediction.timeframe} • Probability: {prediction.probability}%
                      </p>
                      {prediction.actualOutcome && (
                        <p className="text-xs text-green-600 mt-1">
                          Outcome: {prediction.actualOutcome} ({prediction.accuracy}% accuracy)
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {selectedModelMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Accuracy</span>
                      <span className="font-bold">{selectedModelMetrics.accuracy}%</span>
                    </div>
                    <Progress value={selectedModelMetrics.accuracy} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Precision</span>
                      <span className="font-bold">{selectedModelMetrics.precision}%</span>
                    </div>
                    <Progress value={selectedModelMetrics.precision} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Recall</span>
                      <span className="font-bold">{selectedModelMetrics.recall}%</span>
                    </div>
                    <Progress value={selectedModelMetrics.recall} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">F1 Score</span>
                      <span className="font-bold">{selectedModelMetrics.f1Score}%</span>
                    </div>
                    <Progress value={selectedModelMetrics.f1Score} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Training Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">MSE</p>
                      <p className="font-semibold">{selectedModelMetrics.mse.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">MAE</p>
                      <p className="font-semibold">{selectedModelMetrics.mae.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Training Time</p>
                      <p className="font-semibold">{selectedModelMetrics.trainingTime}h</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data Points</p>
                      <p className="font-semibold">{selectedModelMetrics.dataPoints.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Features</p>
                      <p className="font-semibold">{selectedModelMetrics.features}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="space-y-3">
            {featureImportance.map((feature, index) => (
              <Card key={index} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{feature.feature}</span>
                          <Badge className={getCategoryColor(feature.category)}>
                            {feature.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">{(feature.importance * 100).toFixed(1)}%</span>
                      <div className="w-24 mt-1">
                        <Progress value={feature.importance * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((model) => (
              <Card key={model.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedModel(model.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getModelTypeIcon(model.type)}
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(model.status)}
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                        {model.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Accuracy</p>
                      <p className="font-semibold">{model.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success Rate</p>
                      <p className="font-semibold">{model.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Predictions</p>
                      <p className="font-semibold">{model.predictions}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Timeframe</p>
                      <p className="font-semibold">{model.timeframe}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Model Confidence</span>
                      <span>{model.confidence}%</span>
                    </div>
                    <Progress value={model.confidence} className="h-2" />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Last updated: {formatTimeAgo(model.lastUpdated)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PredictiveModel;
