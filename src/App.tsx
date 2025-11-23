import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/context/WalletContext";
import { AIProvider } from "@/context/AIContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CharacterBuilder from "./pages/CharacterBuilder";
import WorldBuilder from "./pages/WorldBuilder";
import MintIP from "./pages/MintIP";
import StoryGraph from "./pages/StoryGraph";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <AIProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/character-builder" element={<CharacterBuilder />} />
              <Route path="/world-builder" element={<WorldBuilder />} />
              <Route path="/mint" element={<MintIP />} />
              <Route path="/graph" element={<StoryGraph />} />
              <Route path="/community" element={<Community />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AIProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
