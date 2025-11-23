import { createContext, useContext, ReactNode } from "react";
import { useAI } from "@/hooks/useAI";
import { AIGenerationOptions } from "@/lib/ai/loreGenerator";

interface AIContextType {
  generateCharacterLore: (options: AIGenerationOptions) => Promise<string | null>;
  generateWorldLore: (options: AIGenerationOptions) => Promise<string | null>;
  suggestAbilities: (traits: string[]) => string[];
  generateAttributes: (personality: Record<string, number>) => string[];
  isGenerating: boolean;
  error: string | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const ai = useAI();

  return (
    <AIContext.Provider value={ai}>
      {children}
    </AIContext.Provider>
  );
}

export function useAIContext() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAIContext must be used within an AIProvider");
  }
  return context;
}

