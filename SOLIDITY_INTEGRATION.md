# Integrasi Smart Contract Solidity - INSIDER Platform

## 📋 Ringkasan

INSIDER platform kini telah diintegrasikan dengan smart contract Solidity untuk memberikan analitik blockchain yang lebih mendalam dan interaksi on-chain yang real-time. Integrasi ini memungkinkan platform untuk:

- 🔍 **Monitoring Smart Contract**: Memantau aktivitas smart contract secara real-time
- 📊 **Analytics On-Chain**: Menyediakan analitik langsung dari blockchain
- 🚨 **Deteksi Anomali**: Mendeteksi aktivitas mencurigakan pada level smart contract
- 💰 **Token Unlock Tracking**: Memantau jadwal unlock token dan vesting
- 🐋 **Whale Activity Monitoring**: Tracking aktivitas whale dan large transactions

## 🏗️ Arsitektur Integrasi

### Smart Contract Layer
```
📁 contracts/
├── 📄 InsiderAnalytics.sol          # Main analytics contract
├── 📄 hardhat.config.js            # Hardhat configuration
├── 📄 package-contracts.json       # Contract dependencies
├── 📄 tsconfig.json               # TypeScript config
├── 📁 scripts/
│   ├── 📄 deploy.js                # Deployment script
│   └── 📄 interact.js              # Interaction examples
├── 📁 test/
│   └── 📄 InsiderAnalytics.test.js # Contract tests
└── 📄 .env.contracts.example       # Environment variables
```

### Frontend Integration
```
📁 components/smart-contract/
├── 📄 ContractDashboard.tsx        # Main contract dashboard
└── 📁 hooks/
    └── 📄 useInsiderContract.ts     # Contract interaction hook

📁 lib/
└── 📄 web3-config.ts               # Web3 configuration

📁 components/providers/
└── 📄 Web3Provider.tsx             # Web3 provider wrapper
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy environment file
cp .env.local.example .env.local
cp contracts/.env.contracts.example contracts/.env.contracts

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Edit `.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_INSIDER_ANALYTICS_SEI_TESTNET=contract_address_after_deployment
```

Edit `contracts/.env.contracts`:
```env
PRIVATE_KEY=your_private_key_for_deployment
SEI_TESTNET_RPC_URL=https://evm-rpc-testnet.sei-apis.com
```

### 3. Compile & Deploy Smart Contracts

```bash
# Compile contracts
npm run contracts:compile

# Run tests
npm run contracts:test

# Deploy to Sei Testnet
npm run contracts:deploy:sei-testnet

# Deploy to other networks
npm run contracts:deploy:sepolia
npm run contracts:deploy:polygon
```

### 4. Start Development Server

```bash
npm run dev
```

## 📱 Fitur Smart Contract Dashboard

### 1. Wallet Registration & Risk Scoring
- Registrasi wallet untuk monitoring
- Real-time risk score calculation
- Historical risk trend analysis

### 2. Anomaly Detection
- Deteksi aktivitas mencurigakan
- Alert system untuk anomali
- Classification berdasarkan severity

### 3. Token Unlock Monitoring
- Tracking jadwal unlock token
- Vesting schedule analysis
- Upcoming unlock notifications

### 4. Multi-Chain Support
- Sei Network (Mainnet & Testnet)
- Ethereum (Mainnet & Sepolia)
- Polygon
- BNB Smart Chain

## 🔧 Konfigurasi Network

### Supported Networks

| Network | Chain ID | RPC URL | Explorer |
|---------|----------|---------|----------|
| Sei Testnet | 713715 | https://evm-rpc-testnet.sei-apis.com | https://seitrace.com |
| Sei Mainnet | 1329 | https://evm-rpc.sei-apis.com | https://seitrace.com |
| Sepolia | 11155111 | https://sepolia.infura.io/v3/... | https://sepolia.etherscan.io |
| Polygon | 137 | https://polygon-rpc.com | https://polygonscan.com |
| BSC | 56 | https://bsc-dataseed.binance.org | https://bscscan.com |

### Gas Configuration

```typescript
export const GAS_SETTINGS = {
  [seiTestnet.id]: {
    gasPrice: '10000000000', // 10 gwei
    gasLimit: '500000',
  },
  [polygon.id]: {
    gasPrice: '30000000000', // 30 gwei
    gasLimit: '500000',
  },
  // ... other networks
}
```

## 📊 Contract Functions

### Core Analytics Functions

```solidity
// Register wallet for monitoring
function registerWallet(address wallet, string memory metadata)

// Update risk score
function updateRiskScore(address wallet, uint256 score, string memory reason)

// Record anomaly
function recordAnomaly(
    address wallet,
    string memory anomalyType,
    uint256 severity,
    string memory description
)

