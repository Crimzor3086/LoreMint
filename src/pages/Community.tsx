import { useState } from "react";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWalletContext } from "@/context/WalletContext";
import { useContributions } from "@/hooks/useContributions";
import { ThumbsUp, MessageSquare, CheckCircle, Clock, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Community = () => {
  const { wallet } = useWalletContext();
  const { contributions, isLoading, submit, vote, approve, reject, fetchContributions } = useContributions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contributionType, setContributionType] = useState<string>("");
  const [contributionTitle, setContributionTitle] = useState("");
  const [contributionDescription, setContributionDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votedContributions, setVotedContributions] = useState<Set<string>>(new Set());
  const [assetId, setAssetId] = useState(""); // TODO: Get from context or selection

  const handleVote = async (id: string) => {
    if (!wallet.isConnected) {
      toast.error("Please connect your wallet to vote");
      return;
    }

    if (votedContributions.has(id)) {
      toast.info("You have already voted for this contribution");
      return;
    }

    try {
      await vote(id);
      setVotedContributions((prev) => new Set([...prev, id]));
      toast.success("Vote submitted!");
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to submit vote");
    }
  };

  const handleSubmitContribution = async () => {
    if (!wallet.isConnected) {
      toast.error("Please connect your wallet to submit a contribution");
      return;
    }

    if (!contributionType || !contributionTitle || !contributionDescription || !assetId) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await submit(
        contributionType as "character" | "story" | "artwork" | "expansion",
        contributionTitle,
        contributionDescription,
        assetId
      );
      
      setIsDialogOpen(false);
      setContributionType("");
      setContributionTitle("");
      setContributionDescription("");
      setAssetId("");
      toast.success("Contribution submitted! It will be reviewed by the community.");
    } catch (error) {
      console.error("Error submitting contribution:", error);
      toast.error("Failed to submit contribution");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!wallet.isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      // Default royalty percentage - could be made configurable
      await approve(id, 10);
      toast.success("Contribution approved!");
    } catch (error) {
      console.error("Error approving contribution:", error);
      toast.error("Failed to approve contribution");
    }
  };

  const handleReject = async (id: string) => {
    if (!wallet.isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      await reject(id);
      toast.success("Contribution rejected");
    } catch (error) {
      console.error("Error rejecting contribution:", error);
      toast.error("Failed to reject contribution");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-emerald/20 text-emerald";
      case "pending": return "bg-gold/20 text-gold";
      case "rejected": return "bg-destructive/20 text-destructive";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return null;
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-magic">
            Community Expansion Hub
          </h1>
          <p className="text-xl text-muted-foreground">
            Collaborate with creators to expand storyworlds
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-8 bg-secondary">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {isLoading ? (
                <GlowCard className="p-12 text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading contributions...</p>
                </GlowCard>
              ) : contributions.length === 0 ? (
                <GlowCard className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-2">
                    No contributions yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Be the first to contribute to the storyworld!
                  </p>
                  {wallet.isConnected && (
                    <GradientButton
                      variant="magic"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Sparkles className="w-4 h-4 mr-2 inline" />
                      Submit Your Contribution
                    </GradientButton>
                  )}
                </GlowCard>
              ) : (
                contributions.map((contribution, index) => (
                <motion.div
                  key={contribution.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <GlowCard className="hover-tilt">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Contributor Info */}
                      <div className="flex items-start gap-4 md:w-1/4">
                        <Avatar className="w-12 h-12 border-2 border-primary">
                          <AvatarFallback className="bg-gradient-cosmic text-white">
                            {contribution.contributorAddress.slice(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-1">
                            {contribution.contributorAddress}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {contribution.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Contribution Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="capitalize">
                                {contribution.type}
                              </Badge>
                              <Badge className={getStatusColor(contribution.status)}>
                                {getStatusIcon(contribution.status)}
                                <span className="ml-1 capitalize">{contribution.status}</span>
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{contribution.title}</h3>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {contribution.description}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleVote(contribution.id)}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{contribution.votes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>Comment</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
                ))
              )}
            </TabsContent>

            <TabsContent value="submissions">
              {!wallet.isConnected ? (
                <GlowCard className="p-12 text-center">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-4">
                    Connect your wallet to view your submissions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Connect your MetaMask wallet to see contributions you've submitted
                  </p>
                </GlowCard>
              ) : isLoading ? (
                <GlowCard className="p-12 text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading your submissions...</p>
                </GlowCard>
              ) : contributions.filter(c => c.contributorAddress.toLowerCase() === wallet.address?.toLowerCase()).length === 0 ? (
                <GlowCard className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-2">
                    No submissions yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Submit your first contribution to expand the storyworld!
                  </p>
                  <GradientButton
                    variant="magic"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Sparkles className="w-4 h-4 mr-2 inline" />
                    Submit Your Contribution
                  </GradientButton>
                </GlowCard>
              ) : (
                <div className="space-y-6">
                  {contributions
                    .filter(c => c.contributorAddress.toLowerCase() === wallet.address?.toLowerCase())
                    .map((contribution, index) => (
                      <motion.div
                        key={contribution.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <GlowCard className="hover-tilt">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex items-start gap-4 md:w-1/4">
                              <Avatar className="w-12 h-12 border-2 border-primary">
                                <AvatarFallback className="bg-gradient-cosmic text-white">
                                  {contribution.contributorAddress.slice(2, 4).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-1">
                                  {contribution.contributorAddress.slice(0, 6)}...{contribution.contributorAddress.slice(-4)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(contribution.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className="capitalize">
                                      {contribution.type}
                                    </Badge>
                                    <Badge className={getStatusColor(contribution.status)}>
                                      {getStatusIcon(contribution.status)}
                                      <span className="ml-1 capitalize">{contribution.status}</span>
                                    </Badge>
                                  </div>
                                  <h3 className="text-xl font-bold mb-2">{contribution.title}</h3>
                                </div>
                              </div>
                              <p className="text-muted-foreground mb-4">
                                {contribution.description}
                              </p>
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => handleVote(contribution.id)}
                                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                  disabled={votedContributions.has(contribution.id)}
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{contribution.votes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </GlowCard>
                      </motion.div>
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved">
              {isLoading ? (
                <GlowCard className="p-12 text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading approved contributions...</p>
                </GlowCard>
              ) : contributions.filter(c => c.status === "approved").length === 0 ? (
                <GlowCard className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-2">
                    No approved contributions yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Approved contributions will appear here
                  </p>
                </GlowCard>
              ) : (
                <div className="space-y-6">
                  {contributions
                    .filter(c => c.status === "approved")
                    .map((contribution, index) => (
                    <motion.div
                      key={contribution.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlowCard glowColor="emerald">
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar className="w-12 h-12 border-2 border-emerald">
                            <AvatarFallback className="bg-gradient-emerald text-white">
                              {contribution.contributorAddress.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="capitalize">{contribution.type}</Badge>
                              <Badge className="bg-emerald/20 text-emerald">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approved
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{contribution.title}</h3>
                            <p className="text-muted-foreground">{contribution.description}</p>
                          </div>
                        </div>
                      </GlowCard>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending">
              {!wallet.isConnected ? (
                <GlowCard className="p-12 text-center">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-4">
                    Connect your wallet to review contributions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Connect your MetaMask wallet to review and approve pending contributions
                  </p>
                </GlowCard>
              ) : isLoading ? (
                <GlowCard className="p-12 text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading pending contributions...</p>
                </GlowCard>
              ) : contributions.filter(c => c.status === "pending").length === 0 ? (
                <GlowCard className="p-12 text-center">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl text-muted-foreground mb-2">
                    No pending contributions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All contributions have been reviewed
                  </p>
                </GlowCard>
              ) : (
                <div className="space-y-6">
                  {contributions
                    .filter(c => c.status === "pending")
                    .map((contribution, index) => (
                    <motion.div
                      key={contribution.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlowCard glowColor="accent">
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar className="w-12 h-12 border-2 border-accent">
                            <AvatarFallback className="bg-gradient-magic text-white">
                              {contribution.contributorAddress.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="capitalize">{contribution.type}</Badge>
                              <Badge className="bg-gold/20 text-gold">
                                <Clock className="w-4 h-4 mr-1" />
                                Pending
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{contribution.title}</h3>
                            <p className="text-muted-foreground mb-4">{contribution.description}</p>
                            <div className="flex gap-2">
                              <GradientButton 
                                size="sm" 
                                variant="emerald"
                                onClick={() => handleApprove(contribution.id)}
                              >
                                Approve
                              </GradientButton>
                              <GradientButton 
                                size="sm" 
                                variant="cosmic"
                                onClick={() => handleReject(contribution.id)}
                              >
                                Reject
                              </GradientButton>
                            </div>
                          </div>
                        </div>
                      </GlowCard>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <GradientButton variant="magic" size="lg">
                <Sparkles className="w-5 h-5 mr-2 inline" />
                Submit Your Contribution
              </GradientButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-text-magic">
                  Submit a Contribution
                </DialogTitle>
                <DialogDescription>
                  Share your ideas to expand the storyworld. Your contribution will be reviewed by creators and the community.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <Label htmlFor="type" className="mb-2 block">
                    Contribution Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={contributionType} onValueChange={setContributionType}>
                    <SelectTrigger id="type" className="bg-secondary border-border">
                      <SelectValue placeholder="Select contribution type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="character">Character</SelectItem>
                      <SelectItem value="story">Story Expansion</SelectItem>
                      <SelectItem value="artwork">Artwork</SelectItem>
                      <SelectItem value="expansion">World Expansion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title" className="mb-2 block">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={contributionTitle}
                    onChange={(e) => setContributionTitle(e.target.value)}
                    placeholder="Enter a title for your contribution..."
                    className="bg-secondary border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="mb-2 block">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={contributionDescription}
                    onChange={(e) => setContributionDescription(e.target.value)}
                    placeholder="Describe your contribution in detail..."
                    rows={6}
                    className="bg-secondary border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="assetId" className="mb-2 block">
                    Asset ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="assetId"
                    type="text"
                    value={assetId}
                    onChange={(e) => setAssetId(e.target.value)}
                    placeholder="Enter the token ID of the character/world/plot you're contributing to..."
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The token ID of the IP asset you want to contribute to
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <GradientButton
                    variant="magic"
                    onClick={handleSubmitContribution}
                    disabled={isSubmitting || !contributionType || !contributionTitle || !contributionDescription || !assetId}
                    className="flex-1"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Contribution"}
                  </GradientButton>
                  <GradientButton
                    variant="cosmic"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </GradientButton>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;