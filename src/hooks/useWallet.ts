import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { switchToNetwork, getBalance, NETWORK_CONFIG } from "@/lib/blockchain/network";

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: string;
  chainId: number | null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    balance: "0.0",
    chainId: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== "undefined" && !!window.ethereum?.isMetaMask;

  useEffect(() => {
    if (!isMetaMaskInstalled) return;

    // Check if wallet was previously connected
    const checkConnection = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum!);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const address = await accounts[0].getAddress();
          const network = await provider.getNetwork();
          const balance = await getBalance(address);

          setWallet({
            address,
            isConnected: true,
            balance,
            chainId: Number(network.chainId),
          });
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err);
      }
    };

    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        connect();
      }
    };

    // Listen for chain changes
    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum?.on("accountsChanged", handleAccountsChanged);
    window.ethereum?.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [isMetaMaskInstalled]);

  const connect = async () => {
    if (!isMetaMaskInstalled) {
      setError("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const address = accounts[0];
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Switch to the expected network if not already on it
      if (chainId !== NETWORK_CONFIG.chainId) {
        await switchToNetwork();
        // Reload to get updated network
        window.location.reload();
        return;
      }

      // Get balance
      const balance = await getBalance(address);

      setWallet({
        address,
        isConnected: true,
        balance,
        chainId,
      });

      localStorage.setItem("walletAddress", address);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to connect wallet";
      setError(errorMessage);
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWallet({
      address: null,
      isConnected: false,
      balance: "0.0",
      chainId: null,
    });
    localStorage.removeItem("walletAddress");
  };

  // Refresh balance
  const refreshBalance = async () => {
    if (wallet.address) {
      try {
        const balance = await getBalance(wallet.address);
        setWallet((prev) => ({ ...prev, balance }));
      } catch (err) {
        console.error("Error refreshing balance:", err);
      }
    }
  };

  return {
    wallet,
    connect,
    disconnect,
    refreshBalance,
    isConnecting,
    error,
    isMetaMaskInstalled,
  };
}
