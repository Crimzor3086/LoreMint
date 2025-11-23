import { useState } from "react";
import { AIService, AIGenerationOptions } from "@/lib/ai/loreGenerator";

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCharacterLore = async (options: AIGenerationOptions): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const lore = await AIService.generateCharacterLore(options);
      return lore;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate character lore");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWorldLore = async (options: AIGenerationOptions): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const lore = await AIService.generateWorldLore(options);
      return lore;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate world lore");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestAbilities = (traits: string[]): string[] => {
    return AIService.suggestAbilities(traits);
  };

  const generateAttributes = (personality: Record<string, number>): string[] => {
    return AIService.generateCharacterAttributes(personality);
  };

  return {
    generateCharacterLore,
    generateWorldLore,
    suggestAbilities,
    generateAttributes,
    isGenerating,
    error,
  };
}

