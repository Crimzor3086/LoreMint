import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletContext } from "@/context/WalletContext";
import { useMint } from "@/hooks/useMint";
import { useCharacters } from "@/hooks/useCharacters";
import { useWorlds } from "@/hooks/useWorlds";
import { usePlots } from "@/hooks/usePlots";
import { 
  getLocalCharacters, 
  getLocalWorlds, 
  getLocalPlots,
  removeLocalCharacter,
  removeLocalWorld,
  removeLocalPlot,
} from "@/lib/storage/localAssets";
import { Coins, User, Globe, BookOpen, CheckCircle, Sparkles, Wallet, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const MintIP = () => {
  const { wallet } = useWalletContext();
  const { mint, isMinting, error } = useMint();
  const { characters: onChainCharacters, isLoading: isLoadingCharacters, fetchCharacters } = useCharacters();
  const { worlds: onChainWorlds, isLoading: isLoadingWorlds, fetchWorlds } = useWorlds();
  const { plots: onChainPlots, isLoading: isLoadingPlots, fetchPlots } = usePlots();
  const [royaltyPercentage, setRoyaltyPercentage] = useState("10");
  const [mintedAssets, setMintedAssets] = useState<Set<string>>(new Set());
  
  // Load local assets
  const [localCharacters, setLocalCharacters] = useState(getLocalCharacters());
  const [localWorlds, setLocalWorlds] = useState(getLocalWorlds());
  const [localPlots, setLocalPlots] = useState(getLocalPlots());

  // Combine local and on-chain assets
  const allCharacters = [...localCharacters, ...onChainCharacters.filter(c => !c.mintedAsIP)];
  const allWorlds = [...localWorlds, ...onChainWorlds.filter(w => !w.mintedAsIP)];
  const allPlots = [...localPlots, ...onChainPlots.filter(p => p.status !== "minted")];

  // Filter out already minted assets
  const characters = allCharacters.filter(c => !c.mintedAsIP && !mintedAssets.has(c.id));
  const worlds = allWorlds.filter(w => !w.mintedAsIP && !mintedAssets.has(w.id));
  const plotArcs = allPlots.filter(p => p.status !== "minted" && !mintedAssets.has(p.id));
  
  const isLoading = isLoadingCharacters || isLoadingWorlds || isLoadingPlots;

  // Refresh local assets when component mounts or when storage changes
  useEffect(() => {
    const refreshLocal = () => {
      setLocalCharacters(getLocalCharacters());
      setLocalWorlds(getLocalWorlds());
      setLocalPlots(getLocalPlots());
    };
    
    refreshLocal();
    // Listen for storage changes (from other tabs/windows)
    window.addEventListener("storage", refreshLocal);
    return () => window.removeEventListener("storage", refreshLocal);
  }, []);

  const handleMint = async (type: "character" | "world" | "plot", id: string, metadata: { name: string; description: string; attributes?: any }) => {
    if (!wallet.isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // Prepare attributes based on type
      let attributes: any = {
        royaltyPercentage: parseFloat(royaltyPercentage),
      };

      if (type === "character") {
        const character = allCharacters.find(c => c.id === id);
        attributes = {
          ...attributes,
          abilities: character?.abilities || [],
          traits: character?.traits || [],
        };
      } else if (type === "world") {
        const world = allWorlds.find(w => w.id === id);
        // Use the world's direct fields instead of parsing description
        attributes = {
          ...attributes,
          geography: world?.geography || "",
          culture: world?.culture || "",
          era: world?.era || "",
        };
      } else if (type === "plot") {
        const plot = allPlots.find(p => p.id === id);
        attributes = {
          ...attributes,
          characterIds: plot?.characters || [],
          worldId: plot?.worldId || "0",
        };
      }

      const result = await mint(type, {
        name: metadata.name,
        description: metadata.description,
        attributes,
      });

      if (result) {
        toast.success(`${type} minted successfully as IP token!`);
        setMintedAssets((prev) => new Set([...prev, id]));
        
        // Remove from local storage if it was a local asset
        if (id.startsWith("local_")) {
          if (type === "character") {
            removeLocalCharacter(id);
            setLocalCharacters(getLocalCharacters());
          } else if (type === "world") {
            removeLocalWorld(id);
            setLocalWorlds(getLocalWorlds());
          } else if (type === "plot") {
            removeLocalPlot(id);
            setLocalPlots(getLocalPlots());
          }
        }
        
        // Refresh asset lists from blockchain
        await Promise.all([
          fetchCharacters(),
          fetchWorlds(),
          fetchPlots(),
        ]);
      }
    } catch (err) {
      console.error("Minting error:", err);
      toast.error(error || "Failed to mint asset");
    }
  };

  const unmintedCharacters = characters.filter(c => !c.mintedAsIP && !mintedAssets.has(c.id));
  const unmintedWorlds = worlds.filter(w => !w.mintedAsIP && !mintedAssets.has(w.id));
  const unmintedPlots = plotArcs.filter(p => p.status !== "minted" && !mintedAssets.has(p.id));

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-gold">
            Mint Intellectual Property
          </h1>
          <p className="text-xl text-muted-foreground">
            Tokenize your creations on the Mantle blockchain
          </p>
        </motion.div>

        {/* Royalty Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlowCard glowColor="gold" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Coins className="w-6 h-6 text-gold" />
              <h2 className="text-2xl font-bold">Royalty Configuration</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Set the default royalty percentage for community contributions to your IP
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="royalty" className="mb-2 block">Royalty Percentage</Label>
                <Input
                  id="royalty"
                  type="number"
                  min="0"
                  max="100"
                  value={royaltyPercentage}
                  onChange={(e) => setRoyaltyPercentage(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="pt-8">
                <Badge className="bg-gold/20 text-gold text-lg px-4 py-2">
                  {royaltyPercentage}%
                </Badge>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Minting Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="characters" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mb-8 bg-secondary">
              <TabsTrigger value="characters" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Characters
              </TabsTrigger>
              <TabsTrigger value="worlds" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Worlds
              </TabsTrigger>
              <TabsTrigger value="plots" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Plot Arcs
              </TabsTrigger>
            </TabsList>

            {/* Characters Tab */}
            <TabsContent value="characters" className="space-y-6">
              {!wallet.isConnected ? (
                <GlowCard className="p-12 text-center">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-4">
                    Connect your wallet to mint IP
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    You need to connect your MetaMask wallet to view and mint your characters
                  </p>
                </GlowCard>
              ) : isLoading ? (
                <GlowCard className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your characters...</p>
                </GlowCard>
              ) : unmintedCharacters.length === 0 ? (
                <GlowCard className="p-12 text-center">
                  <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-2">
                    {characters.length === 0 ? "No characters created yet" : "All characters have been minted!"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {characters.length === 0 
                      ? "Create your first character to start minting IP tokens"
                      : "Create new characters to mint more IP tokens"}
                  </p>
                  <Link to="/character-builder">
                    <GradientButton variant="cosmic">
                      <Sparkles className="w-4 h-4 mr-2 inline" />
                      Create New Character
                    </GradientButton>
                  </Link>
                </GlowCard>
              ) : (
                unmintedCharacters.map((character, index) => (
                  <motion.div
                    key={character.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <GlowCard className="hover-tilt">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-48 h-48 bg-gradient-cosmic rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-16 h-16 text-white/50" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold mb-2">{character.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {character.backstory}
                              </p>
                            </div>
                            {mintedAssets.has(character.id) && (
                              <Badge className="bg-emerald/20 text-emerald flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Minted
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {character.abilities.slice(0, 3).map((ability) => (
                              <Badge key={ability} className="bg-primary/20 text-primary">
                                {ability}
                              </Badge>
                            ))}
                          </div>
                          <GradientButton
                            variant="gold"
                            onClick={() => handleMint("character", character.id, {
                              name: character.name,
                              description: character.backstory || "",
                            })}
                            disabled={isMinting || mintedAssets.has(character.id)}
                            className="w-full md:w-auto"
                          >
                            <Coins className="w-4 h-4 mr-2 inline" />
                            {isMinting ? "Minting..." : mintedAssets.has(character.id) ? "Minted" : "Mint as IP"}
                          </GradientButton>
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                ))
              )}
            </TabsContent>

            {/* Worlds Tab */}
            <TabsContent value="worlds" className="space-y-6">
              {!wallet.isConnected ? (
                <GlowCard className="p-12 text-center">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-4">
                    Connect your wallet to mint IP
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    You need to connect your MetaMask wallet to view and mint your worlds
                  </p>
                </GlowCard>
              ) : isLoading ? (
                <GlowCard className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your worlds...</p>
                </GlowCard>
              ) : unmintedWorlds.length === 0 ? (
                <GlowCard className="p-12 text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-2">
                    {worlds.length === 0 ? "No worlds created yet" : "All worlds have been minted!"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {worlds.length === 0 
                      ? "Create your first world to start minting IP tokens"
                      : "Create new worlds to mint more IP tokens"}
                  </p>
                  <Link to="/world-builder">
                    <GradientButton variant="emerald">
                      <Sparkles className="w-4 h-4 mr-2 inline" />
                      Create New World
                    </GradientButton>
                  </Link>
                </GlowCard>
              ) : (
                unmintedWorlds.map((world, index) => (
                  <motion.div
                    key={world.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <GlowCard glowColor="emerald" className="hover-tilt">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-48 h-48 bg-gradient-emerald rounded-lg flex items-center justify-center flex-shrink-0">
                          <Globe className="w-16 h-16 text-white/50" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold mb-2">{world.name}</h3>
                              <p className="text-sm text-muted-foreground mb-1">{world.era}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {world.description}
                              </p>
                            </div>
                            {mintedAssets.has(world.id) && (
                              <Badge className="bg-emerald/20 text-emerald flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Minted
                              </Badge>
                            )}
                          </div>
                          <GradientButton
                            variant="gold"
                            onClick={() => handleMint("world", world.id, {
                              name: world.name,
                              description: world.description || `${world.geography}\n\n${world.culture}`,
                            })}
                            disabled={isMinting || mintedAssets.has(world.id)}
                            className="w-full md:w-auto"
                          >
                            <Coins className="w-4 h-4 mr-2 inline" />
                            {isMinting ? "Minting..." : mintedAssets.has(world.id) ? "Minted" : "Mint as IP"}
                          </GradientButton>
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                ))
              )}
            </TabsContent>

            {/* Plot Arcs Tab */}
            <TabsContent value="plots" className="space-y-6">
              {!wallet.isConnected ? (
                <GlowCard className="p-12 text-center">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-4">
                    Connect your wallet to mint IP
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    You need to connect your MetaMask wallet to view and mint your plot arcs
                  </p>
                </GlowCard>
              ) : isLoading ? (
                <GlowCard className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your plot arcs...</p>
                </GlowCard>
              ) : unmintedPlots.length === 0 ? (
                <GlowCard className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-2">
                    {plotArcs.length === 0 ? "No plot arcs created yet" : "All plot arcs have been minted!"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {plotArcs.length === 0 
                      ? "Create your first plot arc to start minting IP tokens"
                      : "Create new plot arcs to mint more IP tokens"}
                  </p>
                  <GradientButton variant="accent">
                    <Sparkles className="w-4 h-4 mr-2 inline" />
                    Create New Plot Arc
                  </GradientButton>
                </GlowCard>
              ) : (
                unmintedPlots.map((plot, index) => (
                  <motion.div
                    key={plot.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <GlowCard glowColor="accent" className="hover-tilt">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2">{plot.title}</h3>
                          <p className="text-muted-foreground mb-3">{plot.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Characters: {plot.characters.length}</span>
                            <span>Status: {plot.status}</span>
                          </div>
                        </div>
                        {mintedAssets.has(plot.id) && (
                          <Badge className="bg-emerald/20 text-emerald flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Minted
                          </Badge>
                        )}
                      </div>
                      <GradientButton
                        variant="gold"
                        onClick={() => handleMint("plot", plot.id, {
                          name: plot.title,
                          description: plot.description || "",
                        })}
                        disabled={isMinting || mintedAssets.has(plot.id)}
                        className="w-full md:w-auto"
                      >
                        <Coins className="w-4 h-4 mr-2 inline" />
                        {isMinting ? "Minting..." : mintedAssets.has(plot.id) ? "Minted" : "Mint as IP"}
                      </GradientButton>
                    </GlowCard>
                  </motion.div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <GlowCard className="p-6">
            <div className="flex items-start gap-4">
              <Wallet className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold mb-2">About IP Minting</h3>
                <p className="text-muted-foreground">
                  When you mint your creations as IP tokens, they become permanent, on-chain assets on the Mantle blockchain. 
                  This ensures provenance, enables automatic royalty distribution, and allows for future licensing and collaboration opportunities.
                </p>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
};

export default MintIP;

