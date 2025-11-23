import { useState, useEffect } from "react";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Sparkles, Globe, BookOpen, Coins, TrendingUp, Users, DollarSign, TrendingDown, Wallet, Calendar, Percent, ArrowRight } from "lucide-react";
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold gradient-text-gold mb-2">Royalty Distribution</h2>
              <p className="text-sm text-muted-foreground">
                Track earnings and contributor shares from your minted IP assets
              </p>
            </div>
            {royaltySplits.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gold">
                  ${royaltySplits.reduce((sum, r) => sum + r.totalRevenue, 0).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {royaltySplits.length === 0 ? (
            <GlowCard glowColor="gold" className="p-12 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <DollarSign className="w-20 h-20 mx-auto mb-6 text-gold opacity-50" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3">No Royalty Distributions Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Royalties will appear here once you mint your IP assets and receive community contributions. 
                Each contribution automatically shares a percentage of revenue with contributors.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/mint">
                  <GradientButton variant="gold">
                    <Coins className="w-4 h-4 mr-2 inline" />
                    Mint Your First IP
                  </GradientButton>
                </Link>
                <Link to="/community">
                  <GradientButton variant="cosmic">
                    <Users className="w-4 h-4 mr-2 inline" />
                    View Community
                  </GradientButton>
                </Link>
              </div>
            </GlowCard>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-xl mb-8 bg-secondary">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  All Assets ({royaltySplits.length})
                </TabsTrigger>
                <TabsTrigger value="characters" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Characters ({royaltySplits.filter(r => r.assetType === "character").length})
                </TabsTrigger>
                <TabsTrigger value="worlds" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Worlds ({royaltySplits.filter(r => r.assetType === "world").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {royaltySplits.map((royalty, index) => {
                  const creatorAmount = (royalty.totalRevenue * royalty.creatorPercentage) / 100;
                  const totalContributorPercentage = royalty.contributors.reduce((sum, c) => sum + c.percentage, 0);
                  
                  return (
                    <motion.div
                      key={royalty.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <GlowCard glowColor="gold" className="hover-tilt overflow-hidden">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6 pb-4 border-b border-gold/20">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge className="capitalize bg-gold/20 text-gold border-gold/30 px-3 py-1">
                                {royalty.assetType}
                              </Badge>
                              <h3 className="text-2xl font-bold">{royalty.assetName}</h3>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Wallet className="w-4 h-4" />
                                <span className="font-mono text-xs">{royalty.creatorAddress.slice(0, 6)}...{royalty.creatorAddress.slice(-4)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>Last: {royalty.lastDistribution.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                            <p className="text-3xl font-bold text-gold">
                              ${royalty.totalRevenue.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Distribution Breakdown */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gold"></div>
                                <span className="font-semibold">Creator Share</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-gold font-bold">{royalty.creatorPercentage}%</span>
                                <span className="text-gold font-bold">${creatorAmount.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${royalty.creatorPercentage}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="h-full bg-gradient-to-r from-gold to-yellow-400"
                              />
                            </div>
                          </div>

                          {royalty.contributors.length > 0 && (
                            <div className="pt-4 border-t border-primary/10">
                              <div className="flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-sm">Contributors ({royalty.contributors.length})</span>
                                <span className="text-xs text-muted-foreground ml-auto">
                                  {totalContributorPercentage}% total
                                </span>
                              </div>
                              <div className="space-y-3">
                                {royalty.contributors.map((contributor, idx) => {
                                  const contributorAmount = (royalty.totalRevenue * contributor.percentage) / 100;
                                  return (
                                    <div key={idx} className="pl-4 border-l-2 border-primary/30">
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                                          <span className="text-sm font-medium">{contributor.name}</span>
                                          <span className="text-xs text-muted-foreground font-mono">
                                            {contributor.address.slice(0, 6)}...{contributor.address.slice(-4)}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <span className="text-primary font-semibold text-sm">{contributor.percentage}%</span>
                                          <span className="text-primary font-semibold">${contributorAmount.toFixed(2)}</span>
                                        </div>
                                      </div>
                                      <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${contributor.percentage}%` }}
                                          transition={{ duration: 0.8, delay: index * 0.1 + idx * 0.05 }}
                                          className="h-full bg-gradient-to-r from-primary to-purple-500"
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-6 pt-4 border-t border-gold/10 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Percent className="w-3 h-3" />
                            <span>
                              {royalty.creatorPercentage + totalContributorPercentage}% distributed
                            </span>
                          </div>
                          <Link 
                            to={`/graph`}
                            className="text-xs text-gold hover:text-yellow-400 transition-colors flex items-center gap-1"
                          >
                            View in Graph
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </GlowCard>
                    </motion.div>
                  );
                })}
              </TabsContent>

              <TabsContent value="characters" className="space-y-6">
                {royaltySplits.filter(r => r.assetType === "character").length === 0 ? (
                  <GlowCard glowColor="gold" className="p-12 text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-xl text-muted-foreground mb-2">No character royalties yet</p>
                    <p className="text-sm text-muted-foreground">
                      Mint characters and receive contributions to see royalty distributions here
                    </p>
                  </GlowCard>
                ) : (
                  royaltySplits
                    .filter(r => r.assetType === "character")
                    .map((royalty, index) => {
                      const creatorAmount = (royalty.totalRevenue * royalty.creatorPercentage) / 100;
                      return (
                        <motion.div
                          key={royalty.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <GlowCard glowColor="gold" className="hover-tilt">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold mb-2">{royalty.assetName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Revenue: <span className="text-gold font-semibold">${royalty.totalRevenue.toFixed(2)}</span>
                                </p>
                              </div>
                              <Users className="w-8 h-8 text-gold opacity-50" />
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gold/10 rounded-lg">
                                <span className="font-medium">Creator</span>
                                <div className="flex items-center gap-4">
                                  <span className="text-gold font-bold">{royalty.creatorPercentage}%</span>
                                  <span className="text-gold font-bold">${creatorAmount.toFixed(2)}</span>
                                </div>
                              </div>
                              {royalty.contributors.map((c, idx) => {
                                const contributorAmount = (royalty.totalRevenue * c.percentage) / 100;
                                return (
                                  <div key={idx} className="flex items-center justify-between p-3 bg-primary/10 rounded-lg pl-6 border-l-2 border-primary/30">
                                    <div>
                                      <span className="font-medium text-sm">{c.name}</span>
                                      <p className="text-xs text-muted-foreground font-mono">{c.address.slice(0, 8)}...{c.address.slice(-6)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-primary font-semibold">{c.percentage}%</span>
                                      <span className="text-primary font-semibold">${contributorAmount.toFixed(2)}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </GlowCard>
                        </motion.div>
                      );
                    })
                )}
              </TabsContent>

              <TabsContent value="worlds" className="space-y-6">
                {royaltySplits.filter(r => r.assetType === "world").length === 0 ? (
                  <GlowCard glowColor="gold" className="p-12 text-center">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-xl text-muted-foreground mb-2">No world royalties yet</p>
                    <p className="text-sm text-muted-foreground">
                      Mint worlds and receive contributions to see royalty distributions here
                    </p>
                  </GlowCard>
                ) : (
                  royaltySplits
                    .filter(r => r.assetType === "world")
                    .map((royalty, index) => {
                      const creatorAmount = (royalty.totalRevenue * royalty.creatorPercentage) / 100;
                      return (
                        <motion.div
                          key={royalty.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <GlowCard glowColor="gold" className="hover-tilt">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold mb-2">{royalty.assetName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Revenue: <span className="text-gold font-semibold">${royalty.totalRevenue.toFixed(2)}</span>
                                </p>
                              </div>
                              <Globe className="w-8 h-8 text-gold opacity-50" />
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gold/10 rounded-lg">
                                <span className="font-medium">Creator</span>
                                <div className="flex items-center gap-4">
                                  <span className="text-gold font-bold">{royalty.creatorPercentage}%</span>
                                  <span className="text-gold font-bold">${creatorAmount.toFixed(2)}</span>
                                </div>
                              </div>
                              {royalty.contributors.map((c, idx) => {
                                const contributorAmount = (royalty.totalRevenue * c.percentage) / 100;
                                return (
                                  <div key={idx} className="flex items-center justify-between p-3 bg-primary/10 rounded-lg pl-6 border-l-2 border-primary/30">
                                    <div>
                                      <span className="font-medium text-sm">{c.name}</span>
                                      <p className="text-xs text-muted-foreground font-mono">{c.address.slice(0, 8)}...{c.address.slice(-6)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-primary font-semibold">{c.percentage}%</span>
                                      <span className="text-primary font-semibold">${contributorAmount.toFixed(2)}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </GlowCard>
                        </motion.div>
                      );
                    })
                )}
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;