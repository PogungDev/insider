import type { NextApiRequest, NextApiResponse } from "next"
import { anomalyDetector } from "../../workers/ws-anomaly-listener"
import { InsiderSDK } from "../../../../sdk";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { limit = "20", severity, type, walletAddress } = req.query;

    if (!walletAddress || typeof walletAddress !== "string") {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    let anomalies = anomalyDetector.getRecentAnomalies(Number.parseInt(limit as string));

    const sdk = new InsiderSDK();

    // Check dev accumulation risk
    const devRisk = await sdk.checkDevAccumulationRisk(walletAddress, 'dev_wallet_example', 0.3);
    if (devRisk.isHighRisk) {
      anomalies.push({
        id: 'dev-accum-' + Date.now(),
        severity: 'critical',
        title: 'High Dev Accumulation Risk',
        description: `Developer wallet holds ${devRisk.accumulationPercentage.toFixed(2)}% of supply, potential rugpull indicator.`,
        timestamp: new Date(),
        type: 'rugpull',
        walletAddress
      });
    }

    // Check unlock risks
    const tokens = ['SEI', 'USDC']; // Example tokens
    for (const token of tokens) {
      const unlockAlert = await sdk.checkUnlockAlert(token);
      if (unlockAlert.isAlert) {
        anomalies.push({
          id: 'unlock-' + token + '-' + Date.now(),
          severity: 'warning',
          title: `High Risk Token Unlock for ${token}`,
          description: `Risk score: ${unlockAlert.riskScore.toFixed(2)}. Next unlock on ${unlockAlert.nextUnlock?.date || 'soon'}. Potential dump risk.`,
          timestamp: new Date(),
          type: 'unlock',
          walletAddress,
          token
        });
      }
    }

    // Existing filters
    if (severity && typeof severity === "string") {
      anomalies = anomalies.filter((a) => a.severity === severity);
    }

    if (type && typeof type === "string") {
      anomalies = anomalies.filter((a) => a.type === type);
    }

    // Existing formatting
    const formattedAnomalies = anomalies.map((anomaly) => ({
      id: anomaly.id,
      type: anomaly.severity,
      title: anomaly.title,
      description: anomaly.description,
      time: getRelativeTime(anomaly.timestamp),
      category: anomaly.type,
      walletAddress: anomaly.walletAddress,
      amount: anomaly.amount,
      token: anomaly.token,
      metadata: anomaly.metadata,
    }));

    return res.status(200).json(formattedAnomalies);
  } catch (error) {
    console.error("Anomaly Alerts API Error:", error)
    return res.status(500).json({
      error: "Failed to fetch anomaly alerts",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

function getRelativeTime(timestamp: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - timestamp.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minutes ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hours ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} days ago`
}
