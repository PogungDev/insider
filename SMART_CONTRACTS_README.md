# 🔗 INSIDER Smart Contracts Integration

## 📋 Overview

INSIDER platform kini mendukung integrasi smart contract Solidity untuk analytics dan monitoring on-chain yang lebih mendalam. Smart contract `InsiderAnalytics` menyediakan infrastruktur untuk:

- ✅ **Wallet Registration & Risk Scoring**
- 🚨 **Real-time Anomaly Detection**
- 📊 **Token Unlock Scheduling & Monitoring**
- 🐋 **Whale Activity Tracking**
- 🔍 **On-chain Analytics Storage**

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │ Smart Contract  │
│   (Next.js)     │◄──►│   (Node.js)      │◄──►│   (Solidity)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web3 Provider │    │   Blockchain     │    │   Event Logs    │
│   (MetaMask)    │    │   RPC Nodes      │    │   & Storage     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp .env.contracts.example .env

# Install dependencies
npm install

# Install contract dependencies
npm install --save-dev @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
```

### 2. Configure Environment Variables

```bash
# .env
PRIVATE_KEY=your_private_key_without_0x_prefix
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 3. Compile Contracts

```bash
npx hardhat compile
```

### 4. Run Tests

```bash
npx hardhat test
```

### 5. Deploy Contract

```bash
# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

## 📁 File Structure

```
insider/
├── contracts/
│   └── InsiderAnalytics.sol      # Main analytics contract
├── scripts/
│   └── deploy.js                 # Deployment script
├── test/
│   └── InsiderAnalytics.test.js  # Contract tests
├── deployments/                  # Deployment artifacts
├── hardhat.config.js            # Hardhat configuration
├── package-contracts.json        # Contract dependencies
└── .env.contracts.example        # Environment template
```

## 🔧 Contract Functions

### Core Functions

#### Wallet Management
```solidity
// Register wallet for monitoring
function registerWallet(address wallet) external

// Update risk score (0-1000)
function updateRiskScore(address wallet, uint256 newScore) external

// Get wallet risk assessment
function getWalletRisk(address wallet) external view returns (
    uint256 riskScore,
    bool isHighRisk,
    bool isWhale,
    uint256 anomalyCount
)
```

#### Anomaly Detection
```solidity
// Record detected anomaly
function recordAnomaly(
    address wallet,
    string memory anomalyType,
    uint256 severity,
    string memory metadata
) external

// Get wallet anomalies
function getWalletAnomalies(address wallet) external view returns (AnomalyAlert[] memory)
```

#### Token Unlock Monitoring
```solidity
// Schedule token unlock event
function scheduleTokenUnlock(
    address token,
    uint256 unlockTime,
    uint256 amount,
    address beneficiary,
    uint256 impactScore
) external

// Get upcoming unlocks
function getUpcomingUnlocks(uint256 timeframe) external view returns (TokenUnlock[] memory)
```

## 🔗 Frontend Integration

### 1. Install Web3 Dependencies

```bash
npm install ethers @web3-react/core @web3-react/injected-connector
```

### 2. Contract Integration Hook

```typescript
// hooks/useInsiderContract.ts
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import InsiderAnalyticsABI from '../deployments/InsiderAnalytics.abi.json';

export function useInsiderContract() {
  const { library, account } = useWeb3React();
  
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    InsiderAnalyticsABI,
    library?.getSigner()
  );
  
  const registerWallet = async (walletAddress: string) => {
    const tx = await contract.registerWallet(walletAddress);
    return await tx.wait();
  };
  
  const getWalletRisk = async (walletAddress: string) => {
    return await contract.getWalletRisk(walletAddress);
  };
  
  return {
    contract,
    registerWallet,
    getWalletRisk,
  };
}
```

### 3. Component Example

```tsx
// components/WalletRiskDisplay.tsx
import { useInsiderContract } from '../hooks/useInsiderContract';

export function WalletRiskDisplay({ walletAddress }: { walletAddress: string }) {
  const { getWalletRisk } = useInsiderContract();
  const [riskData, setRiskData] = useState(null);
  
  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const risk = await getWalletRisk(walletAddress);
        setRiskData(risk);
      } catch (error) {
        console.error('Error fetching risk:', error);
      }
    };
    
    fetchRisk();
  }, [walletAddress]);
  
  return (
    <div className="risk-display">
      <h3>Wallet Risk Assessment</h3>
      {riskData && (
        <>
          <p>Risk Score: {riskData.riskScore}/1000</p>
          <p>High Risk: {riskData.isHighRisk ? 'Yes' : 'No'}</p>
          <p>Whale Status: {riskData.isWhale ? 'Yes' : 'No'}</p>
          <p>Anomalies: {riskData.anomalyCount}</p>
        </>
      )}
    </div>
  );
}
```

## 🔄 Backend Integration

### 1. Event Listener Service

```javascript
// services/contractEventListener.js
const { ethers } = require('ethers');
const InsiderAnalyticsABI = require('../deployments/InsiderAnalytics.abi.json');

