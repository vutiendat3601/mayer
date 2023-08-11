import { all } from "redux-saga/effects";

import projectSaga from "./projectSaga";
import schemaSaga from "./schemaSaga";
import fieldSaga from "./fieldSaga";
import sessionSaga from "./sessionSaga";

export default function* rootSaga() {
  yield all([sessionSaga(), projectSaga(), schemaSaga(), fieldSaga()]);
}
