const ethers = require("ethers");
interface Balance {
  balance: string | undefined;
  decimals: number | undefined;
}

function formatBalance({ balance, decimals }: Balance) {
  if (decimals === undefined || balance === undefined || balance == "")
    return "";
  try {
    let formattedBalance = ethers.formatUnits(balance, decimals);
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
    return parsedAmount.toString();
  } catch (error) {
    console.error("Error parsing token amount:", error);
    return "";
  }
}

interface MethodCall {
  receiverAddress: string;
  amount: string;
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
  const themeColors: { [key: string]: [string, string, string] } = {
    "Purple Hollow": ["#8612F1", "#fff", "purpleHollow"],
    "White Hollow": ["#fff", "#8612F1", "whiteHollow"],
    "White Solid": ["#fff", "#000", "whiteSolid"],
    "Black Solid": ["#000", "#fff", "blackSolid"],
  };

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
    api = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&page=${page}&offset=10&startblock=0&endblock=27025780&sort=desc&apikey=QSZE953N8GXZJB91HRXG6V4XKUMRKBNAP5`;
  } else if (chainId === 11155111) {
    api = `https://api-sepolia.etherscan.io/api?module=account&action=tokentx&address=${address}&page=${page}&offset=10&startblock=0&endblock=27025780&sort=desc&apikey=QSZE953N8GXZJB91HRXG6V4XKUMRKBNAP5`;
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

export {
  getThemeColors,
  parseTokenAmount,
  formatBalance,
  encodeMethodCall,
  trimAddress,
  getERC20TokenHistory,
};
