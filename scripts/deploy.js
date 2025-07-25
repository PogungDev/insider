const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of InsiderAnalytics contract...");
  
  // Get the ContractFactory and Signers here.
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("📝 Deploying contracts with the account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());
  
  // Deploy InsiderAnalytics contract
  const InsiderAnalytics = await hre.ethers.getContractFactory("InsiderAnalytics");
  
  console.log("⏳ Deploying InsiderAnalytics contract...");
  const insiderAnalytics = await InsiderAnalytics.deploy();
  
  await insiderAnalytics.deployed();
  
  console.log("✅ InsiderAnalytics deployed to:", insiderAnalytics.address);
  console.log("🔗 Transaction hash:", insiderAnalytics.deployTransaction.hash);
  
  // Wait for a few block confirmations
  console.log("⏳ Waiting for block confirmations...");
  await insiderAnalytics.deployTransaction.wait(5);
  
  // Verify contract on Etherscan (if not on localhost)
  const network = await hre.network.name;
  if (network !== "hardhat" && network !== "localhost") {
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: insiderAnalytics.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Error verifying contract:", error.message);
    }
  }
  
  // Save deployment info
  const deploymentInfo = {
    network: network,
    contractAddress: insiderAnalytics.address,
    deployerAddress: deployer.address,
    transactionHash: insiderAnalytics.deployTransaction.hash,
    blockNumber: insiderAnalytics.deployTransaction.blockNumber,
    timestamp: new Date().toISOString(),
    gasUsed: insiderAnalytics.deployTransaction.gasLimit?.toString(),
  };
  
  console.log("\n📋 Deployment Summary:");
  console.log("========================");
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Contract Address: ${deploymentInfo.contractAddress}`);
  console.log(`Deployer: ${deploymentInfo.deployerAddress}`);
  console.log(`Transaction: ${deploymentInfo.transactionHash}`);
  console.log(`Block Number: ${deploymentInfo.blockNumber}`);
  console.log(`Timestamp: ${deploymentInfo.timestamp}`);
  
  // Save to file for frontend integration
  const fs = require('fs');
  const path = require('path');
  
  const deploymentDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentDir, `${network}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);
  
  // Generate ABI file for frontend
  const artifactPath = path.join(__dirname, '../artifacts/contracts/InsiderAnalytics.sol/InsiderAnalytics.json');
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const abiFile = path.join(deploymentDir, 'InsiderAnalytics.abi.json');
    fs.writeFileSync(abiFile, JSON.stringify(artifact.abi, null, 2));
    console.log(`📄 ABI saved to: ${abiFile}`);
  }
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📚 Next steps:");
  console.log("1. Update your frontend configuration with the contract address");
  console.log("2. Add the contract address to your environment variables");
  console.log("3. Test the contract functions using the provided scripts");
  console.log("4. Set up event listeners for real-time monitoring");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });