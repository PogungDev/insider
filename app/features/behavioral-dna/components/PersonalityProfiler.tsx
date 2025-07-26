"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Brain, Target, TrendingUp, TrendingDown, Search, Heart, Shield, Zap, Eye, Clock, Star, Award, AlertTriangle } from 'lucide-react';

interface PersonalityProfile {
  id: string;
  walletAddress: string;
  label?: string;
  personalityType: 'conservative' | 'aggressive' | 'balanced' | 'speculative' | 'institutional';
  riskProfile: RiskProfile;
  tradingPersonality: TradingPersonality;
  cognitiveTraits: CognitiveTraits;
  behavioralBiases: BehavioralBias[];
  decisionMaking: DecisionMaking;
  socialInfluence: SocialInfluence;
  adaptability: Adaptability;
  confidenceLevel: number;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lastUpdated: Date;
}

interface RiskProfile {
  riskTolerance: number;
  riskCapacity: number;
  lossAversion: number;
  volatilityComfort: number;
  leverageUsage: number;
  diversificationLevel: number;
  hedgingBehavior: number;
  maxDrawdownTolerance: number;
}

interface TradingPersonality {
  patience: number;
  discipline: number;
  emotionalControl: number;
  analyticalThinking: number;
  intuition: number;
  adaptability: number;
  persistence: number;
  confidence: number;
}

interface CognitiveTraits {
  planningHorizon: 'short' | 'medium' | 'long';
  informationProcessing: 'systematic' | 'heuristic' | 'mixed';
  decisionSpeed: number;
  complexityHandling: number;
  patternRecognition: number;
  memoryRetention: number;
  learningRate: number;
  attentionToDetail: number;
}

interface BehavioralBias {
  id: string;
  type: 'anchoring' | 'confirmation' | 'overconfidence' | 'herding' | 'loss_aversion' | 'recency' | 'availability' | 'representativeness';
  severity: number;
  frequency: number;
  impact: number;
  description: string;
  examples: string[];
  mitigation: string[];
}

interface DecisionMaking {
  style: 'analytical' | 'intuitive' | 'dependent' | 'avoidant' | 'spontaneous';
  speed: number;
  consistency: number;
  rationality: number;
  emotionalInfluence: number;
  informationDependency: number;
  groupInfluence: number;
  reversalTendency: number;
}

interface SocialInfluence {
  susceptibility: number;
  influenceSources: string[];
  socialProofSensitivity: number;
  authorityBias: number;
  communityEngagement: number;
  opinionLeadership: number;
  contrarian: number;
}

interface Adaptability {
  marketConditionAdaptation: number;
  strategyFlexibility: number;
  learningFromMistakes: number;
  changeAcceptance: number;
  innovationOpenness: number;
  feedbackReceptivity: number;
  stressResilience: number;
}

interface PersonalityInsight {
  id: string;
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  title: string;
  description: string;
  impact: number;
  actionable: boolean;
  recommendations: string[];
}

interface PersonalityComparison {
  walletId: string;
  similarity: number;
  commonTraits: string[];
  differences: string[];
  compatibilityScore: number;
}

