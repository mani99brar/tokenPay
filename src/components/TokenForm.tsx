import ThemeWrapper from "./ThemeWrapper";
import StandardButton from "./StandardButton";
import StandardInput from "./StandardInput";
import { useWriteContract, BaseErrorType, useAccount } from "wagmi";
import { useState, useEffect, memo } from "react";
import useFormValidation from "@/utils/helpers/validators";
import { useGlobalState } from "@/utils/StateContext";
import abi from "@/utils/abi/ERC20.json";
import { parseTokenAmount } from "@/utils/helpers/commonHelpers";
import TokenActions from "./TokenActions";
import TransactionStatus from "./TransactionStatus";
import { broadcastMessage } from "@/utils/helpers/browserChannel";
import { storeTransaction } from "@/utils/localStorage/readAndWrite";

interface TokenFormProps {
  setGasPrice: (price: bigint) => void;
}

const TokenActionsMemoized = memo(TokenActions);

const TokenForm = ({ setGasPrice }: TokenFormProps) => {
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const {
    selectedToken,
    setActiveTransaction,
    activeTransaction,
    setActiveTransactionState,
  } = useGlobalState();
  const { writeContract, data, status, error } = useWriteContract();
  const { chainId } = useAccount();
  const [trnxPrompt, setTrnxPrompt] = useState<string>("");

  const {
    isAmountValid,
    isReceiverValid,
    sendMessage,
    gasPrice,
    gasEstimateData,
  } = useFormValidation({ selectedToken, tokenAmount, receiverAddress });
  const sendTokens = () => {
    writeContract({
      abi,
      address: selectedToken?.address as `0x${string}`,
      functionName: "transfer",
      args: [
        receiverAddress,
        parseTokenAmount(tokenAmount, selectedToken?.decimals),
      ],
      gas: gasEstimateData,
    });
  };
  const checkAndSetTokenAmount = (amount: string) => {
    if (parseFloat(amount) < 0) return;
    setTokenAmount(amount);
  };

  useEffect(() => {
    if (status === "pending") {
      setActiveTransactionState(true);
      setTrnxPrompt("Confirm transaction in your wallet");
    } else if (status === "error") {
      console.log(error);
      const desError = { error }.error?.cause as BaseErrorType;
      console.log(desError.shortMessage);
      setTrnxPrompt("Transaction failed: " + desError.shortMessage);
      setActiveTransaction(null);
    } else if (status === "success") {
      if (!activeTransaction?.isActive) setActiveTransactionState(true);
      if (data == undefined || chainId == undefined) return;
      const transactionDetails = {
        hash: data,
        isPending: true,
        chainId,
      };
      setActiveTransaction({
        hash: data as `0x${string}`,
        isPending: true,
        chainId: chainId ?? 0,
        isActive: true,
      });
      storeTransaction(transactionDetails);
      broadcastMessage({
        type: "transaction",
        hash: data as `0x${string}`,
        isPending: true,
        chainId: chainId,
      });
      setTrnxPrompt("");
    }
  }, [status]);

  useEffect(() => {
    if (gasPrice) setGasPrice(gasPrice);
  }, [gasPrice]);
  return (
    <>
      {activeTransaction?.isActive && (
        <TransactionStatus
          transactionHash={activeTransaction?.hash as `0x${string}`}
          trnxPrompt={trnxPrompt}
        />
      )}
      <ThemeWrapper>
        <>
          <div className="w-3/5 flex flex-col text-2xl">
            <StandardInput
              placeholder="0"
              label="Token Amount"
              value={tokenAmount}
              setValue={checkAndSetTokenAmount}
              type="number"
              min={0}
            />
          </div>
          <TokenActionsMemoized />
        </>
      </ThemeWrapper>
      <ThemeWrapper>
        <div className="w-full flex flex-col text-2xl">
          <StandardInput
            placeholder="0x0"
            label="Receiver Address"
            value={receiverAddress}
            setValue={setReceiverAddress}
            type="text"
          />
        </div>
      </ThemeWrapper>
      <StandardButton
        isDisabled={!isAmountValid || !isReceiverValid}
        handleClick={sendTokens}
        prompt={sendMessage}
      />
    </>
  );
};

export default TokenForm;
