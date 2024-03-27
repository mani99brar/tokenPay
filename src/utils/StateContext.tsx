import { createContext, useContext, useState, useEffect } from "react";
import { readTheme, storeOrUpdateTheme } from "./localStorage/readAndWrite";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Token, Transaction } from "@/types/blockchainData";
interface GlobalContextType {
  selectedToken: Token | null;
  setSelectedToken: (token: Token | null) => void;
  setSelectedTokenBalance: (balance: string) => void;
  activeTransaction: Transaction | null;
  setActiveTransaction: (transaction: Transaction | null) => void;
  uiTheme: string;
  setAllUiTheme: (theme: string) => void;
  updateActiveTransactionStatus: () => void;
  setActiveTransactionState: (state: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<any> = ({ children }) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [activeTransaction, setActiveTransaction] =
    useState<Transaction | null>(null);

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

  const updateActiveTransactionStatus = () => {
    setActiveTransaction((prevTransaction) => {
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

  const setActiveTransactionState = (state: boolean) => {
    setActiveTransaction((prevTransaction) => {
      if (!prevTransaction) {
        return { hash: null, chainId: null, isPending: true, isActive: state };
      }
      return {
        ...prevTransaction,
        isActive: state,
      };
    });
  };

  const value = {
    selectedToken,
    setSelectedToken,
    setSelectedTokenBalance,
    activeTransaction,
    setActiveTransaction,
    uiTheme,
    setAllUiTheme,
    updateActiveTransactionStatus,
    setActiveTransactionState,
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
