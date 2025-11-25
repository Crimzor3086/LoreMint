require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
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
    storyAeneid: {
      url:
        process.env.STORY_AENEID_RPC_URL ||
        process.env.NETWORK_RPC_URL ||
        "https://aeneid.storyrpc.io",
      chainId: 1315,
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
      storyAeneid: process.env.STORY_AENEID_EXPLORER_API_KEY || "",
    },
    customChains: [
      {
        network: "storyAeneid",
        chainId: 1315,
        urls: {
          apiURL:
            process.env.STORY_AENEID_EXPLORER_API_URL ||
            "https://aeneid.storyscan.xyz/api",
          browserURL: "https://aeneid.storyscan.xyz",
        },
      },
    ],
  },
};

module.exports = config;

