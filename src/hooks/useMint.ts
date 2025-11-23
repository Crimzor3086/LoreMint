import { useState } from "react";
import { useWalletContext } from "@/context/WalletContext";
import { mintCharacter } from "@/lib/blockchain/services/characterService";
import { mintWorld } from "@/lib/blockchain/services/worldService";
import { mintPlot } from "@/lib/blockchain/services/plotService";
import { CONTRACTS } from "@/lib/blockchain/contracts";
import { ethers } from "ethers";

export type MintType = "character" | "world" | "plot";

export interface MintResult {
  tokenId: string;
  transactionHash: string;
  contractAddress: string;
}

export function useMint() {
  const { wallet } = useWalletContext();
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mint = async (
    type: MintType,
    metadata: {
      name: string;
      description: string;
      attributes?: Record<string, any>;
    }
  ): Promise<MintResult | null> => {
    if (!wallet.isConnected || !wallet.address || !window.ethereum) {
      setError("Wallet not connected");
      return null;
    }

    setIsMinting(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      let result: { tokenId: string; txHash: string };
      let contractAddress: string;

      switch (type) {
        case "character": {
          contractAddress = CONTRACTS.CHARACTER_TOKEN.address;
          result = await mintCharacter(
            signer,
            metadata.name,
            metadata.description,
            metadata.attributes?.abilities || [],
            metadata.attributes?.traits || []
          );
          break;
        }
        case "world": {
          contractAddress = CONTRACTS.WORLD_TOKEN.address;
          result = await mintWorld(
            signer,
            metadata.name,
            metadata.attributes?.geography || "",
            metadata.attributes?.culture || "",
            metadata.attributes?.era || "",
            metadata.description
          );
          break;
        }
        case "plot": {
          contractAddress = CONTRACTS.PLOT_TOKEN.address;
          result = await mintPlot(
            signer,
            metadata.name,
            metadata.description,
            metadata.attributes?.characterIds || [],
            metadata.attributes?.worldId || "0"
          );
          break;
        }
        default:
          throw new Error(`Unknown mint type: ${type}`);
      }

      return {
        tokenId: result.tokenId,
        transactionHash: result.txHash,
        contractAddress,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Minting failed";
      setError(errorMessage);
      console.error("Minting error:", err);
      return null;
    } finally {
      setIsMinting(false);
    }
  };

  return {
    mint,
    isMinting,
    error,
  };
}