class ContractEventListener {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    this.contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      InsiderAnalyticsABI,
      this.provider
    );
  }
  
  startListening() {
    // Listen for anomaly detection events
    this.contract.on('AnomalyDetected', (wallet, anomalyType, severity, timestamp) => {
      console.log('Anomaly detected:', { wallet, anomalyType, severity, timestamp });
      // Send alert to frontend via WebSocket
      this.sendAlert({ wallet, anomalyType, severity, timestamp });
    });
    
    // Listen for risk score updates
    this.contract.on('RiskScoreUpdated', (wallet, oldScore, newScore) => {
      console.log('Risk score updated:', { wallet, oldScore, newScore });
      // Update database
      this.updateDatabase({ wallet, oldScore, newScore });
    });
  }
  
  async sendAlert(data) {
    // Implementation for sending real-time alerts
  }
  
  async updateDatabase(data) {
    // Implementation for database updates
  }
}

module.exports = ContractEventListener;
```

### 2. API Integration

```javascript
// pages/api/contract/wallet-risk.js
import { ethers } from 'ethers';
import InsiderAnalyticsABI from '../../../deployments/InsiderAnalytics.abi.json';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { walletAddress } = req.query;
  
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      InsiderAnalyticsABI,
      provider
    );
    
    const riskData = await contract.getWalletRisk(walletAddress);
    
    res.status(200).json({
      riskScore: riskData.riskScore.toNumber(),
      isHighRisk: riskData.isHighRisk,
      isWhale: riskData.isWhale,
      anomalyCount: riskData.anomalyCount.toNumber()
    });
  } catch (error) {
    console.error('Contract call error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
```

## 🌐 Multi-Chain Support

Contract dapat di-deploy ke berbagai network:

- **Ethereum Mainnet** - Production deployment
- **Sepolia Testnet** - Testing dan development
- **Polygon** - Lower gas fees
- **BSC** - Binance Smart Chain
- **Sei Network** - Native integration dengan platform

### Network Configuration

```javascript
// hardhat.config.js
networks: {
  mainnet: {
    url: process.env.MAINNET_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 1,
  },
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 11155111,
  },
  polygon: {
    url: process.env.POLYGON_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 137,
  },
  sei: {
    url: process.env.SEI_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 1329,
  }
}
```

## 📊 Analytics & Monitoring

### Real-time Event Monitoring

```javascript
// Monitor contract events in real-time
const monitorEvents = () => {
  contract.on('WalletRegistered', (wallet, timestamp) => {
    console.log(`New wallet registered: ${wallet}`);
    updateDashboard('wallet_registered', { wallet, timestamp });
  });
  
  contract.on('AnomalyDetected', (wallet, type, severity) => {
    console.log(`Anomaly detected: ${type} for ${wallet}`);
    sendAlert('anomaly', { wallet, type, severity });
  });
  
  contract.on('TokenUnlockScheduled', (token, unlockTime, amount) => {
    console.log(`Token unlock scheduled: ${token}`);
    updateUnlockCalendar({ token, unlockTime, amount });
  });
};
```

### Gas Optimization

```solidity
// Batch operations untuk efisiensi gas
function batchRegisterWallets(address[] memory wallets) external onlyAuthorizedAnalyzer {
    for (uint256 i = 0; i < wallets.length; i++) {
        if (!walletProfiles[wallets[i]].isRegistered) {
            walletProfiles[wallets[i]].isRegistered = true;
            walletProfiles[wallets[i]].riskScore = 500;
            walletProfiles[wallets[i]].lastActivity = block.timestamp;
            emit WalletRegistered(wallets[i], block.timestamp);
        }
    }
}
```

## 🔒 Security Considerations

### Access Control
- ✅ Owner-only functions untuk critical operations
- ✅ Authorized analyzer system untuk data updates
- ✅ ReentrancyGuard untuk external calls
- ✅ Input validation untuk semua parameters

### Best Practices
- ✅ Use OpenZeppelin contracts untuk security
- ✅ Comprehensive testing coverage
- ✅ Gas optimization
- ✅ Event logging untuk transparency
- ✅ Upgradeable contract pattern (optional)

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/InsiderAnalytics.test.js

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run coverage analysis
npx hardhat coverage
```

## 📈 Performance Metrics

- **Gas Usage**: ~2.5M gas untuk deployment
- **Function Calls**: 50k-200k gas per operation
- **Storage Optimization**: Packed structs untuk efisiensi
- **Event Logs**: Indexed parameters untuk fast querying

## 🔮 Future Enhancements

1. **Cross-chain Bridge Integration**
2. **Advanced ML Model Integration**
3. **Governance Token Implementation**
4. **Staking Mechanism untuk Analyzers**
5. **Oracle Integration untuk Price Feeds**
6. **NFT-based Reputation System**

## 🆘 Troubleshooting

### Common Issues

1. **Contract Not Deployed**
   ```bash
   Error: Contract not deployed
   Solution: Run deployment script first
   ```

2. **Insufficient Gas**
   ```bash
   Error: Transaction reverted
   Solution: Increase gas limit in transaction
   ```

3. **Network Mismatch**
   ```bash
   Error: Network mismatch
   Solution: Check CHAIN_ID in environment
   ```

### Debug Commands

```bash
# Check contract deployment
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# Debug transaction
npx hardhat run scripts/debug.js --network sepolia

# Check contract size
npx hardhat size-contracts
```

## 📞 Support

Untuk bantuan teknis:
- 📧 Email: dev@insider.ai
- 💬 Discord: [INSIDER Community](https://discord.gg/insider)
- 📖 Docs: [docs.insider.ai](https://docs.insider.ai)
- 🐛 Issues: [GitHub Issues](https://github.com/insider/issues)

---

**⚠️ Disclaimer**: Smart contracts adalah immutable setelah deployment. Pastikan testing menyeluruh sebelum deployment ke mainnet.