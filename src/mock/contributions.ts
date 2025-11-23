import { Contribution, RoyaltySplit } from "@/types";

export const mockContributions: Contribution[] = [
  {
    id: "1",
    type: "character",
    title: "Nova Starseeker",
    description: "A young astronomer who discovered a hidden constellation containing a message from the ancients.",
    contributorAddress: "0x1234...5678",
    status: "pending",
    votes: 12,
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "2",
    type: "expansion",
    title: "The Crystal Mines",
    description: "A new region within Aethermoor where rare crystals form naturally, attracting fortune seekers.",
    contributorAddress: "0x8765...4321",
    status: "approved",
    votes: 24,
    createdAt: new Date("2024-02-28"),
  },
  {
    id: "3",
    type: "story",
    title: "The Last Guardian's Tale",
    description: "The untold story of the guardian who sacrificed everything to seal the ancient evil.",
    contributorAddress: "0xabcd...efgh",
    status: "approved",
    votes: 18,
    createdAt: new Date("2024-02-25"),
  },
];

export const mockRoyaltySplits: RoyaltySplit[] = [
  {
    id: "1",
    assetId: "1",
    assetType: "character",
    assetName: "Lyra Shadowmend",
    creatorAddress: "0x1234...5678",
    creatorPercentage: 80,
    contributors: [
      {
        address: "0x8765...4321",
        name: "Crystal Mines Expansion",
        percentage: 15,
        contributionId: "2",
      },
      {
        address: "0xabcd...efgh",
        name: "Guardian's Tale Story",
        percentage: 5,
        contributionId: "3",
      },
    ],
    totalRevenue: 1250.50,
    lastDistribution: new Date("2024-03-01"),
  },
  {
    id: "2",
    assetId: "1",
    assetType: "world",
    assetName: "Aethermoor",
    creatorAddress: "0x1234...5678",
    creatorPercentage: 70,
    contributors: [
      {
        address: "0x8765...4321",
        name: "Crystal Mines Expansion",
        percentage: 30,
        contributionId: "2",
      },
    ],
    totalRevenue: 3420.75,
    lastDistribution: new Date("2024-03-05"),
  },
];

