import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCharacters, mockWorlds, mockPlotArcs } from "@/mock";
import { Network, User, Globe, BookOpen, Sparkles, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface Node {
  id: string;
  type: "character" | "world" | "plot";
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface Link {
  source: string;
  target: string;
  type: string;
}

const StoryGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const nodesRef = useRef<Node[]>([]);
  const linksRef = useRef<Link[]>([]);
  const animationFrameRef = useRef<number>();

  // Initialize nodes and links
  useEffect(() => {
    const nodes: Node[] = [];
    const links: Link[] = [];

    // Add character nodes
    mockCharacters.forEach((char) => {
      nodes.push({
        id: `char-${char.id}`,
        type: "character",
        label: char.name,
        x: Math.random() * 800 + 100,
        y: Math.random() * 600 + 100,
        vx: 0,
        vy: 0,
        radius: 30,
        color: "hsl(280, 85%, 65%)",
      });
    });

    // Add world nodes
    mockWorlds.forEach((world) => {
      nodes.push({
        id: `world-${world.id}`,
        type: "world",
        label: world.name,
        x: Math.random() * 800 + 100,
        y: Math.random() * 600 + 100,
        vx: 0,
        vy: 0,
        radius: 35,
        color: "hsl(160, 84%, 55%)",
      });
    });

    // Add plot nodes
    mockPlotArcs.forEach((plot) => {
      nodes.push({
        id: `plot-${plot.id}`,
        type: "plot",
        label: plot.title,
        x: Math.random() * 800 + 100,
        y: Math.random() * 600 + 100,
        vx: 0,
        vy: 0,
        radius: 25,
        color: "hsl(320, 80%, 60%)",
      });

      // Link characters to plots
      plot.characters.forEach((charId) => {
        links.push({
          source: `char-${charId}`,
          target: `plot-${plot.id}`,
          type: "involves",
        });
      });

      // Link plots to worlds
      links.push({
        source: `plot-${plot.id}`,
        target: `world-${plot.worldId}`,
        type: "set_in",
      });
    });

    nodesRef.current = nodes;
    linksRef.current = links;
  }, []);

  // Force-directed graph simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const nodes = nodesRef.current;
    const links = linksRef.current;

    const charge = -300;
    const linkDistance = 150;
    const alpha = 0.3;
    const alphaDecay = 0.02;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply forces
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.vx = 0;
        node.vy = 0;

        // Repulsion between nodes
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = charge / (distance * distance);
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        }

        // Attraction along links
        links.forEach((link) => {
          const source = nodes.find((n) => n.id === link.source);
          const target = nodes.find((n) => n.id === link.target);
          if (!source || !target) return;

          if (source.id === node.id || target.id === node.id) {
            const other = source.id === node.id ? target : source;
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = (distance - linkDistance) * alpha;
            node.vx += (dx / distance) * force;
            node.vy += (dy / distance) * force;
          }
        });

        // Center gravity
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        node.vx += dx * 0.01;
        node.vy += dy * 0.01;

        // Update position
        node.x += node.vx * alpha;
        node.y += node.vy * alpha;

        // Damping
        node.vx *= 0.9;
        node.vy *= 0.9;

        // Boundary constraints
        node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(canvas.height - node.radius, node.y));
      }

      // Draw links
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);
      
      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source);
        const target = nodes.find((n) => n.id === link.target);
        if (!source || !target) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = "rgba(199, 146, 234, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node) => {
        // Glow effect
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius * 2
        );
        gradient.addColorStop(0, node.color + "80");
        gradient.addColorStop(1, node.color + "00");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing effect for selected node
        if (selectedNode?.id === node.id) {
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = "white";
        ctx.font = "12px Inter";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.radius + 20);
      });

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [zoom, pan, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const clickedNode = nodesRef.current.find((node) => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius;
    });

    setSelectedNode(clickedNode || null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.5, Math.min(2, prev * delta)));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const getNodeDetails = () => {
    if (!selectedNode) return null;

    const nodeId = selectedNode.id.split("-")[1];
    const nodeType = selectedNode.type;

    if (nodeType === "character") {
      return mockCharacters.find((c) => c.id === nodeId);
    } else if (nodeType === "world") {
      return mockWorlds.find((w) => w.id === nodeId);
    } else if (nodeType === "plot") {
      return mockPlotArcs.find((p) => p.id === nodeId);
    }
    return null;
  };

  const nodeDetails = getNodeDetails();

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-nebula">
                Story Graph
              </h1>
              <p className="text-xl text-muted-foreground">
                Visualize connections between characters, worlds, and plot arcs
              </p>
            </div>
            <div className="flex gap-2">
              <GradientButton
                variant="cosmic"
                size="sm"
                onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
              >
                <ZoomIn className="w-4 h-4" />
              </GradientButton>
              <GradientButton
                variant="cosmic"
                size="sm"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              >
                <ZoomOut className="w-4 h-4" />
              </GradientButton>
              <GradientButton variant="emerald" size="sm" onClick={resetView}>
                <RotateCcw className="w-4 h-4" />
              </GradientButton>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graph Canvas */}
          <div className="lg:col-span-2">
            <GlowCard className="p-0 overflow-hidden relative" style={{ height: "600px" }}>
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-move"
                onClick={handleCanvasClick}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span>Characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald" />
                    <span>Worlds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span>Plots</span>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Node Details Panel */}
          <div>
            {nodeDetails ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <GlowCard glowColor={selectedNode?.type === "character" ? "primary" : selectedNode?.type === "world" ? "emerald" : "accent"}>
                  <div className="flex items-center gap-2 mb-4">
                    {selectedNode?.type === "character" && <User className="w-5 h-5" />}
                    {selectedNode?.type === "world" && <Globe className="w-5 h-5" />}
                    {selectedNode?.type === "plot" && <BookOpen className="w-5 h-5" />}
                    <h3 className="text-xl font-bold">{selectedNode?.label}</h3>
                  </div>

                  {selectedNode?.type === "character" && "backstory" in nodeDetails && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">{nodeDetails.backstory}</p>
                      <div className="flex flex-wrap gap-2">
                        {nodeDetails.abilities?.slice(0, 3).map((ability) => (
                          <Badge key={ability} className="bg-primary/20 text-primary">
                            {ability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedNode?.type === "world" && "description" in nodeDetails && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{nodeDetails.era}</p>
                      <p className="text-sm text-muted-foreground">{nodeDetails.description}</p>
                    </div>
                  )}

                  {selectedNode?.type === "plot" && "description" in nodeDetails && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">{nodeDetails.description}</p>
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">
                          Characters: {nodeDetails.characters?.length || 0}
                        </p>
                        <p className="text-muted-foreground">
                          Status: <Badge className="ml-1">{nodeDetails.status}</Badge>
                        </p>
                      </div>
                    </div>
                  )}
                </GlowCard>
              </motion.div>
            ) : (
              <GlowCard>
                <div className="text-center py-12">
                  <Network className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Click on a node to view details
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Drag to pan, scroll to zoom
                  </p>
                </div>
              </GlowCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryGraph;

