import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import SingleTrnx from "./SingleTrnx";
import PopUp from "./PopUp";
import StandardButton from "./StandardButton";
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
              <li
                className="p-4 border-4 mt-2 border-[#8612F1] rounded-lg"
                key={trnx.hash}
              >
                <SingleTrnx hash={trnx.hash} />
              </li>
            ))}
          </ul>
          <StandardButton prompt="Delete History" handleClick={deleteHistory} />
        </>
      ) : (
        <p className="font-bold border-4 mt-2 border-[#8612F1] rounded-lg p-4 text-lg">
          No transactions.
        </p>
      )}
    </PopUp>
  );
};

export default HistoryTrnx;
