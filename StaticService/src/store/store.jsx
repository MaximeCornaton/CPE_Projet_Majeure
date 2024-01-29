import { configureStore } from "@reduxjs/toolkit";
import { userReducer, backendReducer, fightReducer } from "../reducers";

const store = configureStore({
  reducer: {
    user: userReducer,
    backend: backendReducer,
    fight: fightReducer,
  },
});

export default store;
