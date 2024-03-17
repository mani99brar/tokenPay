import TokenActions from "./TokenActions";
import StandardButton from "./StandardButton";
import StandardInput from "./StandardInput";
import { useEffect, useState } from "react";
import { useGlobalState } from "@/utils/StateContext";
import { ethers } from "ethers";
import { parseTokenAmount, encodeMethodCall } from "@/utils/helpers/allHelpers";
import {
  useWriteContract,
  BaseErrorType,
  useEstimateGas,
  useGasPrice,
  useBalance,
  useAccount,
} from "wagmi";
import abi from "@/utils/abi/ERC20.json";
import TransactionStatus from "./TransactionStatus";
import HistoryTrnx from "./HistoryTrnx";

const SendBox = () => {
  const { selectedToken } = useGlobalState();
  const { writeContract, data, status, error } = useWriteContract();
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [sendMesasge, setSendMessage] = useState<string>("Enter Inputs");
  const [isRecieverValid, setIsRecieverValid] = useState<boolean>(false);
  const [isAmountValid, setIsAmountValid] = useState<boolean>(false);
  const [isTrnxActive, setIsTrnxActive] = useState<boolean>(false);
  const [trnxPrompt, setTrnxPrompt] = useState<string>("");
  const [encodedData, setEncodeData] = useState<string>("");
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const { address, chainId } = useAccount();
  const { data: userBalance } = useBalance({
    address,
  });
  const { data: gasEstimateData, refetch: refetchGas } = useEstimateGas({
    data: encodedData as `0x${string}`,
    to: selectedToken?.address as `0x${string}`,
  });
  const { data: gasPrice, refetch: refetchGasPrice } = useGasPrice();
  useEffect(() => {
    refetchGas();
    refetchGasPrice();
    if (
      tokenAmount != "" &&
      selectedToken?.userBalance != undefined &&
      parseFloat(tokenAmount) > 0
    ) {
      console.log("In Send Box", tokenAmount, selectedToken?.userBalance);
      if (
        parseFloat(parseTokenAmount(tokenAmount, selectedToken?.decimals)) <=
        parseFloat(selectedToken?.userBalance)
      ) {
        setIsAmountValid(true);
        if (isRecieverValid) setSendMessage("Send Tokens");
        else if (receiverAddress == "") setSendMessage("Enter Receiver");
      } else {
        setIsAmountValid(false);
        setSendMessage("Insufficient Token Balance");
      }
    } else {
      setIsAmountValid(false);
      setSendMessage("Enter Amount");
    }

    if (receiverAddress != "") {
      if (ethers.isAddress(receiverAddress)) {
        setIsRecieverValid(true);
        if (isAmountValid) setSendMessage("Send Tokens");
        else if (tokenAmount == "") setSendMessage("Enter Amount");
      } else if (receiverAddress != "") {
        setIsRecieverValid(false);
        setSendMessage("Invalid Receiver");
      }
    } else {
      setIsRecieverValid(false);
      if (receiverAddress == "" && tokenAmount != "") {
        setSendMessage("Enter Receiver");
      } else {
        setSendMessage("Enter Inputs");
      }
    }
    console.log(isAmountValid, isRecieverValid);
    if (isAmountValid && isRecieverValid) {
      console.log("***********************");
      const tempEncodedData = encodeMethodCall({
        receiverAddress,
        amount: parseTokenAmount(tokenAmount, selectedToken?.decimals),
      });
      setEncodeData(tempEncodedData);
      console.log(encodedData, "Encoded Data");
    }

    if (
      gasEstimateData != undefined &&
      gasPrice != undefined &&
      userBalance != undefined &&
      tokenAmount != "0" &&
      tokenAmount != ""
    ) {
      const totalGasCost = gasEstimateData * gasPrice;
      if (totalGasCost > userBalance.value) {
        setSendMessage("Insufficient Balance to pay gas");
        setIsAmountValid(false);
        return;
      }
      console.log(totalGasCost, "Total Gas Cost");
    }
  }, [
    tokenAmount,
    selectedToken,
    receiverAddress,
    encodedData,
    gasEstimateData,
    gasPrice,
  ]);

  const sendTokens = () => {
    writeContract({
      abi,
      address: selectedToken?.address as `0x${string}`,
      functionName: "transfer",
      args: [
        receiverAddress,
        parseTokenAmount(tokenAmount, selectedToken?.decimals),
      ],
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
    } else if (status === "success") {
      const transactionDetails = {
        hash: data,
        date: new Date().toISOString(),
        chainId,
      };
      const existingTransactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
      );
      existingTransactions.push(transactionDetails);
      localStorage.setItem(
        "transactions",
        JSON.stringify(existingTransactions)
      );
      const channel = new BroadcastChannel("transaction_channel");
      channel.postMessage(transactionDetails);
      channel.close();
      setTrnxPrompt("");
    }
  }, [status]);

  useEffect(() => {
    const channel = new BroadcastChannel("transaction_channel");
    channel.onmessage = (event) => {
      console.log("Received", event.data);
      // trnx hash to trnx popup
      setIsTrnxActive(true);
    };
    return () => channel.close();
  }, []);

  return (
    <div className="flex space-x-2">
      <div className="w-3/4 bg-white rounded-lg flex flex-col space-y-2 p-2">
        {isTrnxActive && (
          <TransactionStatus
            transactionHash={data}
            setTrnx={setIsTrnxActive}
            trnxPrompt={trnxPrompt}
          />
        )}
        <div className="w-full bg-white rounded-lg p-4 flex justify-between border-4 border-[#8612F1]">
          <div className="w-3/6 flex flex-col text-[#8612F1] text-2xl">
            <StandardInput
              placeholder="0"
              label="Token Amount"
              value={tokenAmount}
              setValue={setTokenAmount}
              type="number"
            />
          </div>
          <TokenActions />
        </div>
        <div className="w-full p-4 border-4 text-xl pb-8 border-[#8612F1] rounded-lg flex flex-col text-[#8612F1]">
          <StandardInput
            placeholder="0x0"
            label="Receiver Address"
            value={receiverAddress}
            setValue={setReceiverAddress}
            type="text"
          />
        </div>
        <StandardButton
          isDisabled={!isAmountValid || !isRecieverValid}
          handleClick={sendTokens}
          prompt={sendMesasge}
        />
      </div>
      {gasPrice != undefined && (
        <div className="w-1/4 p-2 bg-white rounded-lg flex flex-col justify-between text-[#8612F1] ">
          <div className="w-full h-full bg-white rounded-lg p-4 border-4 border-[#8612F1]">
            <p>Network Stats:</p>
            <div className="flex justify-between flex-col items-start mt-2 ">
              <p className="text-lg font-bold">
                Gas Price: {gasPrice.toString()} wei
              </p>
              <p className="text-justify mt-4">
                Gas prices are high transaction may take longer than avg.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="p-4 rounded-lg w-auto mt-4 text-white bg-[#8612F1] font-bold"
          >
            Previous Transactions
          </button>
          {showHistory && <HistoryTrnx setOpen={setShowHistory} />}
        </div>
      )}
    </div>
  );
};

export default SendBox;
