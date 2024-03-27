import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Token } from "@/types/blockchainData";
import { useEstimateGas, useGasPrice, useBalance, useAccount } from "wagmi";
import { parseTokenAmount } from "@/utils/helpers/allHelpers";
import { encodeMethodCall } from "@/utils/helpers/allHelpers";
interface FormValidationArgs {
  selectedToken: Token | null;
  tokenAmount: string;
  receiverAddress: string;
}

const useFormValidation = ({
  selectedToken,
  tokenAmount,
  receiverAddress,
}: FormValidationArgs) => {
  const [isAmountValid, setIsAmountValid] = useState(false);
  const [isReceiverValid, setIsReceiverValid] = useState(false);
  const [sendMessage, setSendMessage] = useState("Enter Inputs");
  const { address, chainId } = useAccount();
  const [encodedData, setEncodeData] = useState("");
  const { data: userBalance } = useBalance({
    address,
  });
  const {
    data: gasEstimateData,
    refetch: refetchGas,
    isError: isErrorEstimateGas,
  } = useEstimateGas({
    data: encodedData as `0x${string}`,
    to: selectedToken?.address as `0x${string}`,
  });
  const {
    data: gasPrice,
    refetch: refetchGasPrice,
    isError: isErrorGasPriceFetch,
  } = useGasPrice();
  console.log(gasPrice, gasEstimateData);
  useEffect(() => {
    if (chainId == undefined || gasPrice == undefined) return;
    if (!selectedToken) {
      setSendMessage("Please Select Token");
      return;
    }
    if (
      tokenAmount &&
      selectedToken.userBalance !== undefined &&
      parseFloat(tokenAmount) > 0
    ) {
      const parsedAmount = parseFloat(
        parseTokenAmount(tokenAmount, selectedToken.decimals)
      );
      if (parsedAmount <= parseFloat(selectedToken.userBalance)) {
        setIsAmountValid(true);
        if (ethers.isAddress(receiverAddress)) {
          setIsReceiverValid(true);
          setSendMessage("Send Tokens");
          const tempEncodedData = encodeMethodCall({
            receiverAddress,
            amount: parseTokenAmount(tokenAmount, selectedToken.decimals),
          });
          setEncodeData(tempEncodedData);
        } else {
          setIsReceiverValid(false);
          setSendMessage(
            receiverAddress ? "Invalid Receiver" : "Enter Receiver"
          );
        }
      } else {
        setIsAmountValid(false);
        setSendMessage("Insufficient Token Balance");
      }
    } else {
      setIsAmountValid(false);
      setSendMessage("Enter Amount");
    }
    if (
      gasEstimateData &&
      gasPrice &&
      userBalance &&
      parseFloat(tokenAmount) > 0
    ) {
      const totalGasCost = gasEstimateData * gasPrice;
      if (totalGasCost > userBalance.value) {
        setSendMessage("Insufficient Balance to pay gas");
        setIsAmountValid(false);
      }
    }
  }, [
    selectedToken,
    tokenAmount,
    receiverAddress,
    userBalance,
    gasEstimateData,
    gasPrice,
  ]);

  useEffect(() => {
    if (isErrorGasPriceFetch) {
      refetchGasPrice();
    }
    if (isErrorEstimateGas) {
      refetchGas();
    }
  }, [isErrorGasPriceFetch, isErrorEstimateGas]);

  return {
    isAmountValid,
    isReceiverValid,
    sendMessage,
    gasPrice,
    gasEstimateData,
  };
};

export default useFormValidation;


