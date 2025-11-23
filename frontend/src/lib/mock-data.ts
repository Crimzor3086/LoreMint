import { Character, World, PlotArc, Contribution } from "@/types";

export const mockCharacters: Character[] = [
  {
    id: "1",
    name: "Lyra Shadowmend",
    personality: ["Mysterious", "Wise", "Compassionate"],
    backstory: "A former celestial guardian who descended to the mortal realm to prevent an ancient prophecy.",
    abilities: ["Starweaving", "Time Manipulation", "Ethereal Form"],
    traits: ["Silver Hair", "Glowing Eyes", "Ancient Runes"],
    imageUrl: "/characters/lyra.jpg",
    createdAt: new Date("2024-01-15"),
    mintedAsIP: true,
  },
  {
    id: "2",
    name: "Kael Stormborn",
    personality: ["Brave", "Impulsive", "Loyal"],
    backstory: "A warrior blessed by the Storm Gods, seeking to unite the fractured kingdoms.",
    abilities: ["Lightning Strike", "Wind Control", "Thunder Shield"],
    traits: ["Storm Mark", "Silver Sword", "Azure Eyes"],
    createdAt: new Date("2024-02-10"),
    mintedAsIP: false,
  },
  {
    id: "3",
    name: "Ember Nightwhisper",
    personality: ["Cunning", "Charismatic", "Secretive"],
    backstory: "A rogue mage who stole forbidden knowledge from the Shadow Conclave.",
    abilities: ["Shadow Magic", "Illusion Crafting", "Void Step"],
    traits: ["Purple Flames", "Dark Cloak", "Mysterious Tattoos"],
    createdAt: new Date("2024-02-20"),
    mintedAsIP: true,
  },
];

export const mockWorlds: World[] = [
  {
    id: "1",
    name: "Aethermoor",
    geography: "A floating archipelago suspended among eternal clouds, connected by crystal bridges.",
    culture: "Scholars and mages who study the cosmic energies that keep their lands aloft.",
    era: "The Age of Ascension",
    description: "A mystical realm where magic and technology intertwine, powered by ancient cosmic artifacts.",
    createdAt: new Date("2024-01-01"),
    mintedAsIP: true,
  },
  {
    id: "2",
    name: "The Shadowed Depths",
    geography: "Underground caverns illuminated by bioluminescent fungi and crystal formations.",
    culture: "Underground civilizations that have evolved in darkness for millennia.",
    era: "The Eternal Night",
    description: "A vast subterranean world where light is precious and darkness holds ancient secrets.",
    createdAt: new Date("2024-01-20"),
    mintedAsIP: false,
  },
];

export const mockPlotArcs: PlotArc[] = [
  {
    id: "1",
    title: "The Celestial Rift",
    description: "When the barrier between realms begins to fracture, heroes must prevent cosmic collapse.",
    characters: ["1", "2"],
    worldId: "1",
    status: "published",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "2",
    title: "Shadows of the Past",
    description: "Ancient secrets buried in the depths threaten to resurface and consume the world.",
    characters: ["3"],
    worldId: "2",
    status: "draft",
    createdAt: new Date("2024-02-15"),
  },
];

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