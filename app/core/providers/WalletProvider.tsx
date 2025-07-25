import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";

interface WalletContextType {
  connectedWallet: string;
  selectedWallet: string;
  setSelectedWallet: Dispatch<SetStateAction<string>>;
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
}


const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connectedWallet, setConnectedWallet] = useState("")
  const [selectedWallet, setSelectedWallet] = useState("")
  
  useEffect(() => {
    // Load wallet from localStorage
    const savedWallet = localStorage.getItem("connectedWallet")
    if (savedWallet) {
      setConnectedWallet(savedWallet)
    }
  }, [])
  
  const connectWallet = (address: string) => {
    setConnectedWallet(address)
    localStorage.setItem("connectedWallet", address)
  }
  
  const disconnectWallet = () => {
    setConnectedWallet("")
    localStorage.removeItem("connectedWallet")
  }
  
  return (
    <WalletContext.Provider value={{
      connectedWallet,
      selectedWallet,
      setSelectedWallet,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};