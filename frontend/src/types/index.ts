export interface Character {
  id: string;
  name: string;
  personality: string[];
  backstory: string;
  abilities: string[];
  traits: string[];
  imageUrl?: string;
  createdAt: Date;
  mintedAsIP: boolean;
}

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
}

export interface PlotArc {
  id: string;
  title: string;
  description: string;
  characters: string[];
  worldId: string;
  status: "draft" | "published" | "minted";
  createdAt: Date;
}

export interface Contribution {
  id: string;
  type: "character" | "story" | "artwork" | "expansion";
  title: string;
  description: string;
  contributorAddress: string;
  status: "pending" | "approved" | "rejected";
  votes: number;
  createdAt: Date;
}