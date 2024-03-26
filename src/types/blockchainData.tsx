type Transaction = {
  hash: `0x${string}`;
  isPending: boolean;
  chainId: number;
};

type Token = {
  name: string;
  symbol: string;
  decimals: number;
  image?: string;
  chainId: number;
  address: string;
  userBalance?: string;
};


export type { Transaction, Token };
