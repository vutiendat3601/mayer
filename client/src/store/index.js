import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

// Slice i18n
import i18nReducer from "./slice/i18nSlice";

// Slice type
import typeReducer from "./slice/typeSlice";

// Slice session 
import sessionReducer from "./slice/sessionSlice";

// Slice project
import projectReducer from "./slice/projectSlice";

// Slice schema
import schemaReducer from "./slice/schemaSlice";

// Slice field
import fieldReducer from "./slice/fieldSlice";

// Saga
import rootSaga from "./saga/rootSaga";

let sagaMiddleware = createSagaMiddleware();
const middleware = [
  ...getDefaultMiddleware({ thunk: true, serializableCheck: false }),
  sagaMiddleware,
];

const store = configureStore({
  reducer: {
    i18n: i18nReducer,
    type: typeReducer,
    // session
    session: sessionReducer,
    // project
    project: projectReducer,
    // schema
    schema: schemaReducer,
    // field
    field: fieldReducer,
  },
  middleware,
});

sagaMiddleware.run(rootSaga);

export default store;
