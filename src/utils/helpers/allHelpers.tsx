const ethers = require("ethers");
interface Balance {
  balance: string | undefined;
  decimals: number | undefined;
}

function formatBalance({ balance, decimals }: Balance) {
  if (decimals === undefined || balance === undefined) return "";

  try {
    // Use ethers to format the balance
    let formattedBalance = ethers.formatUnits(balance, decimals);

    // For large numbers, use abbreviations
    const suffixes = ["", "K", "M", "B", "T"];
    let suffixIndex = 0;
    let abbreviatedBalance = parseFloat(formattedBalance);

    while (abbreviatedBalance >= 1000 && suffixIndex < suffixes.length - 1) {
      abbreviatedBalance /= 1000;
      suffixIndex++;
    }

    if (suffixIndex > 0) {
      let abbreviatedFormatted = abbreviatedBalance.toFixed(3);
      abbreviatedFormatted = parseFloat(abbreviatedFormatted).toString(); // Remove trailing zeros
      return `${abbreviatedFormatted}${suffixes[suffixIndex]}`;
    }

    return parseFloat(formattedBalance).toString(); // Remove trailing zeros if any
  } catch (error) {
    console.error("Error formatting balance:", error);
    return ""; // Return an empty string in case of any error
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
    console.log(parsedAmount.toString());
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

interface TransactionStatus {
  transactionHash: `0x${string}` | undefined;
  newStatus: string;
}

interface Transaction {
  hash: string;
  isPending: boolean;
  chainId: number;
}

const updateTransactionStatus = ({
  transactionHash,
  newStatus,
}: TransactionStatus) => {
  // Retrieve the existing transactions from localStorage
  const existingTransactions = JSON.parse(
    localStorage.getItem("transactions") || "[]"
  );

  // Find the transaction to update
  const transactionIndex = existingTransactions.findIndex(
    (transaction: Transaction) => transaction.hash === transactionHash
  );

  if (transactionIndex !== -1) {
    // Update the isPending status of the found transaction
    existingTransactions[transactionIndex].isPending = newStatus;

    // Persist the updated transactions array back to localStorage
    localStorage.setItem("transactions", JSON.stringify(existingTransactions));
  } else {
    console.log("Transaction not found");
  }
};

export {
  parseTokenAmount,
  formatBalance,
  encodeMethodCall,
  trimAddress,
  updateTransactionStatus,
};
