/**
 * Hook for fetching and managing contributions
 */

import { useState, useEffect } from "react";
import { useWalletContext } from "@/context/WalletContext";
import {
  getAllContributions,
  getContributionsByAddress,
  submitContribution,
  voteContribution,
  approveContribution,
  rejectContribution,
} from "@/lib/blockchain/services/contributionService";
import { Contribution } from "@/types";
import { ethers } from "ethers";

export function useContributions() {
  const { wallet } = useWalletContext();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContributions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, fetch all contributions
      // In production, you might want to use an indexer or events
      const allContributions = await getAllContributions();
      setContributions(allContributions);
    } catch (err) {
      console.error("Error fetching contributions:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch contributions");
      // If getAllContributions is not implemented, try fetching by address if wallet is connected
      if (wallet.isConnected && wallet.address) {
        try {
          const userContributions = await getContributionsByAddress(wallet.address);
          setContributions(userContributions);
        } catch (addrErr) {
          console.error("Error fetching contributions by address:", addrErr);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, [wallet.isConnected, wallet.address]);

  const submit = async (
    type: Contribution["type"],
    title: string,
    description: string,
    assetId: string
  ): Promise<{ contributionId: string; txHash: string }> => {
    if (!wallet.isConnected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const result = await submitContribution(signer, type, title, description, assetId);
      
      // Refresh contributions after submitting
      await fetchContributions();
      
      return result;
    } catch (err) {
      console.error("Error submitting contribution:", err);
      throw err;
    }
  };

  const vote = async (contributionId: string): Promise<string> => {
    if (!wallet.isConnected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const txHash = await voteContribution(signer, contributionId);
      
      // Refresh contributions after voting
      await fetchContributions();
      
      return txHash;
    } catch (err) {
      console.error("Error voting on contribution:", err);
      throw err;
    }
  };

  const approve = async (contributionId: string, royaltyPercentage: number): Promise<string> => {
    if (!wallet.isConnected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const txHash = await approveContribution(signer, contributionId, royaltyPercentage);
      
      // Refresh contributions after approving
      await fetchContributions();
      
      return txHash;
    } catch (err) {
      console.error("Error approving contribution:", err);
      throw err;
    }
  };

  const reject = async (contributionId: string): Promise<string> => {
    if (!wallet.isConnected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const txHash = await rejectContribution(signer, contributionId);
      
      // Refresh contributions after rejecting
      await fetchContributions();
      
      return txHash;
    } catch (err) {
      console.error("Error rejecting contribution:", err);
      throw err;
    }
  };

  return {
    contributions,
    isLoading,
    error,
    fetchContributions,
    submit,
    vote,
    approve,
    reject,
  };
}

