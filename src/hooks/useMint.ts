import { useState } from "react";
import { writeContract, waitForTransaction, CONTRACTS } from "@/lib/blockchain/contracts";
import { useWalletContext } from "@/context/WalletContext";

export type MintType = "character" | "world" | "plot";

export interface MintResult {
  tokenId: string;
  transactionHash: string;
  contractAddress: string;
}

// Placeholder ABI - replace with actual contract ABIs
const ERC721_MINT_ABI = [
  "function mint(address to, string memory name, string memory description) public returns (uint256)",
];

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

      // Check if contract is deployed
      if (contract.address === "0x0000000000000000000000000000000000000000") {
        throw new Error("Contract not deployed yet");
      }

      // Mint NFT - Note: This requires the actual contract ABI
      // For now, using placeholder ABI. Replace with actual ABI from contracts
      const txHash = await writeContract(
        contractName,
        ERC721_MINT_ABI,
        "mint",
        [wallet.address, metadata.name, metadata.description]
      );

      // Wait for confirmation
      const receipt = await waitForTransaction(txHash);

      // Extract token ID from transaction receipt logs
      // In real implementation, parse the Transfer event to get tokenId
      const tokenId = receipt.logs?.[0]?.topics?.[3] || "0";

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

