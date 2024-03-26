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
  const [estimatedSeconds, setEstimatedSeconds] = useState(0);
  const { data: userBalance } = useBalance({
    address,
  });
  const { data: gasEstimateData, refetch: refetchGas } = useEstimateGas({
    data: encodedData as `0x${string}`,
    to: selectedToken?.address as `0x${string}`,
  });
  const { data: gasPrice, refetch: refetchGasPrice } = useGasPrice();

  const fetchGasEstimate = async (chainId: number, gasPrice: bigint) => {
    let apiUrl = "";

    if (chainId === 1) {
      apiUrl = `https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${gasPrice.toString()}&apikey=QSZE953N8GXZJB91HRXG6V4XKUMRKBNAP5`;
    } else {
      apiUrl = "https://sepolia.beaconcha.in/api/v1/execution/gasnow";
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API call failed with HTTP status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching gas estimate:", error);
      return null;
    }
  };

  useEffect(() => {
    if (chainId == undefined || gasPrice == undefined) return;
    fetchGasEstimate(chainId, gasPrice).then((gasData) => {
      if (gasData) {
        if (chainId == 1) {
          setEstimatedSeconds(gasData.result);
        } else {
          if (gasPrice >= gasData.data.rapid) {
            setEstimatedSeconds(15);
          } else if (gasPrice >= gasData.data.fast) {
            setEstimatedSeconds(60);
          } else if (gasPrice >= gasData.data.standard) {
            setEstimatedSeconds(180);
          } else if (gasPrice >= gasData.data.slow) {
            setEstimatedSeconds(600);
          }
        }
      }
    });
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

  return {
    isAmountValid,
    isReceiverValid,
    sendMessage,
    gasPrice,
    estimatedSeconds,
    gasEstimateData,
  };
};

export default useFormValidation;
