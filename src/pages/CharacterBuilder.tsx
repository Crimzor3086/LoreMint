import { useState } from "react";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sparkles, User, X } from "lucide-react";
import { toast } from "sonner";
import { AIService } from "@/lib/ai";

const CharacterBuilder = () => {
  const [name, setName] = useState("");
  const [backstory, setBackstory] = useState("");
  const [traits, setTraits] = useState<string[]>([]);
  const [currentTrait, setCurrentTrait] = useState("");
  const [abilities, setAbilities] = useState<string[]>([]);
  const [currentAbility, setCurrentAbility] = useState("");
  const [personality, setPersonality] = useState({
    courage: [50],
    wisdom: [50],
    charisma: [50],
    cunning: [50],
  });
  const [generatedLore, setGeneratedLore] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const addTrait = () => {
    if (currentTrait && !traits.includes(currentTrait)) {
      setTraits([...traits, currentTrait]);
      setCurrentTrait("");
    }
  };

  const removeTrait = (trait: string) => {
    setTraits(traits.filter(t => t !== trait));
  };

  const addAbility = () => {
    if (currentAbility && !abilities.includes(currentAbility)) {
      setAbilities([...abilities, currentAbility]);
      setCurrentAbility("");
    }
  };

  const removeAbility = (ability: string) => {
    setAbilities(abilities.filter(a => a !== ability));
  };

  const generateLore = async () => {
    if (!name) {
      toast.error("Please enter a character name first");
      return;
    }
    
    setIsGenerating(true);
    try {
      const lore = await AIService.generateCharacterLore({
        name,
        backstory,
        traits,
        abilities,
        personality,
      });
      setGeneratedLore(lore);
      toast.success("Lore generated successfully!");
    } catch (error) {
      toast.error("Failed to generate lore. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMint = () => {
    toast.success("Character prepared for minting!");
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 pt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            AI Character Builder
          </h1>
          <p className="text-xl text-muted-foreground">
            Create legendary characters with AI-powered storytelling
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlowCard>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="w-6 h-6" />
                Character Details
              </h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-base mb-2 block">Character Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter character name..."
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Backstory */}
                <div>
                  <Label htmlFor="backstory" className="text-base mb-2 block">Backstory</Label>
                  <Textarea
                    id="backstory"
                    value={backstory}
                    onChange={(e) => setBackstory(e.target.value)}
                    placeholder="Describe your character's origin story..."
                    rows={4}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Traits */}
                <div>
                  <Label className="text-base mb-2 block">Traits</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={currentTrait}
                      onChange={(e) => setCurrentTrait(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTrait()}
                      placeholder="Add a trait..."
                      className="bg-secondary border-border"
                    />
                    <GradientButton onClick={addTrait} variant="cosmic" size="sm">
                      Add
                    </GradientButton>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {traits.map((trait) => (
                      <Badge
                        key={trait}
                        className="bg-primary/20 text-primary flex items-center gap-1"
                      >
                        {trait}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTrait(trait)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Abilities */}
                <div>
                  <Label className="text-base mb-2 block">Abilities</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={currentAbility}
                      onChange={(e) => setCurrentAbility(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addAbility()}
                      placeholder="Add an ability..."
                      className="bg-secondary border-border"
                    />
                    <GradientButton onClick={addAbility} variant="emerald" size="sm">
                      Add
                    </GradientButton>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {abilities.map((ability) => (
                      <Badge
                        key={ability}
                        className="bg-emerald/20 text-emerald flex items-center gap-1"
                      >
                        {ability}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeAbility(ability)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Personality Sliders */}
                <div>
                  <Label className="text-base mb-4 block">Personality</Label>
                  <div className="space-y-4">
                    {Object.entries(personality).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm capitalize">{key}</span>
                          <span className="text-sm text-muted-foreground">{value[0]}%</span>
                        </div>
                        <Slider
                          value={value}
                          onValueChange={(val) => setPersonality({ ...personality, [key]: val })}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Character Preview */}
            <GlowCard glowColor="accent">
              <h2 className="text-2xl font-bold mb-6">Character Preview</h2>
              <div className="w-full h-64 bg-gradient-magic rounded-lg mb-6 flex items-center justify-center">
                <User className="w-24 h-24 text-white/50" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{name || "Unnamed Character"}</h3>
              <p className="text-muted-foreground mb-4">{backstory || "No backstory yet..."}</p>
              {traits.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Traits:</p>
                  <div className="flex flex-wrap gap-2">
                    {traits.map((trait) => (
                      <Badge key={trait} className="bg-primary/20 text-primary">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {abilities.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Abilities:</p>
                  <div className="flex flex-wrap gap-2">
                    {abilities.map((ability) => (
                      <Badge key={ability} className="bg-emerald/20 text-emerald">
                        {ability}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </GlowCard>

            {/* Generated Lore */}
            {generatedLore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <GlowCard glowColor="emerald" className="hover-tilt">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-emerald animate-sparkle" />
                    <h3 className="text-xl font-bold">AI-Generated Lore</h3>
                  </div>
                  <motion.p 
                    className="text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                  >
                    {generatedLore}
                  </motion.p>
                </GlowCard>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <GradientButton
                variant="cosmic"
                onClick={generateLore}
                disabled={isGenerating || !name}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2 inline" />
                {isGenerating ? "Generating..." : "Generate Lore with AI"}
              </GradientButton>
              <GradientButton
                variant="gold"
                onClick={handleMint}
                disabled={!name || !generatedLore}
                className="w-full"
              >
                Mint as IP
              </GradientButton>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CharacterBuilder;