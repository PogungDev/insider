// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title InsiderAnalytics
 * @dev Smart contract untuk INSIDER platform yang menyediakan on-chain analytics dan monitoring
 * @author INSIDER Team
 */
contract InsiderAnalytics is Ownable, ReentrancyGuard {
    
    // Events
    event WalletRegistered(address indexed wallet, uint256 timestamp);
    event AnomalyDetected(address indexed wallet, string anomalyType, uint256 severity, uint256 timestamp);
    event AlertTriggered(address indexed wallet, string alertType, uint256 threshold, uint256 actualValue);
    event RiskScoreUpdated(address indexed wallet, uint256 oldScore, uint256 newScore);
    event TokenUnlockScheduled(address indexed token, uint256 unlockTime, uint256 amount);
    
    // Structs
    struct WalletProfile {
        bool isRegistered;
        uint256 riskScore; // 0-1000 (0 = very low risk, 1000 = very high risk)
        uint256 totalTransactions;
        uint256 lastActivity;
        uint256 defiInteractions;
        bool isWhale;
        mapping(address => uint256) tokenBalances;
    }
    
    struct TokenUnlock {
        address token;
        uint256 unlockTime;
        uint256 amount;
        address beneficiary;
        bool isExecuted;
        uint256 impactScore; // Predicted market impact 0-1000
    }
    
    struct AnomalyAlert {
        string anomalyType; // "whale_transfer", "volume_spike", "rugpull_risk", etc.
        uint256 severity; // 1-5 (1 = low, 5 = critical)
        uint256 timestamp;
        bool isResolved;
        string metadata;
    }
    
    // State variables
    mapping(address => WalletProfile) public walletProfiles;
    mapping(uint256 => TokenUnlock) public tokenUnlocks;
    mapping(address => AnomalyAlert[]) public walletAnomalies;
    mapping(address => bool) public authorizedAnalyzers;
    
    uint256 public nextUnlockId;
    uint256 public constant WHALE_THRESHOLD = 1000000 * 10**18; // 1M tokens
    uint256 public constant HIGH_RISK_THRESHOLD = 700;
    
    // Modifiers
    modifier onlyAuthorizedAnalyzer() {
        require(authorizedAnalyzers[msg.sender] || msg.sender == owner(), "Not authorized analyzer");
        _;
    }
    
    modifier validWallet(address wallet) {
        require(wallet != address(0), "Invalid wallet address");
        _;
    }
    
    constructor() {
        authorizedAnalyzers[msg.sender] = true;
    }
    
    /**
     * @dev Register wallet untuk monitoring
     */
    function registerWallet(address wallet) external validWallet(wallet) {
        require(!walletProfiles[wallet].isRegistered, "Wallet already registered");
        
        walletProfiles[wallet].isRegistered = true;
        walletProfiles[wallet].riskScore = 500; // Default medium risk
        walletProfiles[wallet].lastActivity = block.timestamp;
        
        emit WalletRegistered(wallet, block.timestamp);
    }
    
    /**
     * @dev Update risk score untuk wallet
     */
    function updateRiskScore(address wallet, uint256 newScore) 
        external 
        onlyAuthorizedAnalyzer 
        validWallet(wallet) 
    {
        require(newScore <= 1000, "Risk score must be <= 1000");
        require(walletProfiles[wallet].isRegistered, "Wallet not registered");
        
        uint256 oldScore = walletProfiles[wallet].riskScore;
        walletProfiles[wallet].riskScore = newScore;
        
        emit RiskScoreUpdated(wallet, oldScore, newScore);
    }
    
    /**
     * @dev Record anomaly detection
     */
    function recordAnomaly(
        address wallet,
        string memory anomalyType,
        uint256 severity,
        string memory metadata
    ) external onlyAuthorizedAnalyzer validWallet(wallet) {
        require(severity >= 1 && severity <= 5, "Invalid severity level");
        
        AnomalyAlert memory newAnomaly = AnomalyAlert({
            anomalyType: anomalyType,
            severity: severity,
            timestamp: block.timestamp,
            isResolved: false,
            metadata: metadata
        });
        
        walletAnomalies[wallet].push(newAnomaly);
        
        // Auto-update risk score based on anomaly
        if (severity >= 4) {
            uint256 currentRisk = walletProfiles[wallet].riskScore;
            uint256 newRisk = currentRisk + (severity * 50);
            if (newRisk > 1000) newRisk = 1000;
            walletProfiles[wallet].riskScore = newRisk;
        }
        
        emit AnomalyDetected(wallet, anomalyType, severity, block.timestamp);
    }
    
    /**
     * @dev Schedule token unlock event
     */
    function scheduleTokenUnlock(
        address token,
        uint256 unlockTime,
        uint256 amount,
        address beneficiary,
        uint256 impactScore
    ) external onlyAuthorizedAnalyzer {
        require(unlockTime > block.timestamp, "Unlock time must be in future");
        require(amount > 0, "Amount must be greater than 0");
        require(impactScore <= 1000, "Impact score must be <= 1000");
        
        tokenUnlocks[nextUnlockId] = TokenUnlock({
            token: token,
            unlockTime: unlockTime,
            amount: amount,
            beneficiary: beneficiary,
            isExecuted: false,
            impactScore: impactScore
        });
        
        emit TokenUnlockScheduled(token, unlockTime, amount);
        nextUnlockId++;
    }
    
    /**
     * @dev Mark wallet as whale based on holdings
     */
    function updateWhaleStatus(address wallet, bool isWhale) 
        external 
        onlyAuthorizedAnalyzer 
        validWallet(wallet) 
    {
        require(walletProfiles[wallet].isRegistered, "Wallet not registered");
        walletProfiles[wallet].isWhale = isWhale;
    }
    
    /**
     * @dev Update wallet activity metrics
     */
    function updateWalletMetrics(
        address wallet,
        uint256 transactionCount,
        uint256 defiInteractions
    ) external onlyAuthorizedAnalyzer validWallet(wallet) {
        require(walletProfiles[wallet].isRegistered, "Wallet not registered");
        
        walletProfiles[wallet].totalTransactions = transactionCount;
        walletProfiles[wallet].defiInteractions = defiInteractions;
        walletProfiles[wallet].lastActivity = block.timestamp;
    }
    
    /**
     * @dev Get wallet risk assessment
     */
    function getWalletRisk(address wallet) external view returns (
        uint256 riskScore,
        bool isHighRisk,
        bool isWhale,
        uint256 anomalyCount
    ) {
        WalletProfile storage profile = walletProfiles[wallet];
        return (
            profile.riskScore,
            profile.riskScore >= HIGH_RISK_THRESHOLD,
            profile.isWhale,
            walletAnomalies[wallet].length
        );
    }
    
    /**
     * @dev Get upcoming token unlocks
     */
    function getUpcomingUnlocks(uint256 timeframe) external view returns (TokenUnlock[] memory) {
        uint256 count = 0;
        uint256 targetTime = block.timestamp + timeframe;
        
        // Count upcoming unlocks
        for (uint256 i = 0; i < nextUnlockId; i++) {
            if (!tokenUnlocks[i].isExecuted && 
                tokenUnlocks[i].unlockTime <= targetTime && 
                tokenUnlocks[i].unlockTime > block.timestamp) {
                count++;
            }
        }
        
        // Create array of upcoming unlocks
        TokenUnlock[] memory upcoming = new TokenUnlock[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < nextUnlockId; i++) {
            if (!tokenUnlocks[i].isExecuted && 
                tokenUnlocks[i].unlockTime <= targetTime && 
                tokenUnlocks[i].unlockTime > block.timestamp) {
                upcoming[index] = tokenUnlocks[i];
                index++;
            }
        }
        
        return upcoming;
    }
    
    /**
     * @dev Get wallet anomalies
     */
    function getWalletAnomalies(address wallet) external view returns (AnomalyAlert[] memory) {
        return walletAnomalies[wallet];
    }
    
    /**
     * @dev Add authorized analyzer
     */
    function addAuthorizedAnalyzer(address analyzer) external onlyOwner {
        authorizedAnalyzers[analyzer] = true;
    }
    
    /**
     * @dev Remove authorized analyzer
     */
    function removeAuthorizedAnalyzer(address analyzer) external onlyOwner {
        authorizedAnalyzers[analyzer] = false;
    }
    
    /**
     * @dev Emergency function to resolve anomaly
     */
    function resolveAnomaly(address wallet, uint256 anomalyIndex) 
        external 
        onlyAuthorizedAnalyzer 
    {
        require(anomalyIndex < walletAnomalies[wallet].length, "Invalid anomaly index");
        walletAnomalies[wallet][anomalyIndex].isResolved = true;
    }
    
    /**
     * @dev Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 totalWallets,
        uint256 totalUnlocks,
        uint256 totalAnomalies
    ) {
        // Note: This is a simplified version. In production, you'd want to track these more efficiently
        uint256 walletCount = 0;
        uint256 anomalyCount = 0;
        
        // This would be optimized in a real implementation
        return (walletCount, nextUnlockId, anomalyCount);
    }
}