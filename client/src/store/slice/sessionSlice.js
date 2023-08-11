import { createSlice, createAction } from "@reduxjs/toolkit";

import { getSessionItem } from "../../utils/storageHelper";

const initialState = {
  token: getSessionItem("token"),
  errors: {},
  data: {},
  showLoginToast: false,
  showLogoutToast: false,
  showSignUpToast: false,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    updateLogin: (state, action) => {
      state.token = action.payload.token;
      state.data = {};
      state.showLoginToast = true;
    },
    updateLogOut: (state, action) => {
      state.token = undefined;
      state.showLogoutToast = true;
    },
    updateSignUp: (state, action) => {
      state.data = action.payload;
      state.showSignUpToast = true;
    },
    updateSignUpToast: (state, action) => {
      state.showSignUpToast = action.payload;
    },
    updateErrorSession: (state, action) => {
      state.errors = action.payload.errors;
    },
  },
});

export const signIn = createAction("SIGN_IN");
export const signUp = createAction("SIGN_UP");
export const signOut = createAction("SIGN_OUT");

export const { updateLogin, updateLogOut, updateSignUp, updateErrorSession } =
  sessionSlice.actions;

export const selectTokenLogin = (state) => state.session.token || null;

export const selectErrorSession = (state) => state.session.errors || {};

export const selectShowLoginToast = (state) =>
  state.session.showLoginToast || false;

export const selectShowLogoutToast = (state) =>
  state.session.showLogoutToast || false;

export const selectShowSignUpToast = (state) =>
  state.session.showSignUpToast || false;

export const selectDataSession = (state) => state.session.data || {};

export default sessionSlice.reducer;
