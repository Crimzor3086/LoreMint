export interface Character {
  id: string;
  name: string;
  personality?: string[];
  backstory: string;
  abilities: string[];
  traits: string[];
  imageUrl?: string;
  createdAt: Date;
  mintedAsIP: boolean;
  tokenId?: string;
  contractAddress?: string;
  creator?: string;
}

