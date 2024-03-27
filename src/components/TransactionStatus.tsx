import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import SingleTrnx from "./SingleTrnx";
import PopUp from "./PopUp";
import { updateTrnxLocalStatus } from "@/utils/localStorage/readAndWrite";
import ThemeWrapper from "./ThemeWrapper";
import { useGlobalState } from "@/utils/StateContext";

interface TransactionProps {
  transactionHash: `0x${string}` | undefined;
  trnxPrompt: string;
}

const TransactionStatus = ({
  transactionHash,
  trnxPrompt,
}: TransactionProps) => {
  const { data, isError, isLoading } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });
  const [statusMessage, setStatusMessage] = useState(
    "Waiting for transaction..."
  );
  const { updateActiveTransactionStatus, setActiveTransactionState } =
    useGlobalState();

  useEffect(() => {
    if (isLoading) {
      setStatusMessage("Waiting for transaction to confirm...");
    } else if (isError) {
      setStatusMessage("Transaction failed.");
    } else if (data) {
      if (transactionHash && data.status === "success") {
        updateActiveTransactionStatus();
        updateTrnxLocalStatus(transactionHash, false);
      }
      setStatusMessage("Transaction succeeded!");
    }
  }, [transactionHash, data, isError, isLoading]);
  return (
    <PopUp
      prompt="Transaction Status"
      setValue={() => setActiveTransactionState(false)}
    >
      <div className="w-full h-full flex flex-col p-4">
        {trnxPrompt != "" ? (
          <div className="h-full flex w-full flex-col space-y-4 items-center">
            <ThemeWrapper size="fill">
              <p className="h-full rounded-lg text-2xl font-bold">
                {trnxPrompt}
              </p>
            </ThemeWrapper>
          </div>
        ) : (
          <ThemeWrapper size="fill">
            <div className="flex flex-col w-full space-y-4">
              <p className="text-2xl font-bold">{statusMessage}</p>
              {transactionHash != undefined && (
                <SingleTrnx hash={transactionHash} />
              )}
            </div>
          </ThemeWrapper>
        )}
      </div>
    </PopUp>
  );
};

export default TransactionStatus;
