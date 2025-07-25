export class RiskScorer {
  static calculateRisk(walletData: {
    balance: number;
    transactions: number;
    age: number;
    anomalyScore: number;
  }): number {
    let score = 0;

    // Balance factor: higher balance might indicate higher risk if other factors are suspicious
    if (walletData.balance > 1000000) score += 30;
    else if (walletData.balance > 100000) score += 15;

    // Transaction frequency
    if (walletData.transactions > 1000) score += 25;
    else if (walletData.transactions > 100) score += 10;

    // Wallet age (in days)
    if (walletData.age < 30) score += 20;
    else if (walletData.age < 180) score += 10;

    // Anomaly score
    score += walletData.anomalyScore;

    // Normalize to 0-100
    return Math.min(100, Math.max(0, score));
  }

  static getRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score < 30) return 'low';
    if (score < 70) return 'medium';
    return 'high';
  }

  static getRiskExplanation(score: number): string {
    if (score < 30) return 'Low risk: Normal activity patterns detected.';
    if (score < 70) return 'Medium risk: Some unusual patterns observed, monitor closely.';
    return 'High risk: Significant anomalies detected, potential security concern.';
  }
}