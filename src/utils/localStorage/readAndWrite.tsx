// Desc: Utility functions for reading and writing to local storage
import { Transaction } from "@/types/blockchainData";

function storeTransaction(transaction: Transaction) {
  const existingTransactions = [transaction];
  localStorage.setItem("transactions", JSON.stringify(existingTransactions));
}

function updateTrnxHash(
  transactionHash: `0x${string}`,
  newHash: `0x${string}`
) {
  const transactions: Transaction[] = JSON.parse(
    localStorage.getItem("transactions") || "[]"
  );

  const transactionIndex = transactions.findIndex(
    (transaction) => transaction.hash === transactionHash
  );
  if (transactionIndex !== -1) {
    transactions[transactionIndex].hash = newHash;
    localStorage.setItem("transactions", JSON.stringify(transactions));
  } else {
    console.error("Transaction with the specified hash was not found.");
  }
}

function updateTrnxLocalStatus(
  transactionHash: `0x${string}`,
  newStatus: boolean
) {
  const existingTransactions = JSON.parse(
    localStorage.getItem("transactions") || "[]"
  );

  const transactionIndex = existingTransactions.findIndex(
    (transaction: Transaction) => transaction.hash === transactionHash
  );

  if (transactionIndex !== -1) {
    existingTransactions[transactionIndex].isPending = newStatus;
    localStorage.setItem("transactions", JSON.stringify(existingTransactions));
  } else {
    console.log("Transaction not found");
  }
}

function readTrnxHistory(chainId: number | undefined) {
  if (chainId === undefined) [];
  const storedTransactions = localStorage.getItem("transactions");
  if (storedTransactions) {
    const allTransactions = JSON.parse(storedTransactions);
    const filteredTransactions = allTransactions.filter(
      (trnx: Transaction) => trnx.chainId === chainId
    );
    if (filteredTransactions === undefined) return [];
    return filteredTransactions.reverse();
  } else return [];
}

function deleteTrnxHistory(chainId: number | undefined) {
  if (chainId === undefined) {
    console.error("No chainId provided for deleting transactions.");
    return;
  }
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  const updatedTransactions = transactions.filter(
    (transaction: Transaction) => transaction.chainId !== chainId
  );
  localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
}

function storeOrUpdateTheme(theme: string) {
  localStorage.setItem("theme", theme);
}

function readTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === undefined || theme === null) return "Purple Hollow";
  return theme;
}

export {
  storeTransaction,
  updateTrnxHash,
  updateTrnxLocalStatus,
  readTrnxHistory,
  deleteTrnxHistory,
  storeOrUpdateTheme,
  readTheme,
};
