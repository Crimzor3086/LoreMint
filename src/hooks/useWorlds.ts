/**
 * Hook for fetching and managing worlds
 */

import { useState, useEffect } from "react";
import { useWalletContext } from "@/context/WalletContext";
import { getUserWorlds, mintWorld } from "@/lib/blockchain/services/worldService";
import { World } from "@/types";
import { ethers } from "ethers";

export function useWorlds() {
  const { wallet } = useWalletContext();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorlds = async () => {
    if (!wallet.isConnected || !wallet.address) {
      setWorlds([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userWorlds = await getUserWorlds(wallet.address);
      setWorlds(userWorlds);
    } catch (err) {
      console.error("Error fetching worlds:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch worlds");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorlds();
  }, [wallet.isConnected, wallet.address]);

  const mint = async (
    name: string,
    geography: string,
    culture: string,
    era: string,
    description: string
  ): Promise<{ tokenId: string; txHash: string } | null> => {
    if (!wallet.isConnected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const result = await mintWorld(signer, name, geography, culture, era, description);
      
      // Refresh worlds after minting
      await fetchWorlds();
      
      return result;
    } catch (err) {
      console.error("Error minting world:", err);
      throw err;
    }
  };

  return {
    worlds,
    isLoading,
    error,
    fetchWorlds,
    mint,
  };
}

