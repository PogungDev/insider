"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Shield, AlertTriangle, CheckCircle, XCircle, Search, Code, Bug, Lock, Zap, FileText } from 'lucide-react';
import { useWallet } from '@/app/(core)/providers/WalletProvider';

interface ContractAudit {
  id: string;
  contractAddress: string;
  contractName: string;
  auditScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastAudited: Date;
  vulnerabilities: Vulnerability[];
  gasOptimization: GasIssue[];
  codeQuality: CodeQualityMetric[];
  status: 'verified' | 'unverified' | 'suspicious';
}

interface Vulnerability {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  location: string;
  recommendation: string;
  cwe?: string;
}

interface GasIssue {
  id: string;
  type: string;
  description: string;
  potentialSavings: number;
  location: string;
}

interface CodeQualityMetric {
  metric: string;
  score: number;
  description: string;
}

const ContractAuditor: React.FC = () => {
  const { targetWallet, analysisData } = useWallet();
  const [audits, setAudits] = useState<ContractAudit[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  useEffect(() => {
    loadAuditData();
  }, [targetWallet, analysisData]);

  const loadAuditData = () => {
    let mockAudits: ContractAudit[] = [
      {
        id: 'audit-1',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        contractName: 'DragonSwap Router V2',
        auditScore: 85,
        riskLevel: 'low',
        lastAudited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'verified',
        vulnerabilities: [
          {
            id: 'vuln-1',
            severity: 'medium',
            type: 'Reentrancy',
            description: 'Potential reentrancy vulnerability in swap function',
            location: 'Line 245-260',
            recommendation: 'Implement reentrancy guard or use checks-effects-interactions pattern',
            cwe: 'CWE-362'
          },
          {
            id: 'vuln-2',
            severity: 'low',
            type: 'Integer Overflow',
            description: 'Potential integer overflow in fee calculation',
            location: 'Line 180',
            recommendation: 'Use SafeMath library for arithmetic operations',
            cwe: 'CWE-190'
          }
        ],
        gasOptimization: [
          {
            id: 'gas-1',
            type: 'Storage Optimization',
            description: 'Pack struct variables to reduce storage slots',
            potentialSavings: 15000,
            location: 'Line 45-52'
          },
          {
            id: 'gas-2',
            type: 'Loop Optimization',
            description: 'Cache array length in loops',
            potentialSavings: 5000,
            location: 'Line 120-135'
          }
        ],
        codeQuality: [
          { metric: 'Code Coverage', score: 92, description: 'Percentage of code covered by tests' },
          { metric: 'Complexity Score', score: 78, description: 'Cyclomatic complexity analysis' },
          { metric: 'Documentation', score: 85, description: 'Code documentation completeness' },
          { metric: 'Best Practices', score: 88, description: 'Adherence to Solidity best practices' }
        ]
      },
      {
        id: 'audit-2',
        contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        contractName: 'Sei Lending Protocol',
        auditScore: 72,
        riskLevel: 'medium',
        lastAudited: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'verified',
        vulnerabilities: [
          {
            id: 'vuln-3',
            severity: 'high',
            type: 'Access Control',
            description: 'Missing access control on critical function',
            location: 'Line 89',
            recommendation: 'Implement proper role-based access control',
            cwe: 'CWE-284'
          },
          {
            id: 'vuln-4',
            severity: 'medium',
            type: 'Price Manipulation',
            description: 'Oracle price can be manipulated',
            location: 'Line 156-170',
            recommendation: 'Use multiple oracle sources and implement price deviation checks'
          }
        ],
        gasOptimization: [
          {
            id: 'gas-3',
            type: 'Function Optimization',
            description: 'Use external instead of public for functions',
            potentialSavings: 8000,
            location: 'Multiple locations'
          }
        ],
        codeQuality: [
          { metric: 'Code Coverage', score: 78, description: 'Percentage of code covered by tests' },
          { metric: 'Complexity Score', score: 65, description: 'Cyclomatic complexity analysis' },
          { metric: 'Documentation', score: 70, description: 'Code documentation completeness' },
          { metric: 'Best Practices', score: 75, description: 'Adherence to Solidity best practices' }
        ]
      },
      {
        id: 'audit-3',
        contractAddress: '0x9876543210fedcba9876543210fedcba98765432',
        contractName: 'Unknown Contract',
        auditScore: 45,
        riskLevel: 'high',
        lastAudited: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'suspicious',
        vulnerabilities: [
          {
            id: 'vuln-5',
            severity: 'critical',
            type: 'Backdoor',
            description: 'Hidden backdoor function detected',
            location: 'Line 234',
            recommendation: 'Do not interact with this contract',
            cwe: 'CWE-506'
          },
          {
            id: 'vuln-6',
            severity: 'high',
            type: 'Honeypot',
            description: 'Contract appears to be a honeypot trap',
            location: 'Multiple functions',
            recommendation: 'Avoid any transactions with this contract'
          }
        ],
        gasOptimization: [],
        codeQuality: [
          { metric: 'Code Coverage', score: 20, description: 'Percentage of code covered by tests' },
          { metric: 'Complexity Score', score: 30, description: 'Cyclomatic complexity analysis' },
          { metric: 'Documentation', score: 15, description: 'Code documentation completeness' },
          { metric: 'Best Practices', score: 25, description: 'Adherence to Solidity best practices' }
        ]
      }
    ];

    // Add wallet-specific contract audits if targetWallet is available
    if (targetWallet && analysisData) {
      const walletSpecificAudit: ContractAudit = {
        id: `audit-wallet-${targetWallet.slice(-8)}`,
        contractAddress: targetWallet,
        contractName: `Target Wallet Contract`,
        auditScore: analysisData.riskScore || 75,
        riskLevel: analysisData.riskScore > 80 ? 'low' : analysisData.riskScore > 60 ? 'medium' : 'high',
        lastAudited: new Date(),
        status: analysisData.riskScore > 70 ? 'verified' : 'unverified',
        vulnerabilities: [
          {
            id: 'vuln-wallet-1',
            severity: analysisData.riskScore > 70 ? 'low' : 'medium',
            type: 'Transaction Pattern Analysis',
            description: `Wallet shows ${analysisData.riskScore > 70 ? 'normal' : 'suspicious'} transaction patterns`,
            location: 'Transaction History',
            recommendation: analysisData.riskScore > 70 ? 'Continue monitoring' : 'Exercise caution with interactions'
          }
        ],
        gasOptimization: [],
        codeQuality: [
          { metric: 'Transaction Efficiency', score: analysisData.riskScore || 75, description: 'Efficiency of wallet transactions' },
          { metric: 'Security Score', score: analysisData.riskScore || 75, description: 'Overall security assessment' }
        ]
      };
      mockAudits.unshift(walletSpecificAudit);
    }

    setAudits(mockAudits);
  };

  const runAudit = async () => {
    if (!searchAddress) return;
    
    setIsAuditing(true);
    setAuditProgress(0);
    
    // Simulate audit progress
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'suspicious': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contract Auditor</h2>
          <p className="text-muted-foreground">
            Comprehensive smart contract security analysis and vulnerability detection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter contract address..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="w-80"
          />
          <Button onClick={runAudit} disabled={isAuditing || !searchAddress}>
            <Search className="h-4 w-4 mr-2" />
            {isAuditing ? 'Auditing...' : 'Audit Contract'}
          </Button>
        </div>
      </div>

      {/* Audit Progress */}
      {isAuditing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Security Audit in Progress</span>
                <span>{auditProgress}% Complete</span>
              </div>
              <Progress value={auditProgress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Analyzing contract bytecode, checking for vulnerabilities, and evaluating gas optimization opportunities...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Audit Overview</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="optimization">Gas Optimization</TabsTrigger>
          <TabsTrigger value="quality">Code Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {audits.map((audit) => (
              <Card 
                key={audit.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAudit === audit.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedAudit(audit.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(audit.status)}
                      <div>
                        <CardTitle className="text-lg">{audit.contractName}</CardTitle>
                        <CardDescription className="font-mono text-xs">
                          {audit.contractAddress}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(audit.riskLevel)}>
                        {audit.riskLevel.toUpperCase()}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{audit.auditScore}</div>
                        <div className="text-xs text-muted-foreground">Security Score</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">{audit.vulnerabilities.length}</div>
                        <div className="text-xs text-muted-foreground">Vulnerabilities</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="font-medium">{audit.gasOptimization.length}</div>
                        <div className="text-xs text-muted-foreground">Gas Issues</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">
                          {Math.round(audit.codeQuality.reduce((sum, q) => sum + q.score, 0) / audit.codeQuality.length)}
                        </div>
                        <div className="text-xs text-muted-foreground">Quality Score</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">
                          {Math.floor((Date.now() - audit.lastAudited.getTime()) / (1000 * 60 * 60 * 24))}d ago
                        </div>
                        <div className="text-xs text-muted-foreground">Last Audited</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          {selectedAudit ? (
            (() => {
              const audit = audits.find(a => a.id === selectedAudit);
              if (!audit) return null;
              
              return (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vulnerability Analysis - {audit.contractName}</CardTitle>
                      <CardDescription>
                        {audit.vulnerabilities.length} vulnerabilities detected
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  {audit.vulnerabilities.map((vuln) => (
                    <Card key={vuln.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(vuln.severity)}
                            <CardTitle className="text-lg">{vuln.type}</CardTitle>
                            <Badge className={getRiskColor(vuln.severity)}>
                              {vuln.severity.toUpperCase()}
                            </Badge>
                          </div>
                          {vuln.cwe && (
                            <Badge variant="outline">{vuln.cwe}</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium mb-1">Description</h4>
                            <p className="text-sm text-muted-foreground">{vuln.description}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Location</h4>
                            <code className="text-sm bg-muted px-2 py-1 rounded">{vuln.location}</code>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Recommendation</h4>
                            <p className="text-sm text-muted-foreground">{vuln.recommendation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              );
            })()
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a contract from the overview to view vulnerability details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          {selectedAudit ? (
            (() => {
              const audit = audits.find(a => a.id === selectedAudit);
              if (!audit) return null;
              
              return (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gas Optimization - {audit.contractName}</CardTitle>
                      <CardDescription>
                        {audit.gasOptimization.length} optimization opportunities identified
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  {audit.gasOptimization.length > 0 ? (
                    audit.gasOptimization.map((gas) => (
                      <Card key={gas.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <CardTitle className="text-lg">{gas.type}</CardTitle>
                            </div>
                            <Badge variant="outline">
                              -{gas.potentialSavings.toLocaleString()} gas
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium mb-1">Description</h4>
                              <p className="text-sm text-muted-foreground">{gas.description}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Location</h4>
                              <code className="text-sm bg-muted px-2 py-1 rounded">{gas.location}</code>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Potential Savings</h4>
                              <p className="text-sm text-green-600 font-medium">
                                {gas.potentialSavings.toLocaleString()} gas units
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                        <p className="text-muted-foreground">No gas optimization issues found</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })()
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a contract from the overview to view gas optimization details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          {selectedAudit ? (
            (() => {
              const audit = audits.find(a => a.id === selectedAudit);
              if (!audit) return null;
              
              return (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Code Quality Analysis - {audit.contractName}</CardTitle>
                      <CardDescription>
                        Comprehensive code quality metrics and best practices evaluation
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {audit.codeQuality.map((quality, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{quality.metric}</CardTitle>
                            <div className="text-2xl font-bold">{quality.score}%</div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <Progress value={quality.score} className="h-2" />
                            <p className="text-sm text-muted-foreground">{quality.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })()
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a contract from the overview to view code quality metrics</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractAuditor;
