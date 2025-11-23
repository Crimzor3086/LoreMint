/**
 * Contribution Manager Service
 * Handles all contribution-related blockchain interactions
 */

import { ethers } from "ethers";
import { getContractInstance } from "../contracts";
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
 * Get all contributions
 */
export async function getAllContributions(): Promise<Contribution[]> {
  const contract = getContractInstance("CONTRIBUTION_MANAGER", ContributionManagerABI);
  
  try {
    // Note: This is a simplified version. In production, you'd need to track contribution IDs
    // or use events to get all contributions. For now, we'll need to know the max ID or use events.
    // This is a placeholder that would need to be implemented based on your contract's design.
    
    // TODO: Implement proper fetching mechanism (events, indexer, etc.)
    return [];
  } catch (error) {
    console.error("Error fetching contributions:", error);
    throw error;
  }
}

/**
 * Get contributions by contributor address
 */
export async function getContributionsByAddress(address: string): Promise<Contribution[]> {
  const contract = getContractInstance("CONTRIBUTION_MANAGER", ContributionManagerABI);
  
  try {
    const contributionIds = await contract.contributorContributions(address);
    const contributions: Contribution[] = [];

    for (const id of contributionIds) {
      const data = await contract.contributions(id);
      contributions.push(mapContributionData(data, id.toString()));
    }

    return contributions;
  } catch (error) {
    console.error("Error fetching contributions by address:", error);
    throw error;
  }
}

/**
 * Get contributions for a specific asset
 */
export async function getContributionsByAsset(assetId: string): Promise<Contribution[]> {
  const contract = getContractInstance("CONTRIBUTION_MANAGER", ContributionManagerABI);
  
  try {
    const contributionIds = await contract.assetContributions(assetId);
    const contributions: Contribution[] = [];

    for (const id of contributionIds) {
      const data = await contract.contributions(id);
      contributions.push(mapContributionData(data, id.toString()));
    }

    return contributions;
  } catch (error) {
    console.error("Error fetching contributions by asset:", error);
    throw error;
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
    const event = receipt.logs.find(
      (log: any) => log.topics[0] === ethers.id("ContributionSubmitted(uint256,address,uint256)")
    );
    
    const contributionId = event ? ethers.toNumber(event.topics[1]) : "0";

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

