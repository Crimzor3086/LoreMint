import { PlotArc } from "@/types";

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

