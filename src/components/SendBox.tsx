import TokenActions from "./TokenActions";
import StandardButton from "./StandardButton";
import StandardInput from "./StandardInput";
import { useEffect, useState } from "react";
import useFormValidation from "@/utils/helpers/validators";
import { useGlobalState } from "@/utils/StateContext";
import { parseTokenAmount, getThemeColors } from "@/utils/helpers/allHelpers";
import { useWriteContract, BaseErrorType, useAccount } from "wagmi";
import abi from "@/utils/abi/ERC20.json";
import TransactionStatus from "./TransactionStatus";
import HistoryTrnx from "./HistoryTrnx";
import ThemeWrapper from "./ThemeWrapper";
import {
  readTrnxHistory,
  storeTransaction,
} from "@/utils/localStorage/readAndWrite";
import { broadcastMessage } from "@/utils/helpers/browserChannel";
const SendBox = () => {
  const { selectedToken, activeTransaction, setActiveTransaction, uiTheme } =
    useGlobalState();
  const [, bgColor] = getThemeColors(uiTheme);

  const { writeContract, data, status, error } = useWriteContract();
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [isTrnxActive, setIsTrnxActive] = useState<boolean>(false);
  const [trnxPrompt, setTrnxPrompt] = useState<string>("");
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const { chainId } = useAccount();

  const {
    isAmountValid,
    isReceiverValid,
    sendMessage,
    gasPrice,
    estimatedSeconds,
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

  useEffect(() => {
    if (status === "pending") {
      setIsTrnxActive(true);
      setTrnxPrompt("Confirm transaction in your wallet");
    } else if (status === "error") {
      console.log(error);
      const desError = { error }.error?.cause as BaseErrorType;
      console.log(desError.shortMessage);
      setTrnxPrompt("Transaction failed: " + desError.shortMessage);
      setActiveTransaction(null);
    } else if (status === "success") {
      if (data == undefined || chainId == undefined) return;
      const transactionDetails = {
        hash: data,
        isPending: true,
        chainId,
      };
      //Make types same
      setActiveTransaction({
        hash: data as string,
        isPending: true,
        chainId: chainId ?? 0,
      });
      storeTransaction(transactionDetails);
      broadcastMessage({
        type: "transaction",
        hash: data as string,
        isPending: true,
        chainId: chainId,
      });
      setTrnxPrompt("");
    }
  }, [status]);

  useEffect(() => {
    if (activeTransaction != null) {
      setIsTrnxActive(true);
      return;
    }
    const existingTransactions = readTrnxHistory(chainId);
    if (existingTransactions.length > 0) {
      if (existingTransactions[0].isPending === true) {
        setActiveTransaction(existingTransactions[0]);
        setIsTrnxActive(true);
      }
    }
  }, [activeTransaction]);

  return (
    <div className="flex w-full flex-col lg:flex-row lg:space-x-2 lg:space-y-0 space-y-2">
      <div
        style={{ backgroundColor: bgColor }}
        className={`lg:w-3/5 w-full bg-[${bgColor}] rounded-lg flex flex-col space-y-2 p-2`}
      >
        {isTrnxActive && (
          <TransactionStatus
            transactionHash={activeTransaction?.hash as `0x${string}`}
            setTrnx={setIsTrnxActive}
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
                setValue={setTokenAmount}
                type="number"
              />
            </div>
            <TokenActions />
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
      </div>

      <div
        style={{ backgroundColor: bgColor }}
        className={`lg:w-2/6 w-full h-full rounded-lg flex items-center sm:items-stretch flex-col sm:flex-row lg:flex-col justify-between p-2`}
      >
        <ThemeWrapper size="fill">
          <div className="flex w-full  h-full justify-between flex-col">
            <div className="flex lg:flex-col w-full sm:flex-row  flex-col items-center justify-between">
              <p className=" w-full sm:w-1/2 sm:text-start text-center lg:w-full">
                Gas Price: <br />
                <span className="font-bold text-xl">
                  {gasPrice === undefined ? "Fetching..." : gasPrice.toString()}{" "}
                  wei
                </span>
              </p>
              <p className=" lg:mt-4 w-full sm:w-1/2 sm:text-start text-center  lg:w-full">
                Average Wait time <br />{" "}
                <span className="font-bold text-xl">
                  {estimatedSeconds != 0
                    ? "Around " +
                      (estimatedSeconds > 60
                        ? estimatedSeconds / 60 + " mins"
                        : estimatedSeconds + " secs")
                    : "Calculating..."}
                </span>
              </p>
            </div>
          </div>
        </ThemeWrapper>
        <div className="lg:w-full mt-2 ml-2 lg:ml-0 sm:mt-0 lg:mt-2 flex w-full sm:w-1/4">
          <StandardButton
            prompt="History"
            handleClick={() => setShowHistory(true)}
          />
        </div>

        {showHistory && <HistoryTrnx setOpen={setShowHistory} />}
      </div>
    </div>
  );
};

export default SendBox;
