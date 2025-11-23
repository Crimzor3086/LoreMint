export interface PlotArc {
  id: string;
  title: string;
  description: string;
  characters: string[];
  worldId: string;
  status: "draft" | "published" | "minted";
  createdAt: Date;
  tokenId?: string;
  contractAddress?: string;
}

