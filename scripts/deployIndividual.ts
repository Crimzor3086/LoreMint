/**
 * Deploy Individual Contract Script
 * 
 * Deploy contracts one at a time to Mantle Sepolia
 * 
 * Usage:
 *   npx hardhat run scripts/deployIndividual.ts --network mantleSepolia
 */

import hre from "hardhat";
import pkg from "hardhat";
const { ethers } = pkg;
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("Deploying contract with the account:", deployer.address);
  console.log("Network:", hre.network.name, "Chain ID:", network.chainId.toString());
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MNT\n");

  const contractName = process.env.CONTRACT_NAME || "CharacterToken";
  const baseURI = process.env.BASE_URI || "https://api.loremint.com/metadata/";

  console.log(`📝 Deploying ${contractName}...`);

  let contract;
  let contractAddress;
  let constructorArgs: any[] = [];

  switch (contractName) {
    case "CharacterToken":
      const CharacterToken = await ethers.getContractFactory("CharacterToken");
      constructorArgs = [`${baseURI}character/`];
      contract = await CharacterToken.deploy(...constructorArgs);
      await contract.waitForDeployment();
      contractAddress = await contract.getAddress();
      break;

    case "WorldToken":
      const WorldToken = await ethers.getContractFactory("WorldToken");
      constructorArgs = [`${baseURI}world/`];
      contract = await WorldToken.deploy(...constructorArgs);
      await contract.waitForDeployment();
      contractAddress = await contract.getAddress();
      break;

    case "PlotToken":
      const PlotToken = await ethers.getContractFactory("PlotToken");
      constructorArgs = [`${baseURI}plot/`];
      contract = await PlotToken.deploy(...constructorArgs);
      await contract.waitForDeployment();
      contractAddress = await contract.getAddress();
      break;

    case "ContributionManager":
      const ContributionManager = await ethers.getContractFactory("ContributionManager");
      constructorArgs = [];
      contract = await ContributionManager.deploy();
      await contract.waitForDeployment();
      contractAddress = await contract.getAddress();
      break;

    default:
      throw new Error(`Unknown contract: ${contractName}`);
  }

  console.log(`✅ ${contractName} deployed to: ${contractAddress}`);

  // Load existing deployment info or create new
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  let deploymentInfo: any = {};

  if (fs.existsSync(deploymentFile)) {
    deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  } else {
    deploymentInfo = {
      network: hre.network.name,
      chainId: network.chainId.toString(),
      deployer: deployer.address,
      contracts: {},
    };
  }

  deploymentInfo.contracts = deploymentInfo.contracts || {};
  deploymentInfo.contracts[contractName] = contractAddress;
  deploymentInfo.lastUpdated = new Date().toISOString();

  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📄 Deployment info saved to:", deploymentFile);

  console.log(`\n📋 Add to your .env file:`);
  const envVar = `VITE_${contractName.toUpperCase().replace("TOKEN", "_TOKEN").replace("MANAGER", "_MANAGER")}_ADDRESS`;
  console.log(`${envVar}=${contractAddress}`);

  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

