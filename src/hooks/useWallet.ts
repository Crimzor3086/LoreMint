import { useState, useEffect } from "react";
import { initPolygonConnection, switchToPolygon, getBalance } from "@/lib/blockchain/polygon";

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

  useEffect(() => {
    // Check if wallet was previously connected
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWallet((prev) => ({
        ...prev,
        address: savedAddress,
        isConnected: true,
      }));
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Initialize Polygon connection
      await initPolygonConnection();
      
      // Switch to Polygon network
      await switchToPolygon();

      // Mock wallet connection - replace with actual wallet provider (MetaMask, WalletConnect, etc.)
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      const balance = await getBalance(mockAddress);

      setWallet({
        address: mockAddress,
        isConnected: true,
        balance,
        chainId: 137, // Polygon
      });

      localStorage.setItem("walletAddress", mockAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
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

  return {
    wallet,
    connect,
    disconnect,
    isConnecting,
    error,
  };
}

