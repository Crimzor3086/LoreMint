/**
 * World Token Service
 * Handles all world-related blockchain interactions
 */

import { ethers } from "ethers";
import { getContractInstance } from "../contracts";
import { getNetworkProvider } from "../network";
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
    const provider = getNetworkProvider();

    const latestBlock = await provider.getBlockNumber();
    const lookbackBlocks = Number(import.meta.env.VITE_EVENT_LOOKBACK_BLOCKS || 50000);
    const fromBlock = Math.max(0, Number(latestBlock) - lookbackBlocks);

    const filter = contract.filters.WorldMinted(null, address);
    const events = await contract.queryFilter(filter, fromBlock, latestBlock);

    if (!events.length) {
      return [];
    }

    const worlds = await Promise.all(
      events.map(async (event) => {
        try {
          const tokenId =
            event.args?.tokenId?.toString() ??
            event.args?.[0]?.toString();

          if (!tokenId) {
            return null;
          }

          const owner = await contract.ownerOf(tokenId);
          if (owner.toLowerCase() !== address.toLowerCase()) {
            return null;
          }

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
          } as World;
        } catch (err) {
          console.warn("Failed to parse world event", err);
          return null;
        }
      })
    );

    const uniqueWorlds: World[] = [];
    const seenTokenIds = new Set<string>();

    for (const world of worlds) {
      if (!world || seenTokenIds.has(world.id)) {
        continue;
      }
      seenTokenIds.add(world.id);
      uniqueWorlds.push(world);
    }

    return uniqueWorlds;
  } catch (error: any) {
    if (error?.message?.includes("not deployed") || error?.code === "BAD_DATA") {
      console.warn("WorldToken contract not deployed yet or invalid");
      return [];
    }
    console.error("Error fetching user worlds:", error);
    return [];
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
    const eventSignature = ethers.id("WorldMinted(uint256,address,string)");
    const event = receipt.logs.find(
      (log: any) => log.topics && log.topics[0] === eventSignature
    );
    
    let tokenId = "0";
    if (event && event.topics && event.topics[1]) {
      // topics[1] contains the tokenId (first indexed parameter)
      tokenId = BigInt(event.topics[1]).toString();
    } else if (event && event.args && event.args[0] !== undefined) {
      // Fallback to args
      tokenId = event.args[0].toString();
    }

    return {
      tokenId: tokenId.toString(),
      txHash: receipt.hash,
    };
  } catch (error) {
    console.error("Error minting world:", error);
    throw error;
  }
}

