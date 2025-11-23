import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { GradientButton } from "./ui/gradient-button";
import { NavLink } from "./NavLink";
import { Menu, X, Sparkles, Wallet } from "lucide-react";
import { toast } from "sonner";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const location = useLocation();

  const handleWalletConnect = () => {
    if (walletConnected) {
      setWalletConnected(false);
      toast.success("Wallet disconnected");
    } else {
      // Mock wallet connection
      setTimeout(() => {
        setWalletConnected(true);
        toast.success("Wallet connected!");
      }, 500);
    }
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/character-builder", label: "Create" },
    { to: "/community", label: "Community" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
            <span className="text-2xl font-bold gradient-text">LoreMint</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-muted-foreground hover:text-foreground transition-colors relative"
                activeClassName="text-primary"
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-cosmic"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </NavLink>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="hidden md:block">
            <GradientButton
              onClick={handleWalletConnect}
              variant={walletConnected ? "emerald" : "cosmic"}
              size="sm"
            >
              <Wallet className="w-4 h-4 mr-2 inline" />
              {walletConnected ? "0x1234...5678" : "Connect Wallet"}
            </GradientButton>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border/50 glass"
        >
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block text-muted-foreground hover:text-foreground transition-colors py-2"
                activeClassName="text-primary font-semibold"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-4">
              <GradientButton
                onClick={handleWalletConnect}
                variant={walletConnected ? "emerald" : "cosmic"}
                size="sm"
                className="w-full"
              >
                <Wallet className="w-4 h-4 mr-2 inline" />
                {walletConnected ? "0x1234...5678" : "Connect Wallet"}
              </GradientButton>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
