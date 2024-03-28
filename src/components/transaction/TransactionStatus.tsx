// Desc: TransactionStatus component that displays transaction status
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import { updateTrnxLocalStatus } from "@/utils/localStorage/readAndWrite";
import { useGlobalState } from "@/utils/StateContext";
import { getTokenData } from "@/utils/getTokenData/readContract";
import { formatBalance, trimAddress } from "@/utils/helpers/commonHelpers";
import Loader from "../common/Loader";
import ThemeWrapper from "../layout/ThemeWrapper";
import PopUp from "../PopUp";
import TransactionDetails from "./TransactionDetails";
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
  const { address } = useAccount();
  const token = getTokenData(data?.to as string, address);

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
        <ThemeWrapper size="fill">
          {trnxPrompt != "" ? (
            <div className="h-full flex w-full flex-col space-y-4 items-center">
              <p className="h-full w-full rounded-lg text-xl font-bold">
                {trnxPrompt}
              </p>
            </div>
          ) : (
            <div className="flex flex-col w-full space-y-4">
              <p className="text-xl font-bold">{statusMessage}</p>

              {transactionHash != undefined &&
                (data != undefined ? (
                  data?.logs.length != 0 ? (
                    <ThemeWrapper size="fill">
                      <TransactionDetails
                        hash={data.transactionHash}
                        symbol={token?.token?.symbol}
                        amount={formatBalance({
                          balance: BigInt(data.logs[0].data).toString(),
                          decimals: token?.token?.decimals,
                        })}
                        sender={trimAddress(
                          `0x${data.logs[0].topics[1]?.slice(-40)}`
                        )}
                        receiver={trimAddress(
                          `0x${data.logs[0].topics[2]?.slice(-40)}`
                        )}
                      />
                    </ThemeWrapper>
                  ) : (
                    <ThemeWrapper size="fill">
                      <p>Token payment was cancelled.</p>
                    </ThemeWrapper>
                  )
                ) : (
                  <div className="w-full h-full">
                    <Loader />
                  </div>
                ))}
            </div>
          )}
        </ThemeWrapper>
      </div>
    </PopUp>
  );
};

export default TransactionStatus;
