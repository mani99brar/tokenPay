import { configureStore } from "@reduxjs/toolkit";
import setTrnx from "@/utils/updateState";

export const store = configureStore({
  reducer: {
    trnx: setTrnx,
  },
});
