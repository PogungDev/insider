const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

// Load deployment info
function loadDeployment(network) {
  const deploymentFile = path.join(__dirname, '../deployments', `${network}.json`);
  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`Deployment file not found for network: ${network}`);
  }
  return JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
}

// Get contract instance
async function getContract(network) {
  const deployment = loadDeployment(network);
  const InsiderAnalytics = await hre.ethers.getContractFactory("InsiderAnalytics");
  return InsiderAnalytics.attach(deployment.contractAddress);
}

// Example interactions
async function main() {
  const network = hre.network.name;
  console.log(`🔗 Interacting with InsiderAnalytics on ${network}...`);
  
  try {
    const contract = await getContract(network);
    const [owner, user1, user2] = await hre.ethers.getSigners();
    
    console.log("📋 Contract Address:", contract.address);
    console.log("👤 Owner Address:", owner.address);
    
    // 1. Register wallets
    console.log("\n1️⃣ Registering wallets...");
    
    const registerTx1 = await contract.registerWallet(user1.address);
    await registerTx1.wait();
    console.log(`✅ Registered wallet: ${user1.address}`);
    
    const registerTx2 = await contract.registerWallet(user2.address);
    await registerTx2.wait();
    console.log(`✅ Registered wallet: ${user2.address}`);
    
    // 2. Check wallet profiles
    console.log("\n2️⃣ Checking wallet profiles...");
    
    const profile1 = await contract.walletProfiles(user1.address);
    console.log(`Wallet ${user1.address}:`);
    console.log(`  - Registered: ${profile1.isRegistered}`);
    console.log(`  - Risk Score: ${profile1.riskScore}`);
    console.log(`  - Is Whale: ${profile1.isWhale}`);
    
    // 3. Update risk scores
    console.log("\n3️⃣ Updating risk scores...");
    
    const updateRiskTx1 = await contract.updateRiskScore(user1.address, 750);
    await updateRiskTx1.wait();
    console.log(`✅ Updated risk score for ${user1.address} to 750`);
    
    const updateRiskTx2 = await contract.updateRiskScore(user2.address, 300);
    await updateRiskTx2.wait();
    console.log(`✅ Updated risk score for ${user2.address} to 300`);
    
    // 4. Record anomalies
    console.log("\n4️⃣ Recording anomalies...");
    
    const anomalyTx1 = await contract.recordAnomaly(
      user1.address,
      "whale_transfer",
      4,
      "Large transfer detected: 1M tokens"
    );
    await anomalyTx1.wait();
    console.log(`🚨 Recorded anomaly for ${user1.address}: whale_transfer (severity: 4)`);
    
    const anomalyTx2 = await contract.recordAnomaly(
      user1.address,
      "volume_spike",
      3,
      "Unusual trading volume detected"
    );
    await anomalyTx2.wait();
    console.log(`🚨 Recorded anomaly for ${user1.address}: volume_spike (severity: 3)`);
    
    // 5. Update whale status
    console.log("\n5️⃣ Updating whale status...");
    
    const whaleStatusTx = await contract.updateWhaleStatus(user1.address, true);
    await whaleStatusTx.wait();
    console.log(`🐋 Updated whale status for ${user1.address}: true`);
    
    // 6. Schedule token unlocks
    console.log("\n6️⃣ Scheduling token unlocks...");
    
    const now = Math.floor(Date.now() / 1000);
    const unlockTime1 = now + 3600; // 1 hour from now
    const unlockTime2 = now + 7200; // 2 hours from now
    
    const unlockTx1 = await contract.scheduleTokenUnlock(
      "0x1234567890123456789012345678901234567890", // dummy token address
      unlockTime1,
      hre.ethers.utils.parseEther("1000000"), // 1M tokens
      user1.address,
      800 // high impact score
    );
    await unlockTx1.wait();
    console.log(`📅 Scheduled token unlock #0: 1M tokens in 1 hour`);
    
    const unlockTx2 = await contract.scheduleTokenUnlock(
      "0x0987654321098765432109876543210987654321", // dummy token address
      unlockTime2,
      hre.ethers.utils.parseEther("500000"), // 500k tokens
      user2.address,
      400 // medium impact score
    );
    await unlockTx2.wait();
    console.log(`📅 Scheduled token unlock #1: 500k tokens in 2 hours`);
    
    // 7. Get wallet risk assessments
    console.log("\n7️⃣ Getting wallet risk assessments...");
    
    const risk1 = await contract.getWalletRisk(user1.address);
    console.log(`Risk assessment for ${user1.address}:`);
    console.log(`  - Risk Score: ${risk1.riskScore}`);
    console.log(`  - High Risk: ${risk1.isHighRisk}`);
    console.log(`  - Is Whale: ${risk1.isWhale}`);
    console.log(`  - Anomaly Count: ${risk1.anomalyCount}`);
    
    const risk2 = await contract.getWalletRisk(user2.address);
    console.log(`Risk assessment for ${user2.address}:`);
    console.log(`  - Risk Score: ${risk2.riskScore}`);
    console.log(`  - High Risk: ${risk2.isHighRisk}`);
    console.log(`  - Is Whale: ${risk2.isWhale}`);
    console.log(`  - Anomaly Count: ${risk2.anomalyCount}`);
    
    // 8. Get wallet anomalies
    console.log("\n8️⃣ Getting wallet anomalies...");
    
    const anomalies1 = await contract.getWalletAnomalies(user1.address);
    console.log(`Anomalies for ${user1.address} (${anomalies1.length} total):`);
    anomalies1.forEach((anomaly, index) => {
      console.log(`  ${index + 1}. ${anomaly.anomalyType} (severity: ${anomaly.severity})`);
      console.log(`     Timestamp: ${new Date(anomaly.timestamp * 1000).toISOString()}`);
      console.log(`     Resolved: ${anomaly.isResolved}`);
      console.log(`     Metadata: ${anomaly.metadata}`);
    });
    
    // 9. Get upcoming unlocks
    console.log("\n9️⃣ Getting upcoming unlocks...");
    
    const upcomingUnlocks = await contract.getUpcomingUnlocks(86400); // Next 24 hours
    console.log(`Upcoming unlocks in next 24 hours (${upcomingUnlocks.length} total):`);
    upcomingUnlocks.forEach((unlock, index) => {
      console.log(`  ${index + 1}. Token: ${unlock.token}`);
      console.log(`     Amount: ${hre.ethers.utils.formatEther(unlock.amount)} tokens`);
      console.log(`     Unlock Time: ${new Date(unlock.unlockTime * 1000).toISOString()}`);
      console.log(`     Beneficiary: ${unlock.beneficiary}`);
      console.log(`     Impact Score: ${unlock.impactScore}`);
      console.log(`     Executed: ${unlock.isExecuted}`);
    });
    
    // 10. Add authorized analyzer
    console.log("\n🔟 Managing authorized analyzers...");
    
    const addAnalyzerTx = await contract.addAuthorizedAnalyzer(user2.address);
    await addAnalyzerTx.wait();
    console.log(`✅ Added ${user2.address} as authorized analyzer`);
    
    const isAuthorized = await contract.authorizedAnalyzers(user2.address);
    console.log(`Authorization status for ${user2.address}: ${isAuthorized}`);
    
    // 11. Resolve anomaly
    console.log("\n1️⃣1️⃣ Resolving anomaly...");
    
    const resolveAnomalyTx = await contract.resolveAnomaly(user1.address, 0);
    await resolveAnomalyTx.wait();
    console.log(`✅ Resolved anomaly #0 for ${user1.address}`);
    
    // 12. Final contract stats
    console.log("\n1️⃣2️⃣ Final contract statistics...");
    
    const nextUnlockId = await contract.nextUnlockId();
    console.log(`Total scheduled unlocks: ${nextUnlockId}`);
    
    const whaleThreshold = await contract.WHALE_THRESHOLD();
    console.log(`Whale threshold: ${hre.ethers.utils.formatEther(whaleThreshold)} tokens`);
    
    const highRiskThreshold = await contract.HIGH_RISK_THRESHOLD();
    console.log(`High risk threshold: ${highRiskThreshold}`);
    
    console.log("\n🎉 All interactions completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during interaction:", error.message);
    if (error.reason) {
      console.error("Reason:", error.reason);
    }
    process.exit(1);
  }
}

