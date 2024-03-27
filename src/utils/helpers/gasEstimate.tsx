import { useEffect, useState } from "react";

interface EstimatedTime {
  chainId: number | undefined;
  gasPrice: bigint | undefined;
}

const useEstimateTime = ({ chainId, gasPrice }: EstimatedTime) => {
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

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
    if (!chainId || !gasPrice) return;
    fetchGasEstimate(chainId, gasPrice).then((gasData) => {
      if (gasData) {
        if (chainId == 1) {
          setEstimatedTime(gasData.result);
        } else {
          if (gasPrice >= gasData.data.rapid) {
            setEstimatedTime(15);
          } else if (gasPrice >= gasData.data.fast) {
            setEstimatedTime(60);
          } else if (gasPrice >= gasData.data.standard) {
            setEstimatedTime(180);
          } else if (gasPrice >= gasData.data.slow) {
            setEstimatedTime(600);
          }
        }
      }
    });
  }, [gasPrice]);

  return { estimatedTime };
};

export default useEstimateTime;
