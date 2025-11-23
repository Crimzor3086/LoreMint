import { World } from "@/types";

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

