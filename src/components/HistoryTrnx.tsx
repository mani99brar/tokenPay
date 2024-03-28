import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import PopUp from "./PopUp";
import StandardButton from "./StandardButton";
import ThemeWrapper from "./ThemeWrapper";
import TransactionDetails from "./TransactionDetails";
import {
  formatBalance,
  trimAddress,
  getERC20TokenHistory,
} from "@/utils/helpers/commonHelpers";
import Loader from "./Loader";
interface Transaction {
  hash: string;
  timeStamp: number;
  tokenSymbol: string;
  value: string;
  tokenDecimal: string;
  to: string;
}

interface HistoryTrnxProps {
  setOpen: (open: boolean) => void;
}

const HistoryTrnx = ({ setOpen }: HistoryTrnxProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { address, chainId } = useAccount();
  const [page, setPage] = useState(0);
  const [load, setLoad] = useState(false);
  const handlePaging = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    setLoad(true);
    if (page == 0) setPage(1);
    async function getHistory() {
      if (address === undefined || chainId === undefined) return;
      const historyData = await getERC20TokenHistory(address, chainId, page);
      console.log(historyData);
      if (historyData != undefined && historyData.status == 1 && page > 0) {
        setTransactions((currentTransactions) => [
          ...currentTransactions,
          ...historyData.result,
        ]);
        setLoad(false);
      }
    }
    getHistory();
  }, [page]);

  return (
    <PopUp prompt="Transaction History" setValue={setOpen}>
      {transactions.length > 0 ? (
        <>
          <ul className="space-y-4 h-full w-full overflow-scroll">
            {transactions.map((trnx) => (
              <ThemeWrapper key={trnx.hash}>
                <li className="mt-2 w-full">
                  <TransactionDetails
                    hash={trnx.hash}
                    date={trnx.timeStamp}
                    symbol={trnx.tokenSymbol}
                    amount={formatBalance({
                      balance: BigInt(trnx.value).toString(),
                      decimals: parseInt(trnx.tokenDecimal),
                    })}
                    sender={trimAddress(address === undefined ? "" : address)}
                    receiver={trimAddress(trnx.to)}
                  />
                </li>
              </ThemeWrapper>
            ))}
          </ul>
          <StandardButton prompt="Show More" handleClick={handlePaging} />
        </>
      ) : (
        <p className="w-full">
          {load ? (
            <>
              <Loader />
            </>
          ) : (
            "No transactions."
          )}
        </p>
      )}
    </PopUp>
  );
};

export default HistoryTrnx;
