import { motion } from "framer-motion";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlowCard } from "@/components/ui/glow-card";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Sparkles, BookOpen, Coins, Network, Users, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI Character Builder",
      description: "Generate rich, detailed characters with AI-powered backstories and abilities.",
      color: "primary" as const,
    },
    {
      icon: Coins,
      title: "IP Minting",
      description: "Tokenize your characters, worlds, and stories as blockchain-based intellectual property.",
      color: "emerald" as const,
    },
    {
      icon: Network,
      title: "Storyworld Graph",
      description: "Visualize connections between characters, plots, and worlds in an interactive graph.",
      color: "accent" as const,
    },
    {
      icon: Users,
      title: "Collaborative Lore",
      description: "Community-driven expansions that grow your storyworld organically.",
      color: "primary" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-16">
        {/* Enhanced Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
          
          {/* Floating orbs */}
          <div className="absolute top-40 right-1/4 w-32 h-32 bg-neon-pink/10 rounded-full blur-2xl animate-float-slow" />
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-cosmic-blue/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Floating decorative stars */}
            <motion.div
              className="absolute -top-20 left-1/4"
              animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="w-8 h-8 text-primary/30" />
            </motion.div>
            <motion.div
              className="absolute -top-10 right-1/3"
              animate={{ y: [10, -10, 10], rotate: [360, 180, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-6 h-6 text-accent/30" />
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6 gradient-text-nebula"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              LoreMint
            </motion.h1>
            
            <motion.p 
              className="text-3xl md:text-5xl font-semibold mb-4 text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Create. Tokenize. Expand.
            </motion.p>
            
            <motion.p 
              className="text-xl md:text-2xl mb-12 text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your Storyworld, powered by AI and blockchain. Build immersive narratives, mint your IP, and collaborate with a community of creators.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/dashboard">
                <GradientButton variant="cosmic" size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    <Zap className="w-5 h-5 mr-2 inline" />
                    Start Creating
                  </span>
                  <span className="absolute inset-0 bg-gradient-magic opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </GradientButton>
              </Link>
              <Link to="/community">
                <GradientButton variant="emerald" size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 inline" />
                    Explore Stories
                  </span>
                  <span className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </GradientButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-magic">
              Magical Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to build and expand your story universe
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <GlowCard glowColor={feature.color} className="h-full hover-tilt">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    <feature.icon className="w-12 h-12 mb-4 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Your Journey Begins
            </h2>
            <p className="text-xl text-muted-foreground">
              Four steps to create your legendary storyworld
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Build Characters", desc: "Use AI to generate rich character profiles with unique abilities and backstories" },
              { num: "02", title: "Design Worlds", desc: "Create immersive settings with detailed lore, geography, and cultures" },
              { num: "03", title: "Mint Your IP", desc: "Transform your creations into blockchain-based intellectual property" },
              { num: "04", title: "Collaborate", desc: "Let the community expand your universe with new stories and characters" },
            ].map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlowCard>
                  <div className="text-6xl font-bold gradient-text mb-4">{step.num}</div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlowCard glowColor="accent" className="p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-magic">
                Ready to Create Your Legend?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of creators building the future of storytelling
              </p>
              <Link to="/dashboard">
                <GradientButton variant="magic" size="lg">
                  <Sparkles className="w-5 h-5 mr-2 inline" />
                  Launch Your Storyworld
                </GradientButton>
              </Link>
            </GlowCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;