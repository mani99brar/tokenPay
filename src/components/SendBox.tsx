import TokenActions from "./TokenActions";
import StandardButton from "./StandardButton";
import StandardInput from "./StandardInput";
import { useEffect, useState } from "react";
import { useGlobalState } from "@/utils/StateContext";
import { ethers } from "ethers";
import {
  parseTokenAmount,
  encodeMethodCall,
  getThemeColors,
} from "@/utils/helpers/allHelpers";
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
import ThemeWrapper from "./ThemeWrapper";
import {
  readTrnxHistory,
  storeTransaction,
} from "@/utils/localStorage/readAndWrite";
const SendBox = () => {
  const { selectedToken, lastTransaction, setLastTransaction, uiTheme } =
    useGlobalState();
  const [textColor, bgColor] = getThemeColors(uiTheme);

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
    if (selectedToken == null) {
      setSendMessage("Select Token");
      return;
    }
    refetchGas();
    refetchGasPrice();
    if (
      tokenAmount != "" &&
      selectedToken?.userBalance != undefined &&
      parseFloat(tokenAmount) > 0
    ) {
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
    }
  }, [
    tokenAmount,
    selectedToken,
    receiverAddress,
    encodedData,
    gasEstimateData,
    gasPrice,
    lastTransaction,
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
      setLastTransaction(null);
    } else if (status === "success") {
      if (data == undefined || chainId == undefined) return;
      const transactionDetails = {
        hash: data,
        isPending: true,
        chainId,
      };
      console.log("Signed", transactionDetails);
      //Make types same
      setLastTransaction({
        hash: data as string,
        isPending: true,
        chainId: chainId ?? 0,
      });
      storeTransaction(transactionDetails);
      const channel = new BroadcastChannel("transaction_channel");
      channel.postMessage(transactionDetails);
      channel.close();
      setTrnxPrompt("");
    }
  }, [status]);

  useEffect(() => {
    const existingTransactions = readTrnxHistory(chainId);
    if (existingTransactions.length > 0) {
      if (existingTransactions[0].isPending === true) {
        setLastTransaction(existingTransactions[0]);
        setIsTrnxActive(true);
      }
    }
    const channel = new BroadcastChannel("transaction_channel");
    channel.onmessage = (event) => {
      if (event.data === undefined) return;
      setLastTransaction({
        hash: event.data.hash,
        isPending: true,
        chainId: chainId ?? 0,
      });
      setIsTrnxActive(true);
    };
    return () => channel.close();
  }, []);

  return (
    <div className="flex w-full space-x-2">
      <div
        style={{ backgroundColor: bgColor }}
        className={`w-3/4 bg-[${bgColor}] rounded-lg flex flex-col space-y-2 p-2`}
      >
        {isTrnxActive && (
          <TransactionStatus
            transactionHash={lastTransaction?.hash as `0x${string}`}
            setTrnx={setIsTrnxActive}
            trnxPrompt={trnxPrompt}
          />
        )}
        <ThemeWrapper>
          <>
            <div className="w-3/6 flex flex-col text-2xl">
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
          isDisabled={!isAmountValid || !isRecieverValid}
          handleClick={sendTokens}
          prompt={sendMesasge}
        />
      </div>
      {gasPrice != undefined && (
        <div
          style={{ backgroundColor: bgColor }}
          className={`w-1/4  rounded-lg flex flex-col justify-between p-2`}
        >
          <ThemeWrapper>
            <div className="flex flex-col">
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
          </ThemeWrapper>
          <StandardButton
            prompt="Previous Transactions"
            handleClick={() => setShowHistory(true)}
          />
          {showHistory && <HistoryTrnx setOpen={setShowHistory} />}
        </div>
      )}
    </div>
  );
};

export default SendBox;
