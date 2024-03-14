import { createContext, useContext, useState, useEffect } from "react";
import tokens from "./tokenData.json";
interface GlobalContextType {
  selectedToken: token | null;
  setSelectedToken: (token: token) => void;
  setSelectedTokenBalance: (balance: string) => void;
  lastTransaction: string;
  setLastTransaction: (transaction: string) => void;
  uiTheme: string;
  setUiTheme: (theme: string) => void;
}

interface token {
  name: string;
  symbol: string;
  decimals: number;
  image?: string;
  chainId: number;
  address: string;
  userBalance?: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<any> = ({ children }) => {
  const [selectedToken, setSelectedToken] = useState<token>(
    tokens.allTokens[0]
  );
  const [lastTransaction, setLastTransaction] = useState("None");
  const [uiTheme, setUiTheme] = useState("light");

  // // Custom setter function that updates state and localStorage
  // const setSelectedTokenState = (token: token | null) => {
  //   setSelectedToken(token);
  //   localStorage.setItem("selectedToken", JSON.stringify(token));
  // };

  const setSelectedTokenBalance = (balance: string) => {
    setSelectedToken((prevToken) => ({
      ...prevToken,
      userBalance: balance,
    }));
  };

  const value = {
    selectedToken,
    setSelectedToken,
    setSelectedTokenBalance,
    lastTransaction,
    setLastTransaction,
    uiTheme,
    setUiTheme,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useWinner must be used within a WinnerProvider");
  }
  return context;
};
