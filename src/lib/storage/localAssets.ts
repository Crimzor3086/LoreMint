/**
 * Local Storage Manager for Unminted Assets
 * Tracks characters, worlds, and plots created but not yet minted on-chain
 */

import { Character, World, PlotArc } from "@/types";

const STORAGE_KEYS = {
  CHARACTERS: "loremint_unminted_characters",
  WORLDS: "loremint_unminted_worlds",
  PLOTS: "loremint_unminted_plots",
} as const;

/**
 * Generate a unique ID for local assets
 */
function generateId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Characters
 */
export function getLocalCharacters(): Character[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveLocalCharacter(character: Omit<Character, "id" | "mintedAsIP" | "createdAt">): Character {
  const characters = getLocalCharacters();
  const newCharacter: Character = {
    ...character,
    id: generateId(),
    mintedAsIP: false,
    createdAt: new Date(),
  };
  characters.push(newCharacter);
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
  return newCharacter;
}

export function removeLocalCharacter(id: string): void {
  const characters = getLocalCharacters();
  const filtered = characters.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(filtered));
}

export function clearLocalCharacters(): void {
  localStorage.removeItem(STORAGE_KEYS.CHARACTERS);
}

/**
 * Worlds
 */
export function getLocalWorlds(): World[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WORLDS);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveLocalWorld(world: Omit<World, "id" | "mintedAsIP" | "createdAt">): World {
  const worlds = getLocalWorlds();
  const newWorld: World = {
    name: world.name,
    era: world.era || "",
    geography: world.geography || "",
    culture: world.culture || "",
    description: world.description || "",
    ...world,
    id: generateId(),
    mintedAsIP: false,
    createdAt: new Date(),
  };
  worlds.push(newWorld);
  localStorage.setItem(STORAGE_KEYS.WORLDS, JSON.stringify(worlds));
  return newWorld;
}

export function removeLocalWorld(id: string): void {
  const worlds = getLocalWorlds();
  const filtered = worlds.filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.WORLDS, JSON.stringify(filtered));
}

export function clearLocalWorlds(): void {
  localStorage.removeItem(STORAGE_KEYS.WORLDS);
}

/**
 * Plot Arcs
 */
export function getLocalPlots(): PlotArc[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PLOTS);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveLocalPlot(plot: Omit<PlotArc, "id" | "status" | "createdAt">): PlotArc {
  const plots = getLocalPlots();
  const newPlot: PlotArc = {
    ...plot,
    id: generateId(),
    status: "draft",
    createdAt: new Date(),
  };
  plots.push(newPlot);
  localStorage.setItem(STORAGE_KEYS.PLOTS, JSON.stringify(plots));
  return newPlot;
}

export function removeLocalPlot(id: string): void {
  const plots = getLocalPlots();
  const filtered = plots.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PLOTS, JSON.stringify(filtered));
}

export function clearLocalPlots(): void {
  localStorage.removeItem(STORAGE_KEYS.PLOTS);
}

