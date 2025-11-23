import { useState } from "react";
import { writeContract, waitForTransaction, CONTRACTS } from "@/lib/blockchain/contracts";
import { useWalletContext } from "@/context/WalletContext";

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
    if (!wallet.isConnected || !wallet.address) {
      setError("Wallet not connected");
      return null;
    }

    setIsMinting(true);
    setError(null);

    try {
      // Determine contract based on type
      const contractName = 
        type === "character" ? "CHARACTER_TOKEN" :
        type === "world" ? "WORLD_TOKEN" :
        "PLOT_TOKEN";

      const contract = CONTRACTS[contractName];

      // Mint NFT
      const txHash = await writeContract(
        contractName,
        "mint",
        [wallet.address, metadata],
        "0" // No value for minting
      );

      // Wait for confirmation
      await waitForTransaction(txHash);

      // Mock token ID - in real implementation, get from contract event
      const tokenId = Math.floor(Math.random() * 1000000).toString();

      return {
        tokenId,
        transactionHash: txHash,
        contractAddress: contract.address,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Minting failed");
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

