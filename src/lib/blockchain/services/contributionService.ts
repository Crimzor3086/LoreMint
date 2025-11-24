/**
 * Contribution Manager Service
 * Handles all contribution-related blockchain interactions
 */

import { ethers } from "ethers";
import { getContractInstance } from "../contracts";
import { getMantleProvider } from "../mantle";
import ContributionManagerABI from "../abis/ContributionManager.json";
import { Contribution } from "@/types";

export interface ContributionData {
  id: bigint;
  contributionType: number; // 0: Character, 1: Story, 2: Artwork, 3: Expansion
  title: string;
  description: string;
  contributor: string;
  assetId: bigint;
  status: number; // 0: Pending, 1: Approved, 2: Rejected
  votes: bigint;
  royaltyPercentage: bigint;
  createdAt: bigint;
}

const CONTRIBUTION_TYPE_MAP: Record<number, Contribution["type"]> = {
  0: "character",
  1: "story",
  2: "artwork",
  3: "expansion",
};

const STATUS_MAP: Record<number, Contribution["status"]> = {
  0: "pending",
  1: "approved",
  2: "rejected",
};

/**
 * Get all contributions by querying events
 */
export async function getAllContributions(): Promise<Contribution[]> {
  try {
    const contract = getContractInstance("CONTRIBUTION_MANAGER", ContributionManagerABI);
    const provider = getMantleProvider();
    
    if (!provider) {
      console.warn("No provider available");
      return [];
    }

    // Query ContributionSubmitted events to get all contribution IDs
    const filter = contract.filters.ContributionSubmitted();
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000); // Last 10k blocks (adjust as needed)
    
    try {
      const events = await contract.queryFilter(filter, fromBlock, currentBlock);
      const contributionIds = new Set<string>();
      
      // Extract unique contribution IDs from events
      // The first indexed parameter (contributionId) is in topics[1]
      events.forEach((event) => {
        if (event.topics && event.topics[1]) {
          // topics[0] is the event signature, topics[1] is the first indexed param
          const contributionId = BigInt(event.topics[1]).toString();
          contributionIds.add(contributionId);
        } else if (event.args && event.args[0] !== undefined) {
          // Fallback to args if topics not available
          contributionIds.add(event.args[0].toString());
        }
      });

      // Fetch each contribution's data
      const contributions: Contribution[] = [];
      for (const id of contributionIds) {
        try {
          const data = await contract.contributions(id);
          contributions.push(mapContributionData(data, id));
        } catch (err) {
          // Skip invalid contribution IDs
          console.warn(`Failed to fetch contribution ${id}:`, err);
          continue;
        }
      }

      // Sort by creation date (newest first)
      contributions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      return contributions;
    } catch (eventError) {
      console.warn("Error querying events, falling back to empty array:", eventError);
      return [];
    }
  } catch (error: any) {
    if (error?.message?.includes("not deployed")) {
      console.warn("ContributionManager contract not deployed yet");
      return [];
    }
    console.error("Error fetching contributions:", error);
    return [];
  }
}

/**
 * Get contributions by contributor address
 */
export async function getContributionsByAddress(address: string): Promise<Contribution[]> {
  try {
    const contract = getContractInstance("CONTRIBUTION_MANAGER", ContributionManagerABI);
    
    const contributionIds = await contract.contributorContributions(address);
    const contributions: Contribution[] = [];

    for (const id of contributionIds) {
      try {
        const data = await contract.contributions(id);
        contributions.push(mapContributionData(data, id.toString()));
      } catch (err) {
        // Skip invalid contribution IDs
        continue;
      }
    }

    return contributions;
  } catch (error: any) {
    if (error?.message?.includes("not deployed") || error?.code === "BAD_DATA") {
      console.warn("ContributionManager contract not deployed yet or invalid");
      return [];
    }
    console.error("Error fetching contributions by address:", error);
    return [];
  }
}

/**
 * Get contributions for a specific asset
 */
