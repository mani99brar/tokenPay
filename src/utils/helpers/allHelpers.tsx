const ethers = require("ethers");
interface Balance {
  balance: string | undefined;
  decimals: number | undefined;
}

function formatBalance({ balance, decimals }: Balance) {
  if (decimals === undefined || balance === undefined) return "";

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
    // Use ethers to parse the amount
    const parsedAmount = ethers.parseUnits(amount.toString(), decimals);
    return parsedAmount.toString();
  } catch (error) {
    console.error("Error parsing token amount:", error);
    return ""; // Return an empty string in case of any error
  }
}

interface MethodCall {
  receiverAddress: string;
  amount: string;
}

function encodeMethodCall({ receiverAddress, amount }: MethodCall) {
  if (amount === "") return "";
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
    // "Black Hollow": ["#000", "#8612F1"],
    // "Purple Solid": ["#8612F1", "#000"],
    "White Solid": ["#fff", "#000", "whiteSolid"],
    "Black Solid": ["#000", "#fff", "blackSolid"],
  };

  const defaultColors: [string, string] = ["#000", "#FFF"];

  return themeColors[theme] || defaultColors;
}

export {
  getThemeColors,
  parseTokenAmount,
  formatBalance,
  encodeMethodCall,
  trimAddress,
};
