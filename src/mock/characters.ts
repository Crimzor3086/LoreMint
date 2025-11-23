import { Character } from "@/types";

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

