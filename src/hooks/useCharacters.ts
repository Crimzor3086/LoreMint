/**
 * Hook for fetching and managing characters
 */

import { useState, useEffect } from "react";
import { useWalletContext } from "@/context/WalletContext";
import { getUserCharacters, mintCharacter } from "@/lib/blockchain/services/characterService";
import { Character } from "@/types";
import { ethers } from "ethers";

export function useCharacters() {
  const { wallet } = useWalletContext();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    if (!wallet.isConnected || !wallet.address) {
      setCharacters([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userCharacters = await getUserCharacters(wallet.address);
      setCharacters(userCharacters);
    } catch (err) {
      console.error("Error fetching characters:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch characters");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [wallet.isConnected, wallet.address]);

  const mint = async (
    name: string,
    backstory: string,
    abilities: string[],
    traits: string[]
  ): Promise<{ tokenId: string; txHash: string } | null> => {
    if (!wallet.isConnected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const result = await mintCharacter(signer, name, backstory, abilities, traits);
      
      // Refresh characters after minting
      await fetchCharacters();
      
      return result;
    } catch (err) {
      console.error("Error minting character:", err);
      throw err;
    }
  };

  return {
    characters,
    isLoading,
    error,
    fetchCharacters,
    mint,
  };
}

