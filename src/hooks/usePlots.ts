/**
 * Hook for fetching and managing plot arcs
 */

import { useState, useEffect } from "react";
import { useWalletContext } from "@/context/WalletContext";
import { getUserPlots, mintPlot } from "@/lib/blockchain/services/plotService";
import { PlotArc } from "@/types";
import { ethers } from "ethers";

export function usePlots() {
  const { wallet } = useWalletContext();
  const [plots, setPlots] = useState<PlotArc[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlots = async () => {
    if (!wallet.isConnected || !wallet.address) {
      setPlots([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userPlots = await getUserPlots(wallet.address);
      setPlots(userPlots);
    } catch (err) {
      console.error("Error fetching plots:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch plots");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, [wallet.isConnected, wallet.address]);

  const mint = async (
    title: string,
    description: string,
    characterIds: string[],
    worldId: string
  ): Promise<{ tokenId: string; txHash: string } | null> => {
    if (!wallet.isConnected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const result = await mintPlot(signer, title, description, characterIds, worldId);
      
      // Refresh plots after minting
      await fetchPlots();
      
      return result;
    } catch (err) {
      console.error("Error minting plot:", err);
      throw err;
    }
  };

  return {
    plots,
    isLoading,
    error,
    fetchPlots,
    mint,
  };
}

