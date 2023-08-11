import httpSaga from "./httpSaga";

import { call, put, takeEvery, all } from "redux-saga/effects";

import { setSessionItem, removeSessionItem } from "../../utils/storageHelper";

import {
  signIn,
  signUp,
  signOut,
  updateLogin,
  updateSignUp,
  updateLogOut,
  updateErrorSession,
} from "../slice/sessionSlice";
import API from "../../configs/Api";

function* handleSignIn(action) {
  const email = action && action.payload ? action.payload.email : null;
  const password = action && action.payload ? action.payload.password : null;
  yield httpSaga({
    api: API.LOG_IN,
    data: {
      email,
      password,
    },
    onSuccess: function* successResponse(responseData, response) {
      setSessionItem("token", responseData.token);
      yield put(updateLogin(responseData));
      yield call(action.payload.setSubmitting(false));
    },
    onError: function* errorResponse(responseData, response) {
      yield put(updateErrorSession(responseData));
      yield call(action.payload.setSubmitting(false));
    },
  });
}

function* handleSignUp(action) {
  const email = action && action.payload ? action.payload.email : null;
  const password = action && action.payload ? action.payload.password : null;
  yield httpSaga({
    api: API.REGISTRATION,
    data: {
      email,
      password,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(updateSignUp(responseData));
      yield call(action.payload.setSubmitting(false));
    },
    onError: function* errorResponse(responseData, response) {
      yield put(updateErrorSession(responseData));
      yield call(action.payload.setSubmitting(false));
    },
  });
}

function* handleSignOut() {
  yield httpSaga({
    api: API.LOG_OUT,
    onSuccess: function* successResponse(responseData, response) {
      removeSessionItem("token");
      yield put(updateLogOut(responseData));
    },
    onError: function* errorResponse(responseData, response) {
      yield put(updateErrorSession(responseData));
    },
  });
}

export default function* sessionSaga() {
  yield all([
    takeEvery(signIn, handleSignIn),
    takeEvery(signUp, handleSignUp),
    takeEvery(signOut, handleSignOut),
  ]);
}
