export interface Contribution {
  id: string;
  type: "character" | "story" | "artwork" | "expansion";
  title: string;
  description: string;
  contributorAddress: string;
  status: "pending" | "approved" | "rejected";
  votes: number;
  createdAt: Date;
  assetId?: string;
  assetType?: "character" | "world" | "plot";
}

export interface RoyaltySplit {
  id: string;
  assetId: string;
  assetType: "character" | "world" | "plot";
  assetName: string;
  creatorAddress: string;
  creatorPercentage: number;
  contributors: {
    address: string;
    name: string;
    percentage: number;
    contributionId: string;
  }[];
  totalRevenue: number;
  lastDistribution: Date;
}

