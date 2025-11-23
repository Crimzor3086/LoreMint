import { useState, useEffect } from "react";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Sparkles, Globe, BookOpen, Coins, TrendingUp, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Character, World, PlotArc, RoyaltySplit } from "@/types";
import { useWalletContext } from "@/context/WalletContext";

const Dashboard = () => {
  const { wallet } = useWalletContext();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [plotArcs, setPlotArcs] = useState<PlotArc[]>([]);
  const [royaltySplits, setRoyaltySplits] = useState<RoyaltySplit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user's characters, worlds, plots, and royalties from blockchain/API
    // For now, initialize with empty arrays
    const fetchUserData = async () => {
      if (!wallet.isConnected || !wallet.address) {
        setIsLoading(false);
        return;
      }

      try {
        // TODO: Replace with actual blockchain/API calls
        // const userCharacters = await fetchCharacters(wallet.address);
        // const userWorlds = await fetchWorlds(wallet.address);
        // const userPlots = await fetchPlotArcs(wallet.address);
        // const userRoyalties = await fetchRoyaltySplits(wallet.address);
        
        // setCharacters(userCharacters);
        // setWorlds(userWorlds);
        // setPlotArcs(userPlots);
        // setRoyaltySplits(userRoyalties);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [wallet.isConnected, wallet.address]);
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 pt-24 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-nebula">
            Your Storyworld Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your characters, worlds, and intellectual property
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Characters", value: characters.length, icon: Users, color: "primary" as const },
            { label: "Worlds", value: worlds.length, icon: Globe, color: "emerald" as const },
            { label: "Plot Arcs", value: plotArcs.length, icon: BookOpen, color: "accent" as const },
            { label: "Total Revenue", value: `$${royaltySplits.reduce((sum, r) => sum + r.totalRevenue, 0).toFixed(2)}`, icon: DollarSign, color: "gold" as const },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <GlowCard glowColor={stat.color} className="hover-tilt">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">{stat.label}</p>
                    <motion.p 
                      className="text-3xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    <stat.icon className="w-10 h-10 text-primary opacity-50" />
                  </motion.div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/character-builder">
              <GradientButton variant="cosmic">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                Create Character
              </GradientButton>
            </Link>
            <Link to="/world-builder">
              <GradientButton variant="emerald">
                <Globe className="w-4 h-4 mr-2 inline" />
                Design World
              </GradientButton>
            </Link>
            <Link to="/mint">
              <GradientButton variant="gold">
                <Coins className="w-4 h-4 mr-2 inline" />
                Mint IP
              </GradientButton>
            </Link>
            <Link to="/graph">
              <GradientButton variant="magic">
                <TrendingUp className="w-4 h-4 mr-2 inline" />
                View Story Graph
              </GradientButton>
            </Link>
          </div>
        </motion.div>

        {/* Characters Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text">Your Characters</h2>
            <Link to="/character-builder">
              <GradientButton size="sm" variant="cosmic">+ New</GradientButton>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.length === 0 ? (
              <div className="col-span-full">
                <GlowCard className="p-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-4">
                    No characters yet
                  </p>
                  <Link to="/character-builder">
                    <GradientButton variant="cosmic">
                      <Sparkles className="w-4 h-4 mr-2 inline" />
                      Create Your First Character
                    </GradientButton>
                  </Link>
                </GlowCard>
              </div>
            ) : (
              characters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <GlowCard className="relative hover-tilt">
                  {character.mintedAsIP && (
                    <motion.div 
                      className="absolute top-4 right-4"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Coins className="w-6 h-6 text-gold animate-pulse-glow" />
                    </motion.div>
                  )}
                  <div className="mb-4">
                    <div className="w-full h-48 bg-gradient-cosmic rounded-lg mb-4 flex items-center justify-center overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-magic opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                      <Users className="w-16 h-16 text-white/50 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{character.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {character.backstory}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {character.abilities.slice(0, 3).map((ability) => (
                      <span
                        key={ability}
                        className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full"
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Worlds Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text-magic">Your Worlds</h2>
            <Link to="/world-builder">
              <GradientButton size="sm" variant="emerald">+ New</GradientButton>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {worlds.length === 0 ? (
              <div className="col-span-full">
                <GlowCard glowColor="emerald" className="p-12 text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-4">
                    No worlds yet
                  </p>
                  <Link to="/world-builder">
                    <GradientButton variant="emerald">
                      <Sparkles className="w-4 h-4 mr-2 inline" />
                      Create Your First World
                    </GradientButton>
                  </Link>
                </GlowCard>
              </div>
            ) : (
              worlds.map((world, index) => (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <GlowCard glowColor="emerald" className="relative hover-tilt">
                  {world.mintedAsIP && (
                    <motion.div 
                      className="absolute top-4 right-4"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Coins className="w-6 h-6 text-gold animate-pulse-glow" />
                    </motion.div>
                  )}
                  <div className="w-full h-48 bg-gradient-emerald rounded-lg mb-4 flex items-center justify-center overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Globe className="w-16 h-16 text-white/50" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{world.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{world.era}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {world.description}
                  </p>
                </GlowCard>
              </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Royalty Splits Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold gradient-text-gold mb-6">Royalty Distribution</h2>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-xl mb-6 bg-secondary">
              <TabsTrigger value="all">All Assets</TabsTrigger>
              <TabsTrigger value="characters">Characters</TabsTrigger>
              <TabsTrigger value="worlds">Worlds</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {royaltySplits.length === 0 ? (
                <GlowCard glowColor="gold" className="p-12 text-center">
                  <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-2">
                    No royalty distributions yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Royalties will appear here once you mint IP and receive contributions
                  </p>
                </GlowCard>
              ) : (
                royaltySplits.map((royalty, index) => (
                <motion.div
                  key={royalty.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <GlowCard glowColor="gold" className="hover-tilt">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="capitalize bg-gold/20 text-gold">
                            {royalty.assetType}
                          </Badge>
                          <h3 className="text-xl font-bold">{royalty.assetName}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Total Revenue: <span className="text-gold font-semibold">${royalty.totalRevenue.toFixed(2)}</span>
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-gold opacity-50" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Creator ({royalty.creatorAddress})</span>
                        <span className="font-semibold">{royalty.creatorPercentage}%</span>
                      </div>
                      {royalty.contributors.map((contributor, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm pl-4 border-l-2 border-primary/30">
                          <span className="text-muted-foreground">{contributor.name}</span>
                          <span className="font-semibold text-primary">{contributor.percentage}%</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Last distribution: {royalty.lastDistribution.toLocaleDateString()}
                    </p>
                  </GlowCard>
                </motion.div>
                ))
              )}
            </TabsContent>

            <TabsContent value="characters">
              {royaltySplits.filter(r => r.assetType === "character").length === 0 ? (
                <GlowCard glowColor="gold" className="p-12 text-center">
                  <p className="text-muted-foreground">No character royalties yet</p>
                </GlowCard>
              ) : (
                royaltySplits
                  .filter(r => r.assetType === "character")
                  .map((royalty, index) => (
                  <motion.div
                    key={royalty.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlowCard glowColor="gold">
                      <h3 className="text-xl font-bold mb-2">{royalty.assetName}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Revenue: <span className="text-gold font-semibold">${royalty.totalRevenue.toFixed(2)}</span>
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Creator</span>
                          <span>{royalty.creatorPercentage}%</span>
                        </div>
                        {royalty.contributors.map((c, idx) => (
                          <div key={idx} className="flex justify-between text-sm pl-4">
                            <span>{c.name}</span>
                            <span>{c.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </GlowCard>
                  </motion.div>
                  ))
              )}
            </TabsContent>

            <TabsContent value="worlds">
              {royaltySplits.filter(r => r.assetType === "world").length === 0 ? (
                <GlowCard glowColor="gold" className="p-12 text-center">
                  <p className="text-muted-foreground">No world royalties yet</p>
                </GlowCard>
              ) : (
                royaltySplits
                  .filter(r => r.assetType === "world")
                  .map((royalty, index) => (
                  <motion.div
                    key={royalty.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlowCard glowColor="gold">
                      <h3 className="text-xl font-bold mb-2">{royalty.assetName}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Revenue: <span className="text-gold font-semibold">${royalty.totalRevenue.toFixed(2)}</span>
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Creator</span>
                          <span>{royalty.creatorPercentage}%</span>
                        </div>
                        {royalty.contributors.map((c, idx) => (
                          <div key={idx} className="flex justify-between text-sm pl-4">
                            <span>{c.name}</span>
                            <span>{c.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </GlowCard>
                  </motion.div>
                  ))
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;