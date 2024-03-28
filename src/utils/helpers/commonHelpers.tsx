// Desc: Common helper functions used across the app

const ethers = require("ethers");
interface Balance {
  balance: string | undefined;
  decimals: number | undefined;
}

interface MethodCall {
  receiverAddress: string;
  amount: string;
}

export const themeColors: { [key: string]: [string, string, string] } = {
  "Purple Hollow": ["#8612F1", "#fff", "purpleHollow"],
  "White Hollow": ["#fff", "#8612F1", "whiteHollow"],
  "White Solid": ["#fff", "#000", "whiteSolid"],
  "Black Solid": ["#000", "#fff", "blackSolid"],
};

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

function formatBalance({ balance, decimals }: Balance) {
  if (decimals === undefined || balance === undefined || balance == "")
    return "";
  try {
    let formattedBalance = ethers.formatUnits(balance, decimals);
    if (formattedBalance.length > 10)
      return parseFloat(formattedBalance).toExponential(1);
    return parseFloat(formattedBalance).toString();
  } catch (error) {
    console.error("Error formatting balance:", error);
    return "";
  }
}

function parseTokenAmount(
  amount: string | undefined,
  decimals: number | undefined
) {
  if (amount === undefined || decimals === undefined) {
    console.error("Decimals are undefined");
    return "";
  }
  try {
    const parsedAmount = ethers.parseUnits(amount.toString(), decimals);
    console.log(parsedAmount);
    return parsedAmount.toString();
  } catch (error) {
    console.error("Error parsing token amount:", error);
    return "";
  }
}

function encodeMethodCall({ receiverAddress, amount }: MethodCall) {
  if (amount === "") return "";
  if (!ethers.isAddress(receiverAddress)) return "";
  const iface = new ethers.Interface([
    "function transfer(address to, uint256 value) external returns (bool)",
  ]);
  const data = iface.encodeFunctionData("transfer", [receiverAddress, amount]);
  return data;
}

const trimAddress = (address: string) => {
  const start = address.slice(0, 7); // Get the first 5 characters (including '0x')
  const end = address.slice(-5); // Get the last 3 characters
  return `${start}....${end}`; // Combine them with ellipses in the middle
};

function getThemeColors(theme: string): [string, string, string] {
  const defaultColors: [string, string] = ["#000", "#FFF"];

  return themeColors[theme] || defaultColors;
}

async function getERC20TokenHistory(
  address: `0x${string}`,
  chainId: number,
  page: number
) {
  let api = "";
  if (page == 0) return;
  if (chainId === 1) {
    api = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&page=${page}&offset=10&startblock=0&endblock=27025780&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  } else if (chainId === 11155111) {
    api = `https://api-sepolia.etherscan.io/api?module=account&action=tokentx&address=${address}&page=${page}&offset=10&startblock=0&endblock=27025780&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  }
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error(`API call failed with HTTP status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching gas estimate:", error);
    return null;
  }
}

function scientificToDecimal(num: number) {
  const sign = Math.sign(num);
  // Check if the number is in scientific notation
  let strNum = num.toString();
  if (!/e/i.test(strNum)) {
    return strNum;
  }

  let [base, exponent] = strNum.split("e").map((part) => parseInt(part, 10));
  let decimalStr = base.toString();

  if (exponent > 0) {
    let decimalSplit = decimalStr.split(".");
    let wholePart = decimalSplit[0];
    let decimalPart = decimalSplit[1] || "";

    let zerosToAdd = exponent - decimalPart.length;
    for (let i = 0; i < zerosToAdd; i++) {
      decimalPart += "0";
    }
    decimalStr = wholePart + decimalPart;
  } else {
    // For negative exponent, the approach would be different, focusing on adding zeros before the number
    let zerosToAdd = Math.abs(exponent) - 1; // -1 because the dot moves
    let zeroString = "0.".padEnd(zerosToAdd + 2, "0"); // +2 for '0.' prefix
    decimalStr = zeroString + base.toString().replace("-", "");
  }

  return sign < 0 ? "-" + decimalStr : decimalStr;
}

export {
  getThemeColors,
  parseTokenAmount,
  formatBalance,
  encodeMethodCall,
  trimAddress,
  getERC20TokenHistory,
  scientificToDecimal,
};
