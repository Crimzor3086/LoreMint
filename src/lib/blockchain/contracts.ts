/**
 * Contract ABI imports & helpers
 * Handles Mantle smart contract interactions
 */

import { ethers } from "ethers";
import { getMantleProvider, MANTLE_CONFIG } from "./mantle";

export interface ContractConfig {
  address: string;
  abi: any[];
  chainId: number;
}

// Contract addresses (to be updated with deployed addresses)
export const CONTRACTS = {
  CHARACTER_TOKEN: {
    address: import.meta.env.VITE_CHARACTER_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",
    chainId: MANTLE_CONFIG.chainId,
  },
  WORLD_TOKEN: {
    address: import.meta.env.VITE_WORLD_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",
    chainId: MANTLE_CONFIG.chainId,
  },
  PLOT_TOKEN: {
    address: import.meta.env.VITE_PLOT_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",
    chainId: MANTLE_CONFIG.chainId,
  },
  CONTRIBUTION_MANAGER: {
    address: import.meta.env.VITE_CONTRIBUTION_MANAGER_ADDRESS || "0x0000000000000000000000000000000000000000",
    chainId: MANTLE_CONFIG.chainId,
  },
} as const;

/**
 * Get contract instance
 */
export function getContract(contractName: keyof typeof CONTRACTS): ContractConfig {
  return CONTRACTS[contractName];
}

/**
 * Get contract instance with ethers.js
 */
export function getContractInstance(
  contractName: keyof typeof CONTRACTS,
  abi: any[],
  signerOrProvider?: ethers.Signer | ethers.Provider
): ethers.Contract {
  const contract = CONTRACTS[contractName];
  const provider = signerOrProvider || getMantleProvider();
  return new ethers.Contract(contract.address, abi, provider);
}

/**
 * Read from contract
 */
export async function readContract(
  contractName: keyof typeof CONTRACTS,
  abi: any[],
  functionName: string,
  args: any[] = []
): Promise<any> {
  const contract = getContractInstance(contractName, abi);
  return await contract[functionName](...args);
}

/**
 * Write to contract (transaction)
 */
export async function writeContract(
  contractName: keyof typeof CONTRACTS,
  abi: any[],
  functionName: string,
  args: any[] = [],
  value?: string
): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = getContractInstance(contractName, abi, signer);

  const tx = await contract[functionName](...args, {
    value: value ? ethers.parseEther(value) : undefined,
  });

  return tx.hash;
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(txHash: string): Promise<ethers.TransactionReceipt> {
  const provider = getMantleProvider();
  return await provider.waitForTransaction(txHash);
}
