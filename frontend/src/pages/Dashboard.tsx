import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { mockCharacters, mockWorlds, mockPlotArcs } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Sparkles, Globe, BookOpen, Coins, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
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
            { label: "Characters", value: mockCharacters.length, icon: Users, color: "primary" as const },
            { label: "Worlds", value: mockWorlds.length, icon: Globe, color: "emerald" as const },
            { label: "Plot Arcs", value: mockPlotArcs.length, icon: BookOpen, color: "accent" as const },
            { label: "Minted IPs", value: mockCharacters.filter(c => c.mintedAsIP).length, icon: Coins, color: "primary" as const },
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
            {mockCharacters.map((character, index) => (
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
            ))}
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
            {mockWorlds.map((world, index) => (
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
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;