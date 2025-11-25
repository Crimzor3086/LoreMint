/**
 * Character Token Service
 * Handles all character-related blockchain interactions
 */

import { ethers } from "ethers";
import { getContractInstance, CONTRACTS } from "../contracts";
import { getNetworkProvider } from "../network";
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
    const provider = getNetworkProvider();

    const latestBlock = await provider.getBlockNumber();
    const lookbackBlocks = Number(import.meta.env.VITE_EVENT_LOOKBACK_BLOCKS || 50000);
    const fromBlock = Math.max(0, Number(latestBlock) - lookbackBlocks);

    const filter = contract.filters.CharacterMinted(null, address);
    const events = await contract.queryFilter(filter, fromBlock, latestBlock);

    if (!events.length) {
      return [];
    }

    const characters = await Promise.all(
      events.map(async (event) => {
        try {
          const tokenId =
            event.args?.tokenId?.toString() ??
            event.args?.[0]?.toString();

          if (!tokenId) {
            return null;
          }

          const owner = await contract.ownerOf(tokenId);
          if (owner.toLowerCase() !== address.toLowerCase()) {
            return null;
          }

          const metadata = await contract.characters(tokenId);

          return {
            id: tokenId,
            name: metadata.name,
            backstory: metadata.backstory,
            abilities: metadata.abilities,
            traits: metadata.traits,
            creator: metadata.creator,
            createdAt: new Date(Number(metadata.createdAt) * 1000),
            mintedAsIP: true,
          } as Character;
        } catch (err) {
          console.warn("Failed to parse character event", err);
          return null;
        }
      })
    );

    // Filter out null values and duplicates
    const uniqueCharacters: Character[] = [];
    const seenTokenIds = new Set<string>();

    for (const character of characters) {
      if (!character || seenTokenIds.has(character.id)) {
        continue;
      }
      seenTokenIds.add(character.id);
      uniqueCharacters.push(character);
    }

    return uniqueCharacters;
  } catch (error: any) {
    if (error?.message?.includes("not deployed") || error?.code === "BAD_DATA" || error?.message?.includes("could not decode")) {
      console.warn("CharacterToken contract not deployed yet or invalid");
      return [];
    }
    console.error("Error fetching user characters:", error);
    return [];
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
    const provider = getNetworkProvider();

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

