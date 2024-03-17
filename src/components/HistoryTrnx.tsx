import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import SingleTrnx from "./SingleTrnx";
import PopUp from "./PopUp";
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
        <ul className="space-y-4">
          {transactions.map((trnx) => (
            <li
              className="p-4 border-4 border-[#8612F1] rounded-lg"
              key={trnx.hash}
            >
              <SingleTrnx hash={trnx.hash} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-bold mt-2 text-lg">No transactions.</p>
      )}
    </PopUp>
  );
};

export default HistoryTrnx;
