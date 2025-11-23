/**
 * Mock AI Service for LoreMint
 * Simulates AI-powered generation of characters, lore, and world-building content
 */

export interface AIGenerationOptions {
  name?: string;
  backstory?: string;
  traits?: string[];
  abilities?: string[];
  personality?: Record<string, number>;
  geography?: string;
  culture?: string;
  history?: string;
  era?: string;
  features?: string[];
}

const LORE_TEMPLATES = {
  character: [
    "{name} is a legendary figure whose {trait} is spoken of in whispers across the realm. Born during {era}, they mastered the arts of {ability}. With traits like {trait2}, they have become a pivotal force in shaping the destiny of their world.",
    "In the annals of history, {name} stands as a testament to {trait}. Their journey began in {era}, where they discovered their unique gift for {ability}. The {trait2} that defines them has led to countless adventures and legendary encounters.",
    "{name} emerged from the shadows of {era}, a figure both feared and revered. Their mastery of {ability} is unmatched, and their {trait} nature has shaped the course of many battles. Legends speak of their {trait2} and the mysteries that surround them.",
  ],
  world: [
    "{name} exists in the {era}, a time when {geography} shaped the very fabric of reality. The {culture} have developed unique traditions and beliefs that reflect their environment. Throughout {history}, this world has witnessed extraordinary events that continue to echo through time.",
    "The realm of {name} is a place where {geography} meets {culture} in a symphony of wonder. During the {era}, this world became a beacon of {feature}, attracting travelers and scholars from across dimensions. The {history} of this land is written in the stars themselves.",
    "{name} stands as a testament to the power of {geography} and {culture}. In the {era}, this world flourished, giving rise to {feature} and becoming a center of knowledge and magic. The {history} of this realm is filled with tales of heroism and discovery.",
  ],
};

const ERA_OPTIONS = [
  "the Age of Ascension",
  "the Great Tempest",
  "the Eternal Night",
  "the Dawn of Magic",
  "the Shadowed Epoch",
  "the Crystal Age",
  "the Time of Legends",
];

const TRAIT_COMBINATIONS = [
  ["mysterious origins", "ancient wisdom"],
  ["unwavering courage", "boundless curiosity"],
  ["shadowy past", "bright future"],
  ["cosmic power", "mortal heart"],
  ["eternal youth", "ancient knowledge"],
];

export class AIService {
  /**
   * Generate character lore using AI
   */
  static async generateCharacterLore(options: AIGenerationOptions): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const template = LORE_TEMPLATES.character[
          Math.floor(Math.random() * LORE_TEMPLATES.character.length)
        ];
        
        const era = options.era || ERA_OPTIONS[Math.floor(Math.random() * ERA_OPTIONS.length)];
        const trait = options.traits?.[0] || "mysterious power";
        const trait2 = options.traits?.[1] || "legendary status";
        const ability = options.abilities?.[0] || "ancient magic";
        const name = options.name || "The Hero";

        const lore = template
          .replace(/{name}/g, name)
          .replace(/{era}/g, era)
          .replace(/{trait}/g, trait)
          .replace(/{trait2}/g, trait2)
          .replace(/{ability}/g, ability);

        resolve(lore);
      }, 2000 + Math.random() * 1000);
    });
  }

  /**
   * Generate world lore using AI
   */
  static async generateWorldLore(options: AIGenerationOptions): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const template = LORE_TEMPLATES.world[
          Math.floor(Math.random() * LORE_TEMPLATES.world.length)
        ];
        
        const name = options.name || "This realm";
        const era = options.era || ERA_OPTIONS[Math.floor(Math.random() * ERA_OPTIONS.length)];
        const geography = options.geography || "ancient forces";
        const culture = options.culture || "mystical inhabitants";
        const history = options.history || "the ages";
        const feature = options.features?.[0] || "extraordinary phenomena";

        const lore = template
          .replace(/{name}/g, name)
          .replace(/{era}/g, era)
          .replace(/{geography}/g, geography)
          .replace(/{culture}/g, culture)
          .replace(/{history}/g, history)
          .replace(/{feature}/g, feature);

        resolve(lore);
      }, 2500 + Math.random() * 1000);
    });
  }

  /**
   * Generate character attributes based on personality sliders
   */
  static generateCharacterAttributes(personality: Record<string, number>): string[] {
    const attributes: string[] = [];
    
    if (personality.courage && personality.courage[0] > 70) {
      attributes.push("Fearless Warrior");
    }
    if (personality.wisdom && personality.wisdom[0] > 70) {
      attributes.push("Ancient Sage");
    }
    if (personality.charisma && personality.charisma[0] > 70) {
      attributes.push("Charismatic Leader");
    }
    if (personality.cunning && personality.cunning[0] > 70) {
      attributes.push("Master Strategist");
    }

    return attributes.length > 0 ? attributes : ["Balanced Individual"];
  }

  /**
   * Suggest character abilities based on traits
   */
  static suggestAbilities(traits: string[]): string[] {
    const abilityMap: Record<string, string[]> = {
      "mysterious": ["Shadow Magic", "Illusion Crafting", "Void Step"],
      "wise": ["Starweaving", "Time Manipulation", "Ethereal Form"],
      "brave": ["Lightning Strike", "Wind Control", "Thunder Shield"],
      "cunning": ["Mind Reading", "Trap Setting", "Stealth Mastery"],
      "charismatic": ["Inspiration Aura", "Persuasion", "Leadership"],
    };

    const suggested: string[] = [];
    traits.forEach((trait) => {
      const lowerTrait = trait.toLowerCase();
      Object.keys(abilityMap).forEach((key) => {
        if (lowerTrait.includes(key)) {
          suggested.push(...abilityMap[key]);
        }
      });
    });

    return suggested.length > 0 
      ? [...new Set(suggested)].slice(0, 3)
      : ["Basic Magic", "Combat Skills", "Survival Instinct"];
  }

  /**
   * Generate plot arc suggestions
   */
  static generatePlotArcSuggestions(characters: string[], world: string): string[] {
    return [
      `The ${characters.length > 1 ? "alliance" : "journey"} of ${characters.length} hero${characters.length > 1 ? "es" : ""} in ${world}`,
      `Ancient secrets buried in ${world} threaten to resurface`,
      `A cosmic event in ${world} brings ${characters.length} hero${characters.length > 1 ? "es" : ""} together`,
      `The balance of power in ${world} shifts as ${characters.length} new force${characters.length > 1 ? "s" : ""} emerge`,
    ];
  }
}

