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

type TokenBalanceReturn = {
  balance:
    | { decimals: number; formatted: string; symbol: string; value: bigint }
    | undefined;
  isFetching: boolean;
  refetch: () => void;
  isRefetching: boolean;
};

export type { Transaction, Token, TokenBalanceReturn };
