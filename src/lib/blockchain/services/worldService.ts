/**
 * World Token Service
 * Handles all world-related blockchain interactions
 */

import { ethers } from "ethers";
import { getContractInstance } from "../contracts";
import { getMantleProvider } from "../mantle";
import WorldTokenABI from "../abis/WorldToken.json";
import { World } from "@/types";

export interface WorldMetadata {
  name: string;
  geography: string;
  culture: string;
  era: string;
  description: string;
  creator: string;
  createdAt: bigint;
}

/**
 * Get all worlds owned by an address
 */
export async function getUserWorlds(address: string): Promise<World[]> {
  try {
    const contract = getContractInstance("WORLD_TOKEN", WorldTokenABI);
    const balance = await contract.balanceOf(address);
    const worlds: World[] = [];

    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(address, i);
      const metadata = await contract.worlds(tokenId);
      
      worlds.push({
        id: tokenId.toString(),
        name: metadata.name,
        geography: metadata.geography,
        culture: metadata.culture,
        era: metadata.era,
        description: metadata.description,
        creator: metadata.creator,
        createdAt: new Date(Number(metadata.createdAt) * 1000),
        mintedAsIP: true,
      });
    }

    return worlds;
  } catch (error: any) {
    // If contract not deployed, return empty array
    if (error?.message?.includes("not deployed")) {
      console.warn("WorldToken contract not deployed yet");
      return [];
    }
    console.error("Error fetching user worlds:", error);
    throw error;
  }
}

/**
 * Get a single world by token ID
 */
export async function getWorld(tokenId: string): Promise<World | null> {
  const contract = getContractInstance("WORLD_TOKEN", WorldTokenABI);
  
  try {
    const metadata = await contract.worlds(tokenId);
    
    return {
      id: tokenId,
      name: metadata.name,
      geography: metadata.geography,
      culture: metadata.culture,
      era: metadata.era,
      description: metadata.description,
      creator: metadata.creator,
      createdAt: new Date(Number(metadata.createdAt) * 1000),
      mintedAsIP: true,
    };
  } catch (error) {
    console.error("Error fetching world:", error);
    return null;
  }
}

/**
 * Mint a new world token
 */
export async function mintWorld(
  signer: ethers.Signer,
  name: string,
  geography: string,
  culture: string,
  era: string,
  description: string
): Promise<{ tokenId: string; txHash: string }> {
  const contract = getContractInstance("WORLD_TOKEN", WorldTokenABI, signer);
  const address = await signer.getAddress();

  try {
    const tx = await contract.mint(address, name, geography, culture, era, description);
    const receipt = await tx.wait();

    // Extract token ID from event
    const event = receipt.logs.find(
      (log: any) => log.topics[0] === ethers.id("WorldMinted(uint256,address,string)")
    );
    
    const tokenId = event ? ethers.toNumber(event.topics[1]) : "0";

    return {
      tokenId: tokenId.toString(),
      txHash: receipt.hash,
    };
  } catch (error) {
    console.error("Error minting world:", error);
    throw error;
  }
}

