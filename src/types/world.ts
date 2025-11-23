export interface World {
  id: string;
  name: string;
  geography: string;
  culture: string;
  era: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  mintedAsIP: boolean;
  tokenId?: string;
  contractAddress?: string;
}

