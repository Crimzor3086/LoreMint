/**
 * Character Token Service
 * Handles all character-related blockchain interactions
 */

import { ethers } from "ethers";
import { getContractInstance, CONTRACTS } from "../contracts";
import { getMantleProvider } from "../mantle";
import CharacterTokenABI from "../abis/CharacterToken.json";
import { Character } from "@/types";

export interface CharacterMetadata {
  name: string;
  backstory: string;
  abilities: string[];
  traits: string[];
  creator: string;
  createdAt: bigint;
}

/**
 * Get all characters owned by an address
 */
export async function getUserCharacters(address: string): Promise<Character[]> {
  try {
    const contract = getContractInstance("CHARACTER_TOKEN", CharacterTokenABI);
    
    // Try to get balance first to check if contract is valid
    let balance: bigint;
    try {
      balance = await contract.balanceOf(address);
    } catch (error: any) {
      // Contract might not be deployed or address might be invalid
      if (error?.message?.includes("not deployed") || error?.code === "BAD_DATA" || error?.message?.includes("could not decode")) {
        console.warn("CharacterToken contract not deployed or invalid address");
        return [];
      }
      throw error;
    }

    // If balance is 0, return empty array
    if (balance === 0n) {
      return [];
    }

    // The contract doesn't implement ERC721Enumerable, so we can't enumerate tokens
    // For now, return empty array - in production, use an indexer or event logs
    // TODO: Implement event-based indexing or use a subgraph/indexer
    console.warn("CharacterToken doesn't support token enumeration. Use an indexer or event logs to track ownership.");
    return [];
  } catch (error: any) {
    // If contract not deployed, return empty array
    if (error?.message?.includes("not deployed") || error?.code === "BAD_DATA" || error?.message?.includes("could not decode")) {
      console.warn("CharacterToken contract not deployed yet or invalid");
      return [];
    }
    console.error("Error fetching user characters:", error);
    return []; // Return empty array instead of throwing
  }
}

/**
 * Get a single character by token ID
 */
export async function getCharacter(tokenId: string): Promise<Character | null> {
  const contract = getContractInstance("CHARACTER_TOKEN", CharacterTokenABI);
  
  try {
    const metadata = await contract.characters(tokenId);
    const owner = await contract.ownerOf(tokenId);
    
    return {
      id: tokenId,
      name: metadata.name,
      backstory: metadata.backstory,
      abilities: metadata.abilities,
      traits: metadata.traits,
      creator: metadata.creator,
      createdAt: new Date(Number(metadata.createdAt) * 1000),
      mintedAsIP: true,
    };
  } catch (error) {
    console.error("Error fetching character:", error);
    return null;
  }
}

/**
 * Mint a new character token
 */
export async function mintCharacter(
  signer: ethers.Signer,
  name: string,
  backstory: string,
  abilities: string[],
  traits: string[]
): Promise<{ tokenId: string; txHash: string }> {
  const contract = getContractInstance("CHARACTER_TOKEN", CharacterTokenABI, signer);
  const address = await signer.getAddress();

  try {
    const tx = await contract.mint(address, name, backstory, abilities, traits);
    const receipt = await tx.wait();

    // Extract token ID from event
    const event = receipt.logs.find(
      (log: any) => log.topics[0] === ethers.id("CharacterMinted(uint256,address,string)")
    );
    
    const tokenId = event ? ethers.toNumber(event.topics[1]) : "0";

    return {
      tokenId: tokenId.toString(),
      txHash: receipt.hash,
    };
  } catch (error) {
    console.error("Error minting character:", error);
    throw error;
  }
}

/**
 * Listen for new character mints
 */
export function subscribeToCharacterMints(
  callback: (character: Character) => void
): () => void {
  const contract = getContractInstance("CHARACTER_TOKEN", CharacterTokenABI);
  const provider = getMantleProvider();

  const filter = contract.filters.CharacterMinted();
  
  provider.on(filter, async (log) => {
    const parsedLog = contract.interface.parseLog(log);
    if (parsedLog) {
      const tokenId = parsedLog.args.tokenId.toString();
      const character = await getCharacter(tokenId);
      if (character) {
        callback(character);
      }
    }
  });

  return () => {
    provider.removeAllListeners(filter);
  };
}

