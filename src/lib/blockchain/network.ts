/**
 * Story Aeneid network helper utilities
 */

import { ethers } from "ethers";

export interface NetworkConfig {
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

const FALLBACK_RPC_URL = "https://aeneid.storyrpc.io";
const FALLBACK_EXPLORER_URL = "https://aeneid.storyscan.xyz";

export const STORY_AENEID_TESTNET: NetworkConfig = {
  rpcUrl:
    import.meta.env.VITE_STORY_AENEID_RPC_URL ||
    import.meta.env.VITE_NETWORK_RPC_URL ||
    import.meta.env.VITE_MANTLE_SEPOLIA_RPC_URL ||
    FALLBACK_RPC_URL,
  chainId: Number(import.meta.env.VITE_STORY_AENEID_CHAIN_ID || 1315),
  networkName:
    import.meta.env.VITE_STORY_AENEID_NETWORK_NAME || "Story Aeneid Testnet",
  nativeCurrency: {
    name:
      import.meta.env.VITE_STORY_AENEID_NATIVE_NAME ||
      "Imagination Protocol",
    symbol: import.meta.env.VITE_STORY_AENEID_NATIVE_SYMBOL || "IP",
    decimals: Number(import.meta.env.VITE_STORY_AENEID_NATIVE_DECIMALS || 18),
  },
  blockExplorerUrl:
    import.meta.env.VITE_STORY_AENEID_BLOCK_EXPLORER || FALLBACK_EXPLORER_URL,
};

export const NETWORK_CONFIG = STORY_AENEID_TESTNET;

/**
 * Get provider for Story Aeneid network
 */
export function getNetworkProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
}

/**
 * Get current network configuration
 */
export function getCurrentNetwork(): NetworkConfig {
  return NETWORK_CONFIG;
}

/**
 * Ensure MetaMask is on Story Aeneid
 */
export async function switchToNetwork(): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }],
    });
    return true;
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}`,
              chainName: NETWORK_CONFIG.networkName,
              nativeCurrency: NETWORK_CONFIG.nativeCurrency,
              rpcUrls: [NETWORK_CONFIG.rpcUrl],
              blockExplorerUrls: [NETWORK_CONFIG.blockExplorerUrl],
            },
          ],
        });
        return true;
      } catch (addError) {
        throw new Error("Failed to add Story Aeneid network to MetaMask");
      }
    }
    throw switchError;
  }
}

/**
 * Get IP balance
 */
export async function getBalance(address: string): Promise<string> {
  const provider = getNetworkProvider();
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

