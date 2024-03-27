type Transaction = {
  hash: `0x${string}` | null;
  isPending: boolean | null;
  chainId: number | null;
  isActive?: boolean;
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