// Schedule token unlock
function scheduleTokenUnlock(
    address wallet,
    uint256 amount,
    uint256 unlockTime,
    string memory tokenSymbol
)

// Get wallet risk assessment
function getWalletRisk(address wallet) returns (WalletRisk memory)
```

### Event Monitoring

```solidity
event WalletRegistered(address indexed wallet, uint256 timestamp);
event RiskScoreUpdated(address indexed wallet, uint256 newScore, uint256 timestamp);
event AnomalyDetected(address indexed wallet, string anomalyType, uint256 severity);
event TokenUnlockScheduled(address indexed wallet, uint256 amount, uint256 unlockTime);
```

## 🔐 Security Features

### Access Control
- Role-based permissions (Admin, Analyzer)
- Multi-signature support untuk critical functions
- Pausable contract untuk emergency situations

### Data Validation
- Input sanitization
- Range checks untuk numerical values
- Address validation

### Audit Trail
- Comprehensive event logging
- Immutable record keeping
- Transparent operations

## 📈 Analytics & Monitoring

### Real-time Metrics
- Active wallets count
- Risk distribution
- Anomaly frequency
- Token unlock schedule

### Historical Analysis
- Risk score trends
- Anomaly patterns
- Unlock history
- Whale activity tracking

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm run contracts:test

# Run specific test
npx hardhat test test/InsiderAnalytics.test.js

# Test with coverage
npx hardhat coverage
```

### Integration Tests
```bash
# Test contract interaction
npm run contracts:interact

# Test frontend integration
npm run dev
# Navigate to /dashboard and test Smart Contracts tab
```

## 🚀 Deployment Guide

### 1. Prepare Deployment
```bash
# Set environment variables
export PRIVATE_KEY="your_private_key"
export SEI_TESTNET_RPC_URL="https://evm-rpc-testnet.sei-apis.com"
```

### 2. Deploy to Networks
```bash
# Deploy to Sei Testnet
npm run contracts:deploy:sei-testnet

# Deploy to Sei Mainnet
npm run contracts:deploy:sei-mainnet

# Deploy to other networks
npm run contracts:deploy:sepolia
npm run contracts:deploy:polygon
```

### 3. Verify Contracts
```bash
# Verify on block explorer
npm run contracts:verify -- --network sei-testnet <contract_address>
```

### 4. Update Frontend Configuration
Update contract addresses in `.env.local`:
```env
NEXT_PUBLIC_INSIDER_ANALYTICS_SEI_TESTNET=0x...
NEXT_PUBLIC_INSIDER_ANALYTICS_SEI_MAINNET=0x...
```

## 🔄 Integration dengan Existing Features

### 1. AI Analytics Integration
- Smart contract data feeds ke AI models
- Enhanced risk assessment dengan on-chain data
- Real-time anomaly detection

### 2. Dashboard Integration
- New "Smart Contracts" tab di dashboard
- Real-time contract metrics
- Interactive contract functions

### 3. API Integration
- RESTful endpoints untuk contract data
- WebSocket untuk real-time updates
- GraphQL support untuk complex queries

## 🛠️ Development Tools

### Available Scripts
```bash
# Contract development
npm run contracts:compile     # Compile contracts
npm run contracts:test        # Run tests
npm run contracts:node        # Start local node
npm run contracts:deploy:localhost  # Deploy locally

# Frontend development
npm run dev                   # Start dev server
npm run build                 # Build for production
npm run lint                  # Lint code
```

### Debugging
```bash
# Debug contract interactions
console.log("Contract address:", contractAddress)
console.log("Transaction hash:", txHash)
console.log("Gas used:", receipt.gasUsed.toString())
```

## 📚 Resources

### Documentation
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Sei Network Documentation](https://docs.sei.io/)

### Tools
- [Remix IDE](https://remix.ethereum.org/) - Online Solidity IDE
- [Seitrace](https://seitrace.com/) - Sei Network Explorer
- [MetaMask](https://metamask.io/) - Web3 Wallet

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/smart-contract-enhancement`)
3. Commit changes (`git commit -am 'Add new contract feature'`)
4. Push to branch (`git push origin feature/smart-contract-enhancement`)
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

1. **Contract deployment fails**
   - Check private key and RPC URL
   - Ensure sufficient gas and native tokens
   - Verify network configuration

2. **Frontend connection issues**
   - Check MetaMask network settings
   - Verify contract addresses in environment
   - Ensure Web3Provider is properly configured

3. **Transaction failures**
   - Check gas limits and prices
   - Verify contract permissions
   - Review transaction parameters

### Support

For technical support:
- Create GitHub issue
- Check existing documentation
- Review contract tests for examples

---

**INSIDER Platform** - AI-Powered Blockchain Analytics dengan Smart Contract Integration 🚀