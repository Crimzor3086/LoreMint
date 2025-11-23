/**
 * Mantle Network SDK / RPC functions
 * Handles Mantle network interactions for LoreMint
 */

import { ethers } from "ethers";

export interface MantleConfig {
  rpcUrl: string;
  chainId: number;
  networkName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrl: string;
}

// Mantle Mainnet Configuration
export const MANTLE_MAINNET: MantleConfig = {
  rpcUrl: import.meta.env.VITE_MANTLE_RPC_URL || 
    (import.meta.env.VITE_ALCHEMY_API_KEY 
      ? `https://mantle-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`
      : "https://rpc.mantle.xyz"),
  chainId: 5000, // Mantle Mainnet
  networkName: "Mantle",
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT",
    decimals: 18,
  },
  blockExplorerUrl: "https://explorer.mantle.xyz",
};

// Mantle Testnet Configuration
export const MANTLE_TESTNET: MantleConfig = {
  rpcUrl: import.meta.env.VITE_MANTLE_TESTNET_RPC_URL || "https://rpc.testnet.mantle.xyz",
  chainId: 5001, // Mantle Testnet
  networkName: "Mantle Testnet",
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT",
    decimals: 18,
  },
  blockExplorerUrl: "https://explorer.testnet.mantle.xyz",
};

// Use mainnet by default
export const MANTLE_CONFIG = MANTLE_MAINNET;

/**
 * Get provider for Mantle network
 */
export function getMantleProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(MANTLE_CONFIG.rpcUrl);
}

/**
 * Get current network configuration
 */
export function getCurrentNetwork(): MantleConfig {
  return MANTLE_CONFIG;
}

/**
 * Switch MetaMask to Mantle network
 */
export async function switchToMantle(): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${MANTLE_CONFIG.chainId.toString(16)}` }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${MANTLE_CONFIG.chainId.toString(16)}`,
              chainName: MANTLE_CONFIG.networkName,
              nativeCurrency: MANTLE_CONFIG.nativeCurrency,
              rpcUrls: [MANTLE_CONFIG.rpcUrl],
              blockExplorerUrls: [MANTLE_CONFIG.blockExplorerUrl],
            },
          ],
        });
        return true;
      } catch (addError) {
        throw new Error("Failed to add Mantle network to MetaMask");
      }
    }
    throw switchError;
  }
}

/**
 * Get account balance in MNT
 */
export async function getBalance(address: string): Promise<string> {
  const provider = getMantleProvider();
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

