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
    
    let balance: bigint;
    try {
      balance = await contract.balanceOf(address);
    } catch (error: any) {
      if (error?.message?.includes("not deployed") || error?.code === "BAD_DATA") {
        console.warn("PlotToken contract not deployed or invalid address");
        return [];
      }
      throw error;
    }

    if (balance === 0n) {
      return [];
    }

    const plots: PlotArc[] = [];

    try {
      for (let i = 0; i < Number(balance); i++) {
        try {
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
        } catch (err) {
          break;
        }
      }
    } catch (error: any) {
      console.warn("PlotToken doesn't support token enumeration");
      return [];
    }

    return plots;
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

