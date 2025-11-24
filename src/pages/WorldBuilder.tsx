import { useState } from "react";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Sparkles, X, MapPin, Users, Clock, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AIService } from "@/lib/ai";
import { saveLocalWorld } from "@/lib/storage/localAssets";

const WorldBuilder = () => {
  const [name, setName] = useState("");
  const [era, setEra] = useState("");
  const [geography, setGeography] = useState("");
  const [culture, setCulture] = useState("");
  const [history, setHistory] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [currentFeature, setCurrentFeature] = useState("");
  const [generatedLore, setGeneratedLore] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const addFeature = () => {
    if (currentFeature && !features.includes(currentFeature)) {
      setFeatures([...features, currentFeature]);
      setCurrentFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  const generateLore = async () => {
    setIsGenerating(true);
    try {
      const result = await AIService.generateWorld({
        name: name || undefined,
        era: era || undefined,
        geography: geography || undefined,
        culture: culture || undefined,
        history: history || undefined,
        features: features.length > 0 ? features : undefined,
      });
      
      // Auto-fill all fields with AI-generated content
      if (result.name && !name) setName(result.name);
      if (result.era && !era) setEra(result.era);
      if (result.geography && !geography) setGeography(result.geography);
      if (result.culture && !culture) setCulture(result.culture);
      if (result.history && !history) setHistory(result.history);
      if (result.features && result.features.length > 0 && features.length === 0) {
        setFeatures(result.features);
      }
      setGeneratedLore(result.lore);
      toast.success("World generated and fields filled!");
    } catch (error) {
      toast.error("Failed to generate world. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearAll = () => {
    setName("");
    setEra("");
    setGeography("");
    setCulture("");
    setHistory("");
    setFeatures([]);
    setGeneratedLore("");
    setCurrentFeature("");
    toast.success("All fields cleared!");
  };

  const handleSave = () => {
    if (!name || !geography || !culture) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const world = saveLocalWorld({
        name,
        era: era || "",
        geography,
        culture,
        description: history || `${geography}\n\n${culture}`,
        creator: "", // Will be set when minted
      });
      toast.success("World saved! You can mint it from the Mint IP page.");
    } catch (error) {
      console.error("Error saving world:", error);
      toast.error("Failed to save world");
    }
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
            AI World Builder
          </h1>
          <p className="text-xl text-muted-foreground">
            Design immersive storyworlds with AI-powered world-building
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlowCard glowColor="emerald">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6" />
                World Details
              </h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-base mb-2 block">
                    World Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter world name..."
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Era */}
                <div>
                  <Label htmlFor="era" className="text-base mb-2 block">
                    Era / Time Period
                  </Label>
                  <Input
                    id="era"
                    value={era}
                    onChange={(e) => setEra(e.target.value)}
                    placeholder="e.g., The Age of Ascension"
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Geography */}
                <div>
                  <Label htmlFor="geography" className="text-base mb-2 block">
                    Geography <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="geography"
                    value={geography}
                    onChange={(e) => setGeography(e.target.value)}
                    placeholder="Describe the physical landscape, terrain, and natural features..."
                    rows={4}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Culture */}
                <div>
                  <Label htmlFor="culture" className="text-base mb-2 block">
                    Culture & Society <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="culture"
                    value={culture}
                    onChange={(e) => setCulture(e.target.value)}
                    placeholder="Describe the inhabitants, their customs, beliefs, and social structures..."
                    rows={4}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* History */}
                <div>
                  <Label htmlFor="history" className="text-base mb-2 block">
                    History & Lore
                  </Label>
                  <Textarea
                    id="history"
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                    placeholder="Describe significant historical events, legends, and ancient mysteries..."
                    rows={4}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Features */}
                <div>
                  <Label className="text-base mb-2 block">Notable Features</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={currentFeature}
                      onChange={(e) => setCurrentFeature(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addFeature()}
                      placeholder="Add a feature (e.g., Floating Islands, Crystal Caves)..."
                      className="bg-secondary border-border"
                    />
                    <GradientButton onClick={addFeature} variant="emerald" size="sm">
                      Add
                    </GradientButton>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <Badge
                        key={feature}
                        className="bg-emerald/20 text-emerald flex items-center gap-1"
                      >
                        {feature}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeFeature(feature)} />
                      </Badge>
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
            {/* World Preview */}
            <GlowCard glowColor="accent">
              <h2 className="text-2xl font-bold mb-6">World Preview</h2>
              <div className="w-full h-64 bg-gradient-emerald rounded-lg mb-6 flex items-center justify-center relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Globe className="w-24 h-24 text-white/50" />
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{name || "Unnamed World"}</h3>
              {era && (
                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{era}</span>
                </div>
              )}
              {geography && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-emerald" />
                    <p className="text-sm font-semibold">Geography</p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{geography}</p>
                </div>
              )}
              {culture && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold">Culture</p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{culture}</p>
                </div>
              )}
              {features.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <Badge key={feature} className="bg-emerald/20 text-emerald">
                        {feature}
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
                    <h3 className="text-xl font-bold">AI-Generated World Lore</h3>
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
                variant="emerald"
                onClick={generateLore}
                disabled={isGenerating}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2 inline" />
                {isGenerating ? "Generating..." : "Generate World with AI"}
              </GradientButton>
              <GradientButton
                variant="gold"
                onClick={handleSave}
                disabled={!name || !geography || !culture}
                className="w-full"
              >
                Save World
              </GradientButton>
              <GradientButton
                variant="magic"
                onClick={clearAll}
                disabled={isGenerating}
                className="w-full opacity-80 hover:opacity-100"
              >
                <RotateCcw className="w-4 h-4 mr-2 inline" />
                Clear All
              </GradientButton>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorldBuilder;

