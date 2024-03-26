import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import SingleTrnx from "./SingleTrnx";
import PopUp from "./PopUp";
import StandardButton from "./StandardButton";
import ThemeWrapper from "./ThemeWrapper";
import {
  readTrnxHistory,
  deleteTrnxHistory,
} from "@/utils/localStorage/readAndWrite";
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

  const handleDeleteHistory = () => {
    deleteTrnxHistory(chainId);
    setTransactions([]);
  };

  useEffect(() => {
    const filteredTransactions = readTrnxHistory(chainId);
    setTransactions(filteredTransactions.reverse());
  }, [chainId]);

  return (
    <PopUp prompt="Transaction History" setValue={setOpen}>
      {transactions.length > 0 ? (
        <>
          <ul className="space-y-4 h-full overflow-scroll">
            {transactions.map((trnx) => (
              <ThemeWrapper key={trnx.hash}>
                <li className="mt-2">
                  <SingleTrnx hash={trnx.hash as `0x${string}`} />
                </li>
              </ThemeWrapper>
            ))}
          </ul>
          <StandardButton
            prompt="Delete History"
            handleClick={handleDeleteHistory}
          />
        </>
      ) : (
        <ThemeWrapper size="fill">
          <p className="w-1/2">No transactions.</p>
        </ThemeWrapper>
      )}
    </PopUp>
  );
};

export default HistoryTrnx;
