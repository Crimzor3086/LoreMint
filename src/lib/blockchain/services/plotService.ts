/**
 * Plot Token Service
 * Handles all plot-related blockchain interactions
 */

import { ethers } from "ethers";
import { getContractInstance } from "../contracts";
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
    const balance = await contract.balanceOf(address);
    const plots: PlotArc[] = [];

    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(address, i);
      const metadata = await contract.plots(tokenId);
      
      plots.push({
        id: tokenId.toString(),
        title: metadata.title,
        description: metadata.description,
        characters: metadata.characterIds.map((id: bigint) => id.toString()),
        worldId: metadata.worldId.toString(),
        creator: metadata.creator,
        createdAt: new Date(Number(metadata.createdAt) * 1000),
        status: "minted",
      });
    }

    return plots;
  } catch (error: any) {
    // If contract not deployed, return empty array
    if (error?.message?.includes("not deployed")) {
      console.warn("PlotToken contract not deployed yet");
      return [];
    }
    console.error("Error fetching user plots:", error);
    throw error;
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
    const event = receipt.logs.find(
      (log: any) => log.topics[0] === ethers.id("PlotMinted(uint256,address,string)")
    );
    
    const tokenId = event ? ethers.toNumber(event.topics[1]) : "0";

    return {
      tokenId: tokenId.toString(),
      txHash: receipt.hash,
    };
  } catch (error) {
    console.error("Error minting plot:", error);
    throw error;
  }
}

