const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("InsiderAnalytics", function () {
  // Fixture untuk deploy contract
  async function deployInsiderAnalyticsFixture() {
    const [owner, analyzer, user1, user2] = await ethers.getSigners();
    
    const InsiderAnalytics = await ethers.getContractFactory("InsiderAnalytics");
    const insiderAnalytics = await InsiderAnalytics.deploy();
    
    return { insiderAnalytics, owner, analyzer, user1, user2 };
  }
  
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { insiderAnalytics, owner } = await loadFixture(deployInsiderAnalyticsFixture);
      expect(await insiderAnalytics.owner()).to.equal(owner.address);
    });
    
    it("Should set owner as authorized analyzer", async function () {
      const { insiderAnalytics, owner } = await loadFixture(deployInsiderAnalyticsFixture);
      expect(await insiderAnalytics.authorizedAnalyzers(owner.address)).to.be.true;
    });
    
    it("Should initialize nextUnlockId to 0", async function () {
      const { insiderAnalytics } = await loadFixture(deployInsiderAnalyticsFixture);
      expect(await insiderAnalytics.nextUnlockId()).to.equal(0);
    });
  });
  
  describe("Wallet Registration", function () {
    it("Should register a new wallet", async function () {
      const { insiderAnalytics, user1 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await expect(insiderAnalytics.registerWallet(user1.address))
        .to.emit(insiderAnalytics, "WalletRegistered")
        .withArgs(user1.address, await time.latest() + 1);
      
      const profile = await insiderAnalytics.walletProfiles(user1.address);
      expect(profile.isRegistered).to.be.true;
      expect(profile.riskScore).to.equal(500); // Default medium risk
    });
    
    it("Should not register the same wallet twice", async function () {
      const { insiderAnalytics, user1 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await insiderAnalytics.registerWallet(user1.address);
      
      await expect(insiderAnalytics.registerWallet(user1.address))
        .to.be.revertedWith("Wallet already registered");
    });
    
    it("Should not register zero address", async function () {
      const { insiderAnalytics } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await expect(insiderAnalytics.registerWallet(ethers.constants.AddressZero))
        .to.be.revertedWith("Invalid wallet address");
    });
  });
  
  describe("Risk Score Management", function () {
    it("Should update risk score by authorized analyzer", async function () {
      const { insiderAnalytics, owner, user1 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await insiderAnalytics.registerWallet(user1.address);
      
      await expect(insiderAnalytics.updateRiskScore(user1.address, 750))
        .to.emit(insiderAnalytics, "RiskScoreUpdated")
        .withArgs(user1.address, 500, 750);
      
      const profile = await insiderAnalytics.walletProfiles(user1.address);
      expect(profile.riskScore).to.equal(750);
    });
    
    it("Should not update risk score above 1000", async function () {
      const { insiderAnalytics, user1 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await insiderAnalytics.registerWallet(user1.address);
      
      await expect(insiderAnalytics.updateRiskScore(user1.address, 1001))
        .to.be.revertedWith("Risk score must be <= 1000");
    });
    
    it("Should not allow unauthorized user to update risk score", async function () {
      const { insiderAnalytics, user1, user2 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await insiderAnalytics.registerWallet(user1.address);
      
      await expect(insiderAnalytics.connect(user2).updateRiskScore(user1.address, 750))
        .to.be.revertedWith("Not authorized analyzer");
    });
  });
  
  describe("Anomaly Detection", function () {
    it("Should record anomaly by authorized analyzer", async function () {
      const { insiderAnalytics, user1 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await insiderAnalytics.registerWallet(user1.address);
      
      await expect(insiderAnalytics.recordAnomaly(
        user1.address,
        "whale_transfer",
        3,
        "Large transfer detected"
      )).to.emit(insiderAnalytics, "AnomalyDetected")
        .withArgs(user1.address, "whale_transfer", 3, await time.latest() + 1);
      
      const anomalies = await insiderAnalytics.getWalletAnomalies(user1.address);
      expect(anomalies.length).to.equal(1);
      expect(anomalies[0].anomalyType).to.equal("whale_transfer");
      expect(anomalies[0].severity).to.equal(3);
    });
    
    it("Should auto-increase risk score for high severity anomalies", async function () {
      const { insiderAnalytics, user1 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await insiderAnalytics.registerWallet(user1.address);
      
      // Record high severity anomaly
      await insiderAnalytics.recordAnomaly(
        user1.address,
        "rugpull_risk",
        5,
        "Suspicious activity detected"
      );
      
      const profile = await insiderAnalytics.walletProfiles(user1.address);
      expect(profile.riskScore).to.equal(750); // 500 + (5 * 50)
    });
    
    it("Should not allow invalid severity levels", async function () {
      const { insiderAnalytics, user1 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await insiderAnalytics.registerWallet(user1.address);
      
      await expect(insiderAnalytics.recordAnomaly(
        user1.address,
        "test",
        0,
        "Invalid severity"
      )).to.be.revertedWith("Invalid severity level");
      
      await expect(insiderAnalytics.recordAnomaly(
        user1.address,
        "test",
        6,
        "Invalid severity"
      )).to.be.revertedWith("Invalid severity level");
    });
  });
  
  describe("Token Unlock Scheduling", function () {
    it("Should schedule token unlock", async function () {
      const { insiderAnalytics, user1 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      const unlockTime = (await time.latest()) + 86400; // 1 day from now
      const amount = ethers.utils.parseEther("1000000");
      
      await expect(insiderAnalytics.scheduleTokenUnlock(
        user1.address, // token address
        unlockTime,
        amount,
        user1.address, // beneficiary
        800 // impact score
      )).to.emit(insiderAnalytics, "TokenUnlockScheduled")
        .withArgs(user1.address, unlockTime, amount);
      
      const unlock = await insiderAnalytics.tokenUnlocks(0);
      expect(unlock.token).to.equal(user1.address);
      expect(unlock.amount).to.equal(amount);
      expect(unlock.impactScore).to.equal(800);
    });
    
    it("Should not schedule unlock in the past", async function () {
      const { insiderAnalytics, user1 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      const pastTime = (await time.latest()) - 86400; // 1 day ago
      const amount = ethers.utils.parseEther("1000000");
      
      await expect(insiderAnalytics.scheduleTokenUnlock(
        user1.address,
        pastTime,
        amount,
        user1.address,
        500
      )).to.be.revertedWith("Unlock time must be in future");
    });
    
    it("Should get upcoming unlocks", async function () {
      const { insiderAnalytics, user1, user2 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      const now = await time.latest();
      const amount = ethers.utils.parseEther("1000000");
      
      // Schedule multiple unlocks
      await insiderAnalytics.scheduleTokenUnlock(
        user1.address,
        now + 3600, // 1 hour
        amount,
        user1.address,
        500
      );
      
      await insiderAnalytics.scheduleTokenUnlock(
        user2.address,
        now + 7200, // 2 hours
        amount,
        user2.address,
        700
      );
      
      const upcomingUnlocks = await insiderAnalytics.getUpcomingUnlocks(86400); // Next 24 hours
      expect(upcomingUnlocks.length).to.equal(2);
    });
  });
  
  describe("Wallet Risk Assessment", function () {
    it("Should return correct wallet risk assessment", async function () {
      const { insiderAnalytics, user1 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await insiderAnalytics.registerWallet(user1.address);
      await insiderAnalytics.updateRiskScore(user1.address, 800);
      await insiderAnalytics.updateWhaleStatus(user1.address, true);
      await insiderAnalytics.recordAnomaly(user1.address, "test", 2, "test");
      
      const [riskScore, isHighRisk, isWhale, anomalyCount] = await insiderAnalytics.getWalletRisk(user1.address);
      
      expect(riskScore).to.equal(800);
      expect(isHighRisk).to.be.true; // >= 700
      expect(isWhale).to.be.true;
      expect(anomalyCount).to.equal(1);
    });
  });
  
  describe("Authorization Management", function () {
    it("Should add authorized analyzer", async function () {
      const { insiderAnalytics, analyzer } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await insiderAnalytics.addAuthorizedAnalyzer(analyzer.address);
      expect(await insiderAnalytics.authorizedAnalyzers(analyzer.address)).to.be.true;
    });
    
    it("Should remove authorized analyzer", async function () {
      const { insiderAnalytics, analyzer } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await insiderAnalytics.addAuthorizedAnalyzer(analyzer.address);
      await insiderAnalytics.removeAuthorizedAnalyzer(analyzer.address);
      expect(await insiderAnalytics.authorizedAnalyzers(analyzer.address)).to.be.false;
    });
    
    it("Should not allow non-owner to manage analyzers", async function () {
      const { insiderAnalytics, user1, analyzer } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await expect(insiderAnalytics.connect(user1).addAuthorizedAnalyzer(analyzer.address))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
  
  describe("Anomaly Resolution", function () {
    it("Should resolve anomaly", async function () {
      const { insiderAnalytics, user1 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await insiderAnalytics.registerWallet(user1.address);
      await insiderAnalytics.recordAnomaly(user1.address, "test", 2, "test");
      
      await insiderAnalytics.resolveAnomaly(user1.address, 0);
      
      const anomalies = await insiderAnalytics.getWalletAnomalies(user1.address);
      expect(anomalies[0].isResolved).to.be.true;
    });
    
    it("Should not resolve invalid anomaly index", async function () {
      const { insiderAnalytics, user1 } = await loadFixture(deployInsiderAnalyticsFixture);
      
      await insiderAnalytics.registerWallet(user1.address);
      
      await expect(insiderAnalytics.resolveAnomaly(user1.address, 0))
        .to.be.revertedWith("Invalid anomaly index");
    });
  });
});