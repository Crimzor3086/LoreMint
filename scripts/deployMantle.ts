/**
 * Mantle Smart Contract Deployment Script
 * 
 * This script deploys all LoreMint contracts to Mantle network
 * 
 * Usage:
 *   npx hardhat run scripts/deployMantle.ts --network mantle
 *   npx hardhat run scripts/deployMantle.ts --network mantleTestnet
 */

import hre from "hardhat";
import pkg from "hardhat";
const { ethers } = pkg;
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Network:", network.name, "Chain ID:", network.chainId.toString());
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MNT");

  // Base URI for metadata (update with your actual metadata server URL)
  const baseURI = process.env.BASE_URI || "https://api.loremint.com/metadata/";

  // Deploy CharacterToken
  console.log("\n📝 Deploying CharacterToken...");
  const CharacterToken = await ethers.getContractFactory("CharacterToken");
  const characterToken = await CharacterToken.deploy(`${baseURI}character/`);
  await characterToken.waitForDeployment();
  const characterTokenAddress = await characterToken.getAddress();
  console.log("✅ CharacterToken deployed to:", characterTokenAddress);

  // Deploy WorldToken
  console.log("\n🌍 Deploying WorldToken...");
  const WorldToken = await ethers.getContractFactory("WorldToken");
  const worldToken = await WorldToken.deploy(`${baseURI}world/`);
  await worldToken.waitForDeployment();
  const worldTokenAddress = await worldToken.getAddress();
  console.log("✅ WorldToken deployed to:", worldTokenAddress);

  // Deploy PlotToken
  console.log("\n📖 Deploying PlotToken...");
  const PlotToken = await ethers.getContractFactory("PlotToken");
  const plotToken = await PlotToken.deploy(`${baseURI}plot/`);
  await plotToken.waitForDeployment();
  const plotTokenAddress = await plotToken.getAddress();
  console.log("✅ PlotToken deployed to:", plotTokenAddress);

  // Deploy ContributionManager
  console.log("\n🤝 Deploying ContributionManager...");
  const ContributionManager = await ethers.getContractFactory("ContributionManager");
  const contributionManager = await ContributionManager.deploy();
  await contributionManager.waitForDeployment();
  const contributionManagerAddress = await contributionManager.getAddress();
  console.log("✅ ContributionManager deployed to:", contributionManagerAddress);

  // Save deployment addresses
  const networkName = hre.network.name;
  const deploymentInfo = {
    network: networkName,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      CharacterToken: characterTokenAddress,
      WorldToken: worldTokenAddress,
      PlotToken: plotTokenAddress,
      ContributionManager: contributionManagerAddress,
    },
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${networkName}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📄 Deployment info saved to:", deploymentFile);

  // Generate .env file update instructions
  console.log("\n📋 Update your .env file with these addresses:");
  console.log("VITE_CHARACTER_TOKEN_ADDRESS=" + characterTokenAddress);
  console.log("VITE_WORLD_TOKEN_ADDRESS=" + worldTokenAddress);
  console.log("VITE_PLOT_TOKEN_ADDRESS=" + plotTokenAddress);
  console.log("VITE_CONTRIBUTION_MANAGER_ADDRESS=" + contributionManagerAddress);

  // Verify contracts (optional, requires API key)
  if (process.env.MANTLE_EXPLORER_API_KEY) {
    console.log("\n🔍 Verifying contracts on explorer...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for explorer to index

      await hre.run("verify:verify", {
        address: characterTokenAddress,
        constructorArguments: [`${baseURI}character/`],
      });
      console.log("✅ CharacterToken verified");

      await hre.run("verify:verify", {
        address: worldTokenAddress,
        constructorArguments: [`${baseURI}world/`],
      });
      console.log("✅ WorldToken verified");

      await hre.run("verify:verify", {
        address: plotTokenAddress,
        constructorArguments: [`${baseURI}plot/`],
      });
      console.log("✅ PlotToken verified");

      await hre.run("verify:verify", {
        address: contributionManagerAddress,
        constructorArguments: [],
      });
      console.log("✅ ContributionManager verified");
    } catch (error) {
      console.log("⚠️  Verification failed (this is optional):", error);
    }
  }

  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