export async function getContributionsByAsset(assetId: string): Promise<Contribution[]> {
  try {
    const contract = getContractInstance("CONTRIBUTION_MANAGER", ContributionManagerABI);
    
    const contributionIds = await contract.assetContributions(assetId);
    const contributions: Contribution[] = [];

    for (const id of contributionIds) {
      try {
        const data = await contract.contributions(id);
        contributions.push(mapContributionData(data, id.toString()));
      } catch (err) {
        continue;
      }
    }

    return contributions;
  } catch (error: any) {
    if (error?.message?.includes("not deployed") || error?.code === "BAD_DATA") {
      console.warn("ContributionManager contract not deployed yet or invalid");
      return [];
    }
    console.error("Error fetching contributions by asset:", error);
    return [];
  }
}

/**
 * Submit a new contribution
 */
export async function submitContribution(
  signer: ethers.Signer,
  type: Contribution["type"],
  title: string,
  description: string,
  assetId: string
): Promise<{ contributionId: string; txHash: string }> {
  const contract = getContractInstance("CONTRIBUTION_MANAGER", ContributionManagerABI, signer);

  const typeMap: Record<Contribution["type"], number> = {
    character: 0,
    story: 1,
    artwork: 2,
    expansion: 3,
  };

  try {
    const tx = await contract.submitContribution(
      typeMap[type],
      title,
      description,
      BigInt(assetId)
    );
    const receipt = await tx.wait();

    // Extract contribution ID from event
    const eventSignature = ethers.id("ContributionSubmitted(uint256,address,uint256)");
    const event = receipt.logs.find(
      (log: any) => log.topics && log.topics[0] === eventSignature
    );
    
    let contributionId = "0";
    if (event && event.topics && event.topics[1]) {
      // topics[1] contains the contributionId (first indexed parameter)
      contributionId = BigInt(event.topics[1]).toString();
    } else if (event && event.args && event.args[0] !== undefined) {
      // Fallback to args
      contributionId = event.args[0].toString();
    }

    return {
      contributionId: contributionId.toString(),
      txHash: receipt.hash,
    };
  } catch (error) {
    console.error("Error submitting contribution:", error);
    throw error;
  }
}

/**
 * Vote on a contribution
 */
export async function voteContribution(
  signer: ethers.Signer,
  contributionId: string
): Promise<string> {
  const contract = getContractInstance("CONTRIBUTION_MANAGER", ContributionManagerABI, signer);

  try {
    const tx = await contract.voteContribution(BigInt(contributionId));
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error("Error voting on contribution:", error);
    throw error;
  }
}

/**
 * Approve a contribution (owner only)
 */
export async function approveContribution(
  signer: ethers.Signer,
  contributionId: string,
  royaltyPercentage: number
): Promise<string> {
  const contract = getContractInstance("CONTRIBUTION_MANAGER", ContributionManagerABI, signer);

  try {
    const tx = await contract.approveContribution(BigInt(contributionId), royaltyPercentage);
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error("Error approving contribution:", error);
    throw error;
  }
}

/**
 * Reject a contribution (owner only)
 */
export async function rejectContribution(
  signer: ethers.Signer,
  contributionId: string
): Promise<string> {
  const contract = getContractInstance("CONTRIBUTION_MANAGER", ContributionManagerABI, signer);

  try {
    const tx = await contract.rejectContribution(BigInt(contributionId));
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error("Error rejecting contribution:", error);
    throw error;
  }
}

/**
 * Map contract data to Contribution type
 */
function mapContributionData(data: ContributionData, id: string): Contribution {
  return {
    id,
    type: CONTRIBUTION_TYPE_MAP[data.contributionType] || "story",
    title: data.title,
    description: data.description,
    contributorAddress: data.contributor,
    status: STATUS_MAP[data.status] || "pending",
    votes: Number(data.votes),
    createdAt: new Date(Number(data.createdAt) * 1000),
    assetId: data.assetId.toString(),
  };
}