const PersonalityProfiler: React.FC = () => {
  const [profiles, setProfiles] = useState<PersonalityProfile[]>([]);
  const [insights, setInsights] = useState<PersonalityInsight[]>([]);
  const [comparisons, setComparisons] = useState<PersonalityComparison[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    loadPersonalityData();
  }, []);

  const loadPersonalityData = () => {
    const mockProfiles: PersonalityProfile[] = [
      {
        id: 'profile-1',
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        label: 'Institutional Whale',
        personalityType: 'institutional',
        riskProfile: {
          riskTolerance: 65,
          riskCapacity: 90,
          lossAversion: 40,
          volatilityComfort: 70,
          leverageUsage: 30,
          diversificationLevel: 85,
          hedgingBehavior: 80,
          maxDrawdownTolerance: 60
        },
        tradingPersonality: {
          patience: 90,
          discipline: 95,
          emotionalControl: 88,
          analyticalThinking: 92,
          intuition: 65,
          adaptability: 75,
          persistence: 85,
          confidence: 80
        },
        cognitiveTraits: {
          planningHorizon: 'long',
          informationProcessing: 'systematic',
          decisionSpeed: 70,
          complexityHandling: 90,
          patternRecognition: 85,
          memoryRetention: 88,
          learningRate: 75,
          attentionToDetail: 92
        },
        behavioralBiases: [],
        decisionMaking: {
          style: 'analytical',
          speed: 70,
          consistency: 90,
          rationality: 92,
          emotionalInfluence: 25,
          informationDependency: 85,
          groupInfluence: 40,
          reversalTendency: 20
        },
        socialInfluence: {
          susceptibility: 30,
          influenceSources: ['Research Reports', 'Market Data', 'Expert Analysis'],
          socialProofSensitivity: 25,
          authorityBias: 60,
          communityEngagement: 40,
          opinionLeadership: 75,
          contrarian: 70
        },
        adaptability: {
          marketConditionAdaptation: 85,
          strategyFlexibility: 80,
          learningFromMistakes: 90,
          changeAcceptance: 75,
          innovationOpenness: 70,
          feedbackReceptivity: 85,
          stressResilience: 88
        },
        confidenceLevel: 85,
        experienceLevel: 'expert',
        lastUpdated: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 'profile-2',
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        label: 'Degen Trader',
        personalityType: 'speculative',
        riskProfile: {
          riskTolerance: 95,
          riskCapacity: 60,
          lossAversion: 20,
          volatilityComfort: 90,
          leverageUsage: 85,
          diversificationLevel: 25,
          hedgingBehavior: 15,
          maxDrawdownTolerance: 80
        },
        tradingPersonality: {
          patience: 25,
          discipline: 35,
          emotionalControl: 30,
          analyticalThinking: 45,
          intuition: 85,
          adaptability: 90,
          persistence: 70,
          confidence: 95
        },
        cognitiveTraits: {
          planningHorizon: 'short',
          informationProcessing: 'heuristic',
          decisionSpeed: 95,
          complexityHandling: 40,
          patternRecognition: 75,
          memoryRetention: 50,
          learningRate: 80,
          attentionToDetail: 35
        },
        behavioralBiases: [],
        decisionMaking: {
          style: 'spontaneous',
          speed: 95,
          consistency: 40,
          rationality: 35,
          emotionalInfluence: 85,
          informationDependency: 30,
          groupInfluence: 70,
          reversalTendency: 80
        },
        socialInfluence: {
          susceptibility: 85,
          influenceSources: ['Twitter', 'Discord', 'Telegram', 'Reddit'],
          socialProofSensitivity: 90,
          authorityBias: 40,
          communityEngagement: 95,
          opinionLeadership: 60,
          contrarian: 30
        },
        adaptability: {
          marketConditionAdaptation: 70,
          strategyFlexibility: 85,
          learningFromMistakes: 60,
          changeAcceptance: 90,
          innovationOpenness: 95,
          feedbackReceptivity: 70,
          stressResilience: 45
        },
        confidenceLevel: 90,
        experienceLevel: 'intermediate',
        lastUpdated: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: 'profile-3',
        walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
        label: 'Conservative Investor',
        personalityType: 'conservative',
        riskProfile: {
          riskTolerance: 35,
          riskCapacity: 70,
          lossAversion: 85,
          volatilityComfort: 30,
          leverageUsage: 10,
          diversificationLevel: 90,
          hedgingBehavior: 85,
          maxDrawdownTolerance: 25
        },
        tradingPersonality: {
          patience: 95,
          discipline: 90,
          emotionalControl: 85,
          analyticalThinking: 80,
          intuition: 40,
          adaptability: 50,
          persistence: 90,
          confidence: 65
        },
        cognitiveTraits: {
          planningHorizon: 'long',
          informationProcessing: 'systematic',
          decisionSpeed: 40,
          complexityHandling: 75,
          patternRecognition: 70,
          memoryRetention: 85,
          learningRate: 60,
          attentionToDetail: 90
        },
        behavioralBiases: [],
        decisionMaking: {
          style: 'analytical',
          speed: 40,
          consistency: 95,
          rationality: 90,
          emotionalInfluence: 30,
          informationDependency: 90,
          groupInfluence: 50,
          reversalTendency: 25
        },
        socialInfluence: {
          susceptibility: 40,
          influenceSources: ['Financial News', 'Research Reports', 'Expert Opinions'],
          socialProofSensitivity: 35,
          authorityBias: 75,
          communityEngagement: 30,
          opinionLeadership: 45,
          contrarian: 60
        },
        adaptability: {
          marketConditionAdaptation: 60,
          strategyFlexibility: 45,
          learningFromMistakes: 85,
          changeAcceptance: 50,
          innovationOpenness: 40,
          feedbackReceptivity: 80,
          stressResilience: 75
        },
        confidenceLevel: 70,
        experienceLevel: 'advanced',
        lastUpdated: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        id: 'profile-4',
        walletAddress: '0x5555666677778888999900001111222233334444',
        label: 'Balanced Trader',
        personalityType: 'balanced',
        riskProfile: {
          riskTolerance: 60,
          riskCapacity: 75,
          lossAversion: 55,
          volatilityComfort: 65,
          leverageUsage: 40,
          diversificationLevel: 70,
          hedgingBehavior: 60,
          maxDrawdownTolerance: 50
        },
        tradingPersonality: {
          patience: 70,
          discipline: 75,
          emotionalControl: 70,
          analyticalThinking: 75,
          intuition: 65,
          adaptability: 80,
          persistence: 75,
          confidence: 70
        },
        cognitiveTraits: {
          planningHorizon: 'medium',
          informationProcessing: 'mixed',
          decisionSpeed: 65,
          complexityHandling: 70,
          patternRecognition: 75,
          memoryRetention: 70,
          learningRate: 80,
          attentionToDetail: 75
        },
        behavioralBiases: [],
        decisionMaking: {
          style: 'analytical',
          speed: 65,
          consistency: 75,
          rationality: 75,
          emotionalInfluence: 45,
          informationDependency: 70,
          groupInfluence: 55,
          reversalTendency: 40
        },
        socialInfluence: {
          susceptibility: 55,
          influenceSources: ['Mixed Sources', 'Technical Analysis', 'Market Sentiment'],
          socialProofSensitivity: 60,
          authorityBias: 55,
          communityEngagement: 65,
          opinionLeadership: 60,
          contrarian: 50
        },
        adaptability: {
          marketConditionAdaptation: 80,
          strategyFlexibility: 75,
          learningFromMistakes: 80,
          changeAcceptance: 75,
          innovationOpenness: 70,
          feedbackReceptivity: 80,
          stressResilience: 70
        },
        confidenceLevel: 75,
        experienceLevel: 'advanced',
        lastUpdated: new Date(Date.now() - 90 * 60 * 1000)
      }
    ];

    const mockBiases: BehavioralBias[] = [
      {
        id: 'bias-1',
        type: 'overconfidence',
        severity: 75,
        frequency: 60,
        impact: 70,
        description: 'Tendency to overestimate trading abilities and market predictions',
        examples: [
          'Increasing position sizes after winning streaks',
          'Ignoring risk management during bull markets',
          'Dismissing contrary market signals'
        ],
        mitigation: [
          'Implement systematic position sizing',
          'Use stop-loss orders consistently',
          'Seek diverse market opinions'
        ]
      },
      {
        id: 'bias-2',
        type: 'confirmation',
        severity: 65,
        frequency: 80,
        impact: 60,
        description: 'Seeking information that confirms existing beliefs while ignoring contradictory evidence',
        examples: [
          'Only reading bullish news during uptrends',
          'Dismissing negative technical indicators',
          'Following only like-minded traders'
        ],
        mitigation: [
          'Actively seek contrarian viewpoints',
          'Use systematic analysis frameworks',
          'Set up devil\'s advocate processes'
        ]
      },
      {
        id: 'bias-3',
        type: 'loss_aversion',
        severity: 80,
        frequency: 70,
        impact: 85,
        description: 'Disproportionate fear of losses compared to equivalent gains',
        examples: [
          'Holding losing positions too long',
          'Taking profits too early',
          'Avoiding necessary risk-taking'
        ],
        mitigation: [
          'Use predetermined exit strategies',
          'Focus on risk-adjusted returns',
          'Practice position sizing discipline'
        ]
      },
      {
        id: 'bias-4',
        type: 'herding',
        severity: 70,
        frequency: 65,
        impact: 75,
        description: 'Following crowd behavior and popular market trends',
        examples: [
          'Buying during FOMO periods',
          'Selling during panic phases',
          'Following social media sentiment'
        ],
        mitigation: [
          'Develop independent analysis skills',
          'Use contrarian indicators',
          'Implement systematic entry/exit rules'
        ]
      }
    ];

    const mockInsights: PersonalityInsight[] = [
      {
        id: 'insight-1',
        category: 'strength',
        title: 'Exceptional Emotional Control',
        description: 'Demonstrates superior ability to manage emotions during volatile market conditions',
        impact: 85,
        actionable: true,
        recommendations: [
          'Leverage this strength during high-stress market periods',
          'Consider mentoring other traders',
          'Develop systematic approaches to capitalize on market volatility'
        ]
      },
      {
        id: 'insight-2',
        category: 'weakness',
        title: 'Overconfidence in Bull Markets',
        description: 'Tendency to increase risk exposure during positive market conditions',
        impact: 70,
        actionable: true,
        recommendations: [
          'Implement fixed position sizing rules',
          'Use systematic rebalancing strategies',
          'Set up automated risk management alerts'
        ]
      },
      {
        id: 'insight-3',
        category: 'opportunity',
        title: 'High Adaptability Potential',
        description: 'Strong capacity for learning and adapting to new market conditions',
        impact: 80,
        actionable: true,
        recommendations: [
          'Explore new trading strategies and markets',
          'Invest in continuous education and skill development',
          'Consider diversifying into emerging asset classes'
        ]
      },
      {
        id: 'insight-4',
        category: 'threat',
        title: 'Social Influence Susceptibility',
        description: 'High sensitivity to social media and community sentiment',
        impact: 65,
        actionable: true,
        recommendations: [
          'Limit exposure to social trading platforms during decision-making',
          'Develop independent analysis frameworks',
          'Use systematic filters for information sources'
        ]
      }
    ];

    const mockComparisons: PersonalityComparison[] = [
      {
        walletId: 'profile-2',
        similarity: 75,
        commonTraits: ['High Risk Tolerance', 'Quick Decision Making', 'Social Influence'],
        differences: ['Emotional Control', 'Planning Horizon', 'Analytical Thinking'],
        compatibilityScore: 65
      },
      {
        walletId: 'profile-3',
        similarity: 45,
        commonTraits: ['Systematic Approach', 'High Discipline'],
        differences: ['Risk Tolerance', 'Decision Speed', 'Innovation Openness'],
        compatibilityScore: 40
      },
      {
        walletId: 'profile-4',
        similarity: 85,
        commonTraits: ['Balanced Approach', 'Adaptability', 'Learning Orientation'],
        differences: ['Confidence Level', 'Social Influence'],
        compatibilityScore: 80
      }
    ];

    // Add biases to profiles
    const updatedProfiles = mockProfiles.map(profile => ({
      ...profile,
      behavioralBiases: mockBiases.filter(() => Math.random() > 0.6)
    }));

    setProfiles(updatedProfiles);
    setInsights(mockInsights);
    setComparisons(mockComparisons);
  };

  const runPersonalityAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 6;
      });
    }, 300);
  };

  const getPersonalityColor = (type: string) => {
    switch (type) {
      case 'conservative': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'aggressive': return 'bg-red-100 text-red-800 border-red-200';
      case 'balanced': return 'bg-green-100 text-green-800 border-green-200';
      case 'speculative': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'institutional': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPersonalityIcon = (type: string) => {
    switch (type) {
      case 'conservative': return <Shield className="h-4 w-4" />;
      case 'aggressive': return <Zap className="h-4 w-4" />;
      case 'balanced': return <Target className="h-4 w-4" />;
      case 'speculative': return <TrendingUp className="h-4 w-4" />;
      case 'institutional': return <Award className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getBiasColor = (severity: number) => {
    if (severity > 70) return 'bg-red-100 text-red-800 border-red-200';
    if (severity > 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Star className="h-4 w-4 text-green-500" />;
      case 'weakness': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'threat': return <Shield className="h-4 w-4 text-orange-500" />;
      default: return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.walletAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || profile.personalityType === filterType;
    return matchesSearch && matchesType;
  });

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Personality Profiler</h2>
          <p className="text-muted-foreground">
            Deep psychological analysis of trading personalities and behavioral patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="conservative">Conservative</SelectItem>
              <SelectItem value="aggressive">Aggressive</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="speculative">Speculative</SelectItem>
              <SelectItem value="institutional">Institutional</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runPersonalityAnalysis} disabled={isAnalyzing}>
            <Search className="h-4 w-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Personality Analysis in Progress</span>
                <span>{analysisProgress}% Complete</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Analyzing cognitive traits, behavioral biases, and decision-making patterns...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="profiles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profiles">Personality Profiles</TabsTrigger>
          <TabsTrigger value="traits">Cognitive Traits</TabsTrigger>
          <TabsTrigger value="biases">Behavioral Biases</TabsTrigger>
          <TabsTrigger value="insights">Insights & Recommendations</TabsTrigger>
          <TabsTrigger value="comparison">Profile Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4">
          <div className="space-y-4">
            {filteredProfiles.map((profile) => (
              <Card 
                key={profile.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedProfile === profile.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedProfile(profile.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-500" />
                      <div>
                        <CardTitle className="text-lg">
                          {profile.label || 'Unknown Wallet'}
                        </CardTitle>
                        <CardDescription className="font-mono">
                          {formatAddress(profile.walletAddress)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPersonalityColor(profile.personalityType)}>
                        {getPersonalityIcon(profile.personalityType)}
                        {profile.personalityType.toUpperCase()}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{profile.confidenceLevel}</div>
                        <div className="text-xs text-muted-foreground">Confidence</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="font-medium">{profile.experienceLevel}</div>
                        <div className="text-xs text-muted-foreground">Experience</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">{profile.riskProfile.riskTolerance}%</div>
                        <div className="text-xs text-muted-foreground">Risk Tolerance</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">{profile.tradingPersonality.emotionalControl}%</div>
                        <div className="text-xs text-muted-foreground">Emotional Control</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <div>
                        <div className="font-medium capitalize">{profile.cognitiveTraits.planningHorizon}</div>
                        <div className="text-xs text-muted-foreground">Planning Horizon</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid gap-2 md:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium mb-2">Trading Personality</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Patience</span>
                          <span>{profile.tradingPersonality.patience}%</span>
                        </div>
                        <Progress value={profile.tradingPersonality.patience} className="h-1" />
                        <div className="flex justify-between text-xs">
                          <span>Discipline</span>
                          <span>{profile.tradingPersonality.discipline}%</span>
                        </div>
                        <Progress value={profile.tradingPersonality.discipline} className="h-1" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Decision Making</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Rationality</span>
                          <span>{profile.decisionMaking.rationality}%</span>
                        </div>
                        <Progress value={profile.decisionMaking.rationality} className="h-1" />
                        <div className="flex justify-between text-xs">
                          <span>Consistency</span>
                          <span>{profile.decisionMaking.consistency}%</span>
                        </div>
                        <Progress value={profile.decisionMaking.consistency} className="h-1" />
                      </div>
                    </div>
                  </div>
                  
                  {profile.behavioralBiases.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Behavioral Biases ({profile.behavioralBiases.length})</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {profile.behavioralBiases.slice(0, 3).map((bias) => (
                          <Badge key={bias.id} className={getBiasColor(bias.severity)}>
                            {bias.type.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Updated {formatTimestamp(profile.lastUpdated)}</span>
                    <span>Social Influence: {profile.socialInfluence.susceptibility}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="traits" className="space-y-4">
          {selectedProfile ? (
            (() => {
              const profile = profiles.find(p => p.id === selectedProfile);
              if (!profile) return null;
              
              return (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cognitive Traits - {profile.label}</CardTitle>
                      <CardDescription>
                        Detailed analysis of cognitive abilities and thinking patterns
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Information Processing</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Processing Style</span>
                          <Badge className="capitalize">{profile.cognitiveTraits.informationProcessing}</Badge>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Decision Speed</span>
                            <span>{profile.cognitiveTraits.decisionSpeed}%</span>
                          </div>
                          <Progress value={profile.cognitiveTraits.decisionSpeed} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Complexity Handling</span>
                            <span>{profile.cognitiveTraits.complexityHandling}%</span>
                          </div>
                          <Progress value={profile.cognitiveTraits.complexityHandling} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Attention to Detail</span>
                            <span>{profile.cognitiveTraits.attentionToDetail}%</span>
                          </div>
                          <Progress value={profile.cognitiveTraits.attentionToDetail} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Learning & Memory</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Pattern Recognition</span>
                            <span>{profile.cognitiveTraits.patternRecognition}%</span>
                          </div>
                          <Progress value={profile.cognitiveTraits.patternRecognition} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Memory Retention</span>
                            <span>{profile.cognitiveTraits.memoryRetention}%</span>
                          </div>
                          <Progress value={profile.cognitiveTraits.memoryRetention} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Learning Rate</span>
                            <span>{profile.cognitiveTraits.learningRate}%</span>
                          </div>
                          <Progress value={profile.cognitiveTraits.learningRate} className="h-2" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Planning Horizon</span>
                          <Badge className="capitalize">{profile.cognitiveTraits.planningHorizon}-term</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Risk Profile</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {Object.entries(profile.riskProfile).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span>{value}%</span>
                            </div>
                            <Progress value={value} className="h-1" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Social Influence</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Susceptibility</span>
                            <span>{profile.socialInfluence.susceptibility}%</span>
                          </div>
                          <Progress value={profile.socialInfluence.susceptibility} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Social Proof Sensitivity</span>
                            <span>{profile.socialInfluence.socialProofSensitivity}%</span>
                          </div>
                          <Progress value={profile.socialInfluence.socialProofSensitivity} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Authority Bias</span>
                            <span>{profile.socialInfluence.authorityBias}%</span>
                          </div>
                          <Progress value={profile.socialInfluence.authorityBias} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Contrarian Tendency</span>
                            <span>{profile.socialInfluence.contrarian}%</span>
                          </div>
                          <Progress value={profile.socialInfluence.contrarian} className="h-1" />
                        </div>
                        <div className="mt-2">
                          <div className="text-xs font-medium mb-1">Influence Sources</div>
                          <div className="flex gap-1 flex-wrap">
                            {profile.socialInfluence.influenceSources.map((source, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Adaptability</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {Object.entries(profile.adaptability).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span>{value}%</span>
                            </div>
                            <Progress value={value} className="h-1" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })()
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a profile to view detailed cognitive traits analysis</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="biases" className="space-y-4">
          <div className="space-y-4">
            {profiles.flatMap(profile => 
              profile.behavioralBiases.map(bias => ({ ...bias, walletLabel: profile.label, walletId: profile.id }))
            ).map((bias) => (
              <Card key={`${bias.walletId}-${bias.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <CardTitle className="text-lg capitalize">
                          {bias.type.replace('_', ' ')} Bias
                        </CardTitle>
                        <CardDescription>{bias.walletLabel}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getBiasColor(bias.severity)}>
                        SEVERITY: {bias.severity}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{bias.impact}</div>
                        <div className="text-xs text-muted-foreground">Impact Score</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{bias.description}</p>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-sm font-medium">Severity</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={bias.severity} className="h-2 flex-1" />
                        <span className="text-sm">{bias.severity}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Frequency</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={bias.frequency} className="h-2 flex-1" />
                        <span className="text-sm">{bias.frequency}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Impact</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={bias.impact} className="h-2 flex-1" />
                        <span className="text-sm text-red-600">{bias.impact}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium mb-2">Common Examples</div>
                      <div className="space-y-1">
                        {bias.examples.map((example, index) => (
                          <div key={index} className="text-xs text-muted-foreground">
                            • {example}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Mitigation Strategies</div>
                      <div className="space-y-1">
                        {bias.mitigation.map((strategy, index) => (
                          <div key={index} className="text-xs text-green-600">
                            ✓ {strategy}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getInsightIcon(insight.category)}
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <CardDescription className="capitalize">{insight.category}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {insight.actionable && (
                        <Badge className="bg-blue-100 text-blue-800">
                          ACTIONABLE
                        </Badge>
                      )}
                      <div className="text-right">
                        <div className="text-2xl font-bold">{insight.impact}</div>
                        <div className="text-xs text-muted-foreground">Impact Score</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{insight.description}</p>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium">Impact Level</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={insight.impact} className="h-2 flex-1" />
                      <span className={`text-sm ${
                        insight.impact > 70 ? 'text-red-600' :
                        insight.impact > 40 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {insight.impact}%
                      </span>
                    </div>
                  </div>
                  
                  {insight.recommendations.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Recommendations</div>
                      <div className="space-y-1">
                        {insight.recommendations.map((recommendation, index) => (
                          <div key={index} className="text-xs text-blue-600">
                            → {recommendation}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {selectedProfile ? (
            (() => {
              const profile = profiles.find(p => p.id === selectedProfile);
              if (!profile) return null;
              
              return (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Comparison - {profile.label}</CardTitle>
                      <CardDescription>
                        Similarity analysis with other wallet personalities
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <div className="space-y-4">
                    {comparisons.map((comparison) => {
                      const comparedProfile = profiles.find(p => p.id === comparison.walletId);
                      if (!comparedProfile) return null;
                      
                      return (
                        <Card key={comparison.walletId}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-blue-500" />
                                <div>
                                  <CardTitle className="text-lg">{comparedProfile.label}</CardTitle>
                                  <CardDescription>{formatAddress(comparedProfile.walletAddress)}</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${
                                  comparison.similarity > 70 ? 'bg-green-100 text-green-800' :
                                  comparison.similarity > 40 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {comparison.similarity}% SIMILAR
                                </Badge>
                                <div className="text-right">
                                  <div className="text-2xl font-bold">{comparison.compatibilityScore}</div>
                                  <div className="text-xs text-muted-foreground">Compatibility</div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <div className="text-sm font-medium mb-2 text-green-600">Common Traits</div>
                                <div className="space-y-1">
                                  {comparison.commonTraits.map((trait, index) => (
                                    <div key={index} className="text-xs text-green-600">
                                      ✓ {trait}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium mb-2 text-red-600">Key Differences</div>
                                <div className="space-y-1">
                                  {comparison.differences.map((difference, index) => (
                                    <div key={index} className="text-xs text-red-600">
                                      ✗ {difference}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <div className="text-sm font-medium mb-2">Compatibility Score</div>
                              <div className="flex items-center gap-2">
                                <Progress value={comparison.compatibilityScore} className="h-2 flex-1" />
                                <span className={`text-sm ${
                                  comparison.compatibilityScore > 70 ? 'text-green-600' :
                                  comparison.compatibilityScore > 40 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {comparison.compatibilityScore}%
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })()
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a profile to view personality comparisons</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalityProfiler;