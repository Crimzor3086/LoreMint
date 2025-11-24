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
    "Once a humble {trait} from the {era}, {name} rose to prominence through their exceptional {ability}. Their {trait2} has made them a beacon of hope in dark times, inspiring others to follow in their footsteps.",
    "The enigmatic {name} wandered the lands during {era}, their {trait} marking them as different from all others. Through years of study and practice, they honed their {ability}, becoming a master whose {trait2} would be remembered for generations.",
    "Born under strange stars in the {era}, {name} was destined for greatness. Their natural {trait} combined with rigorous training in {ability} created a warrior whose {trait2} would change the course of history forever.",
    "A wanderer from the {era}, {name} carries the weight of {trait} on their shoulders. Their journey to master {ability} was fraught with danger, but their {trait2} saw them through every trial.",
    "The name {name} echoes through the halls of time, a figure from {era} whose {trait} and mastery of {ability} made them legendary. Their {trait2} continues to inspire new generations of adventurers.",
  ],
  world: [
    "{name} exists in the {era}, a time when {geography} shaped the very fabric of reality. The {culture} have developed unique traditions and beliefs that reflect their environment. Throughout {history}, this world has witnessed extraordinary events that continue to echo through time.",
    "The realm of {name} is a place where {geography} meets {culture} in a symphony of wonder. During the {era}, this world became a beacon of {feature}, attracting travelers and scholars from across dimensions. The {history} of this land is written in the stars themselves.",
    "{name} stands as a testament to the power of {geography} and {culture}. In the {era}, this world flourished, giving rise to {feature} and becoming a center of knowledge and magic. The {history} of this realm is filled with tales of heroism and discovery.",
    "In the {era}, {name} was forged from the convergence of {geography} and {culture}. This unique blend created a world where {feature} became commonplace, and the {history} of this place tells of civilizations that reached heights never before imagined.",
    "The domain of {name} stretches across dimensions, its {geography} defying conventional understanding. During {era}, the {culture} that called this place home developed technologies and magics that shaped {feature}. The {history} of this world is a tapestry woven from countless threads of possibility.",
    "Born from cosmic chaos in the {era}, {name} is a world where {geography} and {culture} exist in perfect harmony. The {feature} that define this realm are unlike anything found elsewhere, and its {history} is marked by moments of profound transformation.",
    "A sanctuary in the void, {name} emerged during {era} as a refuge for those seeking to escape the mundane. Its {geography} provides endless mysteries, while its {culture} values exploration and discovery. The {history} of this world is still being written by those who dare to explore its depths.",
    "The ancient world of {name} has existed since before the {era}, its {geography} shaped by forces beyond mortal comprehension. The {culture} that evolved here learned to live in harmony with the strange {feature} that permeate their reality. The {history} of this realm spans eons, filled with lost civilizations and forgotten secrets.",
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
  "the Void Convergence",
  "the Stellar Awakening",
  "the Primal Chaos",
  "the Age of Ruin",
  "the Second Genesis",
  "the Temporal Rift",
  "the Cosmic Rebirth",
  "the Ancient Silence",
  "the War of Realms",
  "the Age of Discovery",
  "the Great Sundering",
  "the Era of Shadows",
  "the Golden Dawn",
];

const TRAIT_COMBINATIONS = [
  ["mysterious origins", "ancient wisdom"],
  ["unwavering courage", "boundless curiosity"],
  ["shadowy past", "bright future"],
  ["cosmic power", "mortal heart"],
  ["eternal youth", "ancient knowledge"],
  ["silent determination", "explosive potential"],
  ["gentle strength", "fierce loyalty"],
  ["broken spirit", "unbreakable will"],
  ["cursed bloodline", "blessed destiny"],
  ["forgotten memories", "remembered purpose"],
  ["wandering soul", "anchored resolve"],
  ["chaotic nature", "ordered mind"],
  ["fallen grace", "rising power"],
  ["hollow existence", "full potential"],
  ["cracked foundation", "solid future"],
];

export interface CharacterGenerationResult {
  lore: string;
  name?: string;
  backstory?: string;
  traits?: string[];
  abilities?: string[];
  personality?: {
    courage: number;
    wisdom: number;
    charisma: number;
    cunning: number;
  };
}

export interface WorldGenerationResult {
  lore: string;
  name?: string;
  era?: string;
  geography?: string;
  culture?: string;
  history?: string;
  features?: string[];
}

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
   * Generate complete character with all fields filled
   */
  static async generateCharacter(options: AIGenerationOptions): Promise<CharacterGenerationResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const template = LORE_TEMPLATES.character[
          Math.floor(Math.random() * LORE_TEMPLATES.character.length)
        ];
        
        // Generate or use provided values
        const namePrefixes = ["Aether", "Shadow", "Crystal", "Void", "Star", "Storm", "Flame", "Frost", "Thorn", "Light", "Dark", "Cosmic", "Primal", "Eternal", "Ancient"];
        const nameSuffixes = ["weaver", "strider", "blade", "heart", "soul", "guardian", "seeker", "keeper", "wanderer", "sage", "warrior", "mystic", "shade", "flame", "star"];
        const randomName = options.name || `${namePrefixes[Math.floor(Math.random() * namePrefixes.length)]}${nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)]}`;
        const name = randomName;
        const era = options.era || ERA_OPTIONS[Math.floor(Math.random() * ERA_OPTIONS.length)];
        const generatedTraits = options.traits && options.traits.length > 0 
          ? options.traits 
          : TRAIT_COMBINATIONS[Math.floor(Math.random() * TRAIT_COMBINATIONS.length)];
        const abilityPools = [
          ["Void Manipulation", "Reality Weaving", "Time Dilation"],
          ["Elemental Mastery", "Nature's Wrath", "Storm Calling"],
          ["Shadow Walking", "Illusion Crafting", "Mind Control"],
          ["Healing Light", "Protective Barriers", "Life Force"],
          ["Combat Mastery", "Weapon Forging", "Battle Tactics"],
          ["Ancient Magic", "Rune Casting", "Spell Weaving"],
          ["Beast Taming", "Wild Shape", "Animal Communication"],
          ["Tech Mastery", "Mechanical Creation", "Energy Manipulation"],
        ];
        const generatedAbilities = options.abilities && options.abilities.length > 0
          ? options.abilities
          : abilityPools[Math.floor(Math.random() * abilityPools.length)];
        
        const trait = generatedTraits[0] || "mysterious power";
        const trait2 = generatedTraits[1] || "legendary status";
        const ability = generatedAbilities[0] || "ancient magic";

        const lore = template
          .replace(/{name}/g, name)
          .replace(/{era}/g, era)
          .replace(/{trait}/g, trait)
          .replace(/{trait2}/g, trait2)
          .replace(/{ability}/g, ability);

        // Generate diverse backstories
        const backstoryTemplates = [
          `${name} was born in ${era}, a time of great upheaval. From an early age, they displayed ${trait}, which set them apart from others. Through years of training, they mastered ${ability}, becoming a figure of legend. Their ${trait2} has shaped countless adventures and continues to inspire those who hear their tale.`,
          `Orphaned during ${era}, ${name} learned to survive through their ${trait}. They discovered their talent for ${ability} in the most unlikely of places, and their ${trait2} became their greatest strength in a world that had forgotten them.`,
          `A scholar from ${era}, ${name} dedicated their life to understanding ${trait}. Their research into ${ability} led to discoveries that would reshape the world. Their ${trait2} made them both revered and feared by those in power.`,
          `Exiled from their homeland during ${era}, ${name} wandered the lands, their ${trait} marking them as an outcast. They found solace in mastering ${ability}, and their ${trait2} eventually led them to a new purpose and a new family.`,
          `Born into royalty in ${era}, ${name} rejected their privileged life to pursue their ${trait}. They abandoned their inheritance to study ${ability}, and their ${trait2} made them a hero to the common people they chose to protect.`,
          `A simple farmer in ${era}, ${name} never expected their ${trait} would lead to greatness. When disaster struck, they discovered their hidden talent for ${ability}, and their ${trait2} transformed them into a legend.`,
        ];
        const backstory = backstoryTemplates[Math.floor(Math.random() * backstoryTemplates.length)]
          .replace(/{name}/g, name)
          .replace(/{era}/g, era)
          .replace(/{trait}/g, trait)
          .replace(/{ability}/g, ability)
          .replace(/{trait2}/g, trait2);

        // Generate personality based on traits or random
        const personality = options.personality || {
          courage: Math.floor(Math.random() * 40) + 50,
          wisdom: Math.floor(Math.random() * 40) + 50,
          charisma: Math.floor(Math.random() * 40) + 50,
          cunning: Math.floor(Math.random() * 40) + 50,
        };

        resolve({
          lore,
          name,
          backstory,
          traits: generatedTraits,
          abilities: generatedAbilities,
          personality: {
            courage: Array.isArray(personality.courage) ? personality.courage[0] : personality.courage || 50,
            wisdom: Array.isArray(personality.wisdom) ? personality.wisdom[0] : personality.wisdom || 50,
            charisma: Array.isArray(personality.charisma) ? personality.charisma[0] : personality.charisma || 50,
            cunning: Array.isArray(personality.cunning) ? personality.cunning[0] : personality.cunning || 50,
          },
        });
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
   * Generate complete world with all fields filled
   */
  static async generateWorld(options: AIGenerationOptions): Promise<WorldGenerationResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const template = LORE_TEMPLATES.world[
          Math.floor(Math.random() * LORE_TEMPLATES.world.length)
        ];
        
        // Generate or use provided values
        const realmPrefixes = ["Realm", "Domain", "Kingdom", "Empire", "Land", "World", "Dimension", "Plane", "Reality", "Universe"];
        const realmSuffixes = ["Myst", "Crystal", "Shadow", "Light", "Void", "Storm", "Flame", "Frost", "Star", "Void", "Eternal", "Ancient", "Primal", "Cosmic", "Chaos"];
        const randomName = options.name || `${realmPrefixes[Math.floor(Math.random() * realmPrefixes.length)]} of ${realmSuffixes[Math.floor(Math.random() * realmSuffixes.length)]}`;
        const name = randomName;
        const era = options.era || ERA_OPTIONS[Math.floor(Math.random() * ERA_OPTIONS.length)];
        
        const geographyTemplates = [
          `A vast landscape of floating islands suspended above a sea of starlight. Mountain ranges pierce through clouds of cosmic dust, while crystal forests shimmer with ethereal light. Rivers of liquid magic flow through valleys, and ancient ruins dot the horizon, remnants of civilizations long forgotten.`,
          `Endless deserts of shifting sand that hide underground cities carved from living stone. Oases of pure energy dot the landscape, while massive geysers of elemental power erupt from the earth. The sky is a canvas of ever-changing colors, reflecting the magical nature of this realm.`,
          `A world of perpetual twilight, where bioluminescent flora and fauna create a natural light show. Massive tree cities stretch into the sky, connected by bridges of living wood. Underground caverns filled with glowing crystals provide shelter and resources for the inhabitants.`,
          `An archipelago of volcanic islands floating on a sea of liquid fire. Each island is a unique ecosystem, from frozen peaks to tropical jungles. The constant volcanic activity creates new landmasses while destroying others, making this a world in constant flux.`,
          `A realm where gravity is optional, allowing for cities built in three-dimensional space. Structures float freely, connected by magical pathways. The ground below is a mirror dimension, and travelers can walk on both surfaces simultaneously.`,
          `A world split between two halves: one bathed in eternal daylight with crystalline structures, the other shrouded in perpetual night with shadowy architecture. A thin twilight zone between them serves as the primary habitation area.`,
        ];
        const geography = options.geography || geographyTemplates[Math.floor(Math.random() * geographyTemplates.length)];
        
        const cultureTemplates = [
          `The inhabitants are a diverse people known for their deep connection to the mystical forces that shape their world. They practice ancient rituals under the light of twin moons, honor their ancestors through elaborate ceremonies, and value knowledge above all else. Their society is structured around guilds of scholars, warriors, and mystics who work together to maintain the balance of their realm.`,
          `A nomadic culture that follows the migration patterns of magical creatures. They live in mobile cities that transform based on the season. Their entire society is built around the concept of change and adaptation, with no permanent structures or fixed hierarchies.`,
          `A highly technological civilization that has merged magic with machinery. They live in floating cities powered by captured starlight, and their culture values innovation and experimentation. Their social structure is merit-based, with positions earned through contribution to the collective knowledge.`,
          `A tribal society organized around elemental affiliations. Each tribe represents a different element and lives in harmony with their chosen force. They gather for grand festivals where the elements are celebrated, and inter-tribal marriages are seen as sacred unions that strengthen the world's balance.`,
          `An isolationist culture that has built massive walled cities to protect themselves from the dangers of the outside world. They value security and tradition above all, with strict social roles and a deep suspicion of outsiders. Their society is highly structured, with each individual knowing their place.`,
          `A merchant culture that has built their entire civilization around trade routes that span dimensions. They are master negotiators and value wealth and connections. Their cities are bustling marketplaces where goods from countless worlds are bought and sold.`,
        ];
        const culture = options.culture || cultureTemplates[Math.floor(Math.random() * cultureTemplates.length)];
        
        const historyTemplates = [
          `In ages past, this world was the site of a great convergence where multiple dimensions collided. The resulting fusion created unique laws of nature that govern reality itself. Legendary heroes once walked these lands, their deeds recorded in the very fabric of space-time. The Great War of the Ancients left scars that still pulse with residual magic, and the ruins of their cities hold secrets that scholars have spent millennia trying to unlock.`,
          `This world was created as an experiment by a race of cosmic architects who sought to build the perfect reality. When they abandoned their creation, the inhabitants were left to forge their own destiny. The remnants of the architects' technology still function, creating wonders and disasters in equal measure.`,
          `Once a thriving world of magic, this realm suffered a cataclysm that shattered its connection to the source of all power. The inhabitants learned to survive using the fragments of magic that remained, creating new traditions and technologies to compensate for what was lost. The old ways are remembered in myths and legends.`,
          `A world that was conquered and then liberated, leaving deep scars in both the land and its people. The occupation changed everything, forcing the inhabitants to adapt or die. Now free, they struggle to rebuild while dealing with the trauma of their past and the uncertainty of their future.`,
          `This realm was born from the death of a god, their body becoming the land and their blood becoming the seas. The inhabitants are the god's children, inheriting fragments of divine power. Their history is written in the cycles of the god's heartbeat, which still echoes through the world.`,
          `A world that exists in multiple time periods simultaneously, with different regions existing in different eras. Travel between these temporal zones is possible but dangerous. The history of this world is not linear but a complex web of cause and effect that spans all of time.`,
        ];
        const history = options.history || historyTemplates[Math.floor(Math.random() * historyTemplates.length)];
        
        const featurePools = [
          ["Floating Islands", "Crystal Caves", "Starlight Rivers", "Ancient Ruins", "Twin Moons"],
          ["Volcanic Geysers", "Living Forests", "Energy Oases", "Underground Cities", "Shifting Sands"],
          ["Bioluminescent Flora", "Tree Cities", "Glowing Caves", "Twilight Zones", "Mirror Dimensions"],
          ["Gravity Wells", "Three-Dimensional Cities", "Magical Pathways", "Floating Structures", "Dual Surfaces"],
          ["Daylight Crystals", "Shadow Architecture", "Twilight Bridges", "Eternal Sun", "Perpetual Night"],
          ["Dimensional Portals", "Trade Hubs", "Marketplaces", "Merchant Guilds", "Cross-Realm Routes"],
        ];
        const features = options.features && options.features.length > 0
          ? options.features
          : featurePools[Math.floor(Math.random() * featurePools.length)];

        const feature = features[0] || "extraordinary phenomena";

        const lore = template
          .replace(/{name}/g, name)
          .replace(/{era}/g, era)
          .replace(/{geography}/g, geography)
          .replace(/{culture}/g, culture)
          .replace(/{history}/g, history)
          .replace(/{feature}/g, feature);

        resolve({
          lore,
          name,
          era,
          geography,
          culture,
          history,
          features,
        });
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