// Event monitoring function
async function monitorEvents() {
  const network = hre.network.name;
  console.log(`👂 Starting event monitoring on ${network}...`);
  
  try {
    const contract = await getContract(network);
    
    // Listen for wallet registration events
    contract.on('WalletRegistered', (wallet, timestamp) => {
      console.log(`📝 WalletRegistered: ${wallet} at ${new Date(timestamp * 1000).toISOString()}`);
    });
    
    // Listen for anomaly detection events
    contract.on('AnomalyDetected', (wallet, anomalyType, severity, timestamp) => {
      console.log(`🚨 AnomalyDetected: ${anomalyType} for ${wallet} (severity: ${severity})`);
    });
    
    // Listen for risk score updates
    contract.on('RiskScoreUpdated', (wallet, oldScore, newScore) => {
      console.log(`📊 RiskScoreUpdated: ${wallet} from ${oldScore} to ${newScore}`);
    });
    
    // Listen for token unlock scheduling
    contract.on('TokenUnlockScheduled', (token, unlockTime, amount) => {
      console.log(`📅 TokenUnlockScheduled: ${token} - ${hre.ethers.utils.formatEther(amount)} tokens`);
    });
    
    console.log("✅ Event monitoring started. Press Ctrl+C to stop.");
    
    // Keep the process running
    process.stdin.resume();
    
  } catch (error) {
    console.error("❌ Error starting event monitoring:", error.message);
    process.exit(1);
  }
}

// Command line argument handling
if (process.argv.includes('--monitor')) {
  monitorEvents();
} else {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}