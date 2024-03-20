import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import SingleTrnx from "./SingleTrnx";
import PopUp from "./PopUp";
import {
  updateTrnxStatus,
  updateTrnxHash,
} from "@/utils/localStorage/readAndWrite";
import ThemeWrapper from "./ThemeWrapper";
interface Transaction {
  transactionHash: `0x${string}` | undefined;
  setTrnx: (trnx: boolean) => void;
  trnxPrompt: string;
}

const TransactionStatus = ({
  transactionHash,
  setTrnx,
  trnxPrompt,
}: Transaction) => {
  const { data, isError, isLoading } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });
  const [statusMessage, setStatusMessage] = useState(
    "Waiting for transaction..."
  );

  useEffect(() => {
    if (isLoading) {
      setStatusMessage("Waiting for transaction to confirm...");
    } else if (isError) {
      setStatusMessage("Transaction failed.");
    } else if (data) {
      if (transactionHash) updateTrnxStatus(transactionHash, "success");
      setStatusMessage("Transaction succeeded!");
    }
  }, [transactionHash, data, isError, isLoading]);

  return (
    <PopUp prompt="Transaction Status" setValue={setTrnx}>
      <div className="w-full h-full flex flex-col p-4">
        {trnxPrompt != "" ? (
          <div className="h-full flex flex-col items-center">
            <ThemeWrapper>
              <p className="h-full rounded-lg text-2xl font-bold">
                {trnxPrompt}
              </p>
            </ThemeWrapper>
          </div>
        ) : (
          <ThemeWrapper>
            <div className="flex flex-col mb-4 space-y-4">
              <p className="text-2xl font-bold">{statusMessage}</p>
              {transactionHash != undefined && (
                <ThemeWrapper>
                  <SingleTrnx hash={transactionHash} />
                </ThemeWrapper>
              )}
            </div>
          </ThemeWrapper>
        )}
      </div>
    </PopUp>
  );
};

export default TransactionStatus;
