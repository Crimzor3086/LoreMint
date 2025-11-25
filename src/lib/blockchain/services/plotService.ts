/**
 * Plot Token Service
 * Handles all plot-related blockchain interactions
 */

import { ethers } from "ethers";
import { getContractInstance } from "../contracts";
import { getNetworkProvider } from "../network";
import PlotTokenABI from "../abis/PlotToken.json";
import { PlotArc } from "@/types";

export interface PlotMetadata {
  title: string;
  description: string;
  characterIds: bigint[];
  worldId: bigint;
  creator: string;
  createdAt: bigint;
}

/**
 * Get all plots owned by an address
 */
export async function getUserPlots(address: string): Promise<PlotArc[]> {
  try {
    const contract = getContractInstance("PLOT_TOKEN", PlotTokenABI);
    const provider = getNetworkProvider();

    const latestBlock = await provider.getBlockNumber();
    const lookbackBlocks = Number(import.meta.env.VITE_EVENT_LOOKBACK_BLOCKS || 50000);
    const fromBlock = Math.max(0, Number(latestBlock) - lookbackBlocks);

    const filter = contract.filters.PlotMinted(null, address);
    const events = await contract.queryFilter(filter, fromBlock, latestBlock);

    if (!events.length) {
      return [];
    }

    const plots = await Promise.all(
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

          const metadata = await contract.plots(tokenId);

          return {
            id: tokenId,
            title: metadata.title,
            description: metadata.description,
            characters: metadata.characterIds.map((id: bigint) => id.toString()),
            worldId: metadata.worldId.toString(),
            creator: metadata.creator,
            createdAt: new Date(Number(metadata.createdAt) * 1000),
            status: "minted",
          } as PlotArc;
        } catch (err) {
          console.warn("Failed to parse plot event", err);
          return null;
        }
      })
    );

    const uniquePlots: PlotArc[] = [];
    const seenTokenIds = new Set<string>();

    for (const plot of plots) {
      if (!plot || seenTokenIds.has(plot.id)) {
        continue;
      }
      seenTokenIds.add(plot.id);
      uniquePlots.push(plot);
    }

    return uniquePlots;
  } catch (error: any) {
    if (error?.message?.includes("not deployed") || error?.code === "BAD_DATA") {
      console.warn("PlotToken contract not deployed yet or invalid");
      return [];
    }
    console.error("Error fetching user plots:", error);
    return [];
  }
}

/**
 * Get a single plot by token ID
 */
export async function getPlot(tokenId: string): Promise<PlotArc | null> {
  const contract = getContractInstance("PLOT_TOKEN", PlotTokenABI);
  
  try {
    const metadata = await contract.plots(tokenId);
    
    return {
      id: tokenId,
      title: metadata.title,
      description: metadata.description,
      characters: metadata.characterIds.map((id: bigint) => id.toString()),
      worldId: metadata.worldId.toString(),
      creator: metadata.creator,
      createdAt: new Date(Number(metadata.createdAt) * 1000),
      status: "minted",
    };
  } catch (error) {
    console.error("Error fetching plot:", error);
    return null;
  }
}

/**
 * Mint a new plot token
 */
export async function mintPlot(
  signer: ethers.Signer,
  title: string,
  description: string,
  characterIds: string[],
  worldId: string
): Promise<{ tokenId: string; txHash: string }> {
  const contract = getContractInstance("PLOT_TOKEN", PlotTokenABI, signer);
  const address = await signer.getAddress();

  try {
    const charIds = characterIds.map(id => BigInt(id));
    const worldIdBigInt = BigInt(worldId);
    
    const tx = await contract.mint(address, title, description, charIds, worldIdBigInt);
    const receipt = await tx.wait();

    // Extract token ID from event
    const eventSignature = ethers.id("PlotMinted(uint256,address,string)");
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
    console.error("Error minting plot:", error);
    throw error;
  }
}

