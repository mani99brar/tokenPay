import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import PopUp from "./PopUp";
interface Transaction {
  transactionHash: `0x${string}` | undefined;
  setTrnx: (trnx: boolean) => void;
}

const TransactionStatus = ({ transactionHash, setTrnx }: Transaction) => {
  const { data, isError, isLoading } = useWaitForTransactionReceipt({
    hash: transactionHash,
    onReplaced: (replacement) => console.log(replacement, "Sped up"),
  });

  const [statusMessage, setStatusMessage] = useState(
    "Waiting for transaction..."
  );

  useEffect(() => {
    if (isLoading) {
      setStatusMessage("Transaction is pending...");
    } else if (isError) {
      setStatusMessage("Transaction failed.");
    } else if (data) {
      console.log(data);
      setStatusMessage("Transaction succeeded!");
    }
  }, [transactionHash, data, isError, isLoading]);

  return (
    <PopUp prompt="Transaction details" setValue={setTrnx}>
      <p>{statusMessage}</p>
    </PopUp>
  );
};

export default TransactionStatus;
