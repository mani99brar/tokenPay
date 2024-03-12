import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  txHash: "none",
  txStatus: "none",
  txMessage: "none",
  tChain: "none",
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTrnxHash: (state, action) => {
      state.txHash = action.payload;
    },
  },
});

export const { setTrnxHash } = transactionSlice.actions;

export default transactionSlice.reducer;
