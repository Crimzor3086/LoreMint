import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mantle: {
      url: process.env.MANTLE_RPC_URL || 
        (process.env.ALCHEMY_API_KEY 
          ? `https://mantle-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
          : "https://rpc.mantle.xyz"),
      chainId: 5000,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
    mantleTestnet: {
      url: process.env.MANTLE_TESTNET_RPC_URL || "https://rpc.testnet.mantle.xyz",
      chainId: 5001,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
    hardhat: {
      chainId: 1337,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: {
      mantle: process.env.MANTLE_EXPLORER_API_KEY || "",
      mantleTestnet: process.env.MANTLE_EXPLORER_API_KEY || "",
    },
    customChains: [
      {
        network: "mantle",
        chainId: 5000,
        urls: {
          apiURL: "https://explorer.mantle.xyz/api",
          browserURL: "https://explorer.mantle.xyz",
        },
      },
      {
        network: "mantleTestnet",
        chainId: 5001,
        urls: {
          apiURL: "https://explorer.testnet.mantle.xyz/api",
          browserURL: "https://explorer.testnet.mantle.xyz",
        },
      },
    ],
  },
};

export default config;

