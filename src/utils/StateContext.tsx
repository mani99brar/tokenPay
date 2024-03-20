import { createContext, useContext, useState, useEffect } from "react";
import tokens from "./tokenData.json";
import { readTheme, storeOrUpdateTheme } from "./localStorage/readAndWrite";
interface GlobalContextType {
  selectedToken: token | null;
  setSelectedToken: (token: token | null) => void;
  setSelectedTokenBalance: (balance: string) => void;
  lastTransaction: Transaction | null;
  setLastTransaction: (transaction: Transaction | null) => void;
  uiTheme: string;
  setAllUiTheme: (theme: string) => void;
  updateLastTransactionState: () => void;
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

interface Transaction {
  hash: string;
  isPending: boolean;
  chainId: number;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<any> = ({ children }) => {
  const [selectedToken, setSelectedToken] = useState<token | null>(null);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(
    null
  );

  const [uiTheme, setUiTheme] = useState<string>("");

  useEffect(() => {
    const theme = readTheme();
    setUiTheme(theme);
  }, []);

  const setSelectedTokenBalance = (balance: string) => {
    setSelectedToken((prevToken) => {
      if (prevToken === null) {
        console.warn("No selected token to update balance for.");
        return null;
      }
      return { ...prevToken, userBalance: balance };
    });
  };

  const updateLastTransactionState = () => {
    setLastTransaction((prevTransaction) => {
      if (!prevTransaction) {
        return null;
      }
      return {
        ...prevTransaction,
        isPending: false,
      };
    });
  };

  const setAllUiTheme = (theme: string) => {
    storeOrUpdateTheme(theme);
    setUiTheme(theme);
  };

  const value = {
    selectedToken,
    setSelectedToken,
    setSelectedTokenBalance,
    lastTransaction,
    setLastTransaction,
    uiTheme,
    setAllUiTheme,
    updateLastTransactionState,
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
