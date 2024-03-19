import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import SingleTrnx from "./SingleTrnx";
import PopUp from "./PopUp";
import StandardButton from "./StandardButton";
import ThemeWrapper from "./ThemeWrapper";
interface Transaction {
  hash: string;
  date: string;
  chainId: number;
}

interface HistoryTrnxProps {
  setOpen: (open: boolean) => void;
}

const HistoryTrnx = ({ setOpen }: HistoryTrnxProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { chainId } = useAccount();

  const deleteHistory = () => {
    localStorage.removeItem("transactions");
    setTransactions([]);
  };

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      const allTransactions = JSON.parse(storedTransactions);
      const filteredTransactions = allTransactions.filter(
        (trnx: Transaction) => trnx.chainId === chainId
      );
      setTransactions(filteredTransactions);
    }
  }, [chainId]);

  return (
    <PopUp prompt="Transaction History" setValue={setOpen}>
      {transactions.length > 0 ? (
        <>
          <ul className="space-y-4 h-full overflow-scroll">
            {transactions.map((trnx) => (
              <ThemeWrapper key={trnx.hash}>
                <li className="mt-2">
                  <SingleTrnx hash={trnx.hash} />
                </li>
              </ThemeWrapper>
            ))}
          </ul>
          <StandardButton prompt="Delete History" handleClick={deleteHistory} />
        </>
      ) : (
        <ThemeWrapper>No transactions.</ThemeWrapper>
      )}
    </PopUp>
  );
};

export default HistoryTrnx;
