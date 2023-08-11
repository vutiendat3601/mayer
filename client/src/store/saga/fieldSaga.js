import {
  call,
  put,
  select,
  takeEvery,
  all,
  takeLeading,
} from "redux-saga/effects";

import httpSaga from "./httpSaga";

import API from "../../configs/Api";

import {
  //action saga
  getFieldList,
  deleteField,
  createField,
  updateField,
  // action api
  actionGetFieldList,
  actionCreateField,
  actionDeleteField,
  actionUpdateField,
  // action select
  selectSelectedIDField,
  //orther action
  updateErrorsField,
} from "../slice/fieldSlice";

function* handleGetFieldList({ payload: { schemaId } = {} }) {
  yield httpSaga({
    api: API.GET_FIELD_LIST,
    params: {
      schema_id: schemaId,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(actionGetFieldList(responseData));
    },
    onError: function* errorResponse(responseData, response) {
      yield put(updateErrorsField);
    },
  });
}

function* handleCreateField(action) {
  const name = action && action.payload ? action.payload.name : null;
  const schema_id = action && action.payload ? action.payload.schema_id : null;
  const null_percentage =
    action && action.payload ? action.payload.null_percentage : null;
  const name_type = action && action.payload ? action.payload.name_type : null;
  const code_type = action && action.payload ? action.payload.code_type : null;
  const formula = action && action.payload ? action.payload.formula : null;
  const option_from =
    action && action.payload ? action.payload.option_from : null;
  const option_to = action && action.payload ? action.payload.option_to : null;
  const option_min =
    action && action.payload ? action.payload.option_min : null;
  const option_max =
    action && action.payload ? action.payload.option_max : null;
  const option_format =
    action && action.payload ? action.payload.option_format : null;
  const option_decimals =
    action && action.payload ? action.payload.option_decimals : null;
  const option_schema_name =
    action && action.payload ? action.payload.option_schema_name : null;
  const option_field_name =
    action && action.payload ? action.payload.option_field_name : null;
  const option_custom =
    action && action.payload ? action.payload.option_custom : null;

  yield httpSaga({
    api: API.CREATE_FIELD,
    data: {
      name,
      schema_id,
      null_percentage,
      name_type,
      code_type,
      formula,
      option_from,
      option_to,
      option_min,
      option_max,
      option_format,
      option_decimals,
      option_schema_name,
      option_field_name,
      option_custom,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(actionCreateField());
      yield put(getFieldList({ schemaId: schema_id }));
      yield call(action.payload.setSubmitting(false));
    },
    onError: function* errorResponse(responseData, response) {
      yield put(updateErrorsField(responseData));
    },
  });
}

function* handleUpdateField(action) {
  const id = action && action.payload ? action.payload.id : null;
  const name = action && action.payload ? action.payload.name : null;
  const schema_id = action && action.payload ? action.payload.schema_id : null;
  const null_percentage =
    action && action.payload ? action.payload.null_percentage : null;
  const name_type = action && action.payload ? action.payload.name_type : null;
  const code_type = action && action.payload ? action.payload.code_type : null;
  const formula = action && action.payload ? action.payload.formula : null;
  const option_from =
    action && action.payload ? action.payload.option_from : null;
  const option_to = action && action.payload ? action.payload.option_to : null;
  const option_min =
    action && action.payload ? action.payload.option_min : null;
  const option_max =
    action && action.payload ? action.payload.option_max : null;
  const option_format =
    action && action.payload ? action.payload.option_format : null;
  const option_decimals =
    action && action.payload ? action.payload.option_decimals : null;
  const option_schema_name =
    action && action.payload ? action.payload.option_schema_name : null;
  const option_field_name =
    action && action.payload ? action.payload.option_field_name : null;
  const option_custom =
    action && action.payload ? action.payload.option_custom : null;

  yield httpSaga({
    api: API.UPDATE_FIELD,
    urlParams: {
      id,
    },
    data: {
      name,
      schema_id,
      null_percentage,
      name_type,
      code_type,
      formula,
      option_from,
      option_to,
      option_min,
      option_max,
      option_format,
      option_decimals,
      option_schema_name,
      option_field_name,
      option_custom,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(actionUpdateField(responseData));
      yield put(getFieldList({ schemaId: schema_id }));
      yield call(action.payload.setSubmitting(false));
    },
    onError: function* errorResponse(responseData, response) {
      yield put(updateErrorsField(responseData));
    },
  });
}

function* handleDeleteField({ payload: { fieldID, schemaID } = {} }) {
  const id = fieldID || (yield select(selectSelectedIDField));
  const schema_id = schemaID || (yield select(selectSelectedIDField));

  yield httpSaga({
    api: API.DELETE_FIELD,
    params: {
      id: id,
      schema_id: schema_id,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(actionDeleteField());
      yield put(getFieldList({ schemaId: schema_id }));
    },
    onError: function* errorResponse(responseData, response) {
      yield put(updateErrorsField(responseData));
    },
  });
}

export default function* fieldSaga() {
  yield all([
    takeLeading(getFieldList, handleGetFieldList),
    //   takeLeading(getSchema, handleGetSchema),
    takeEvery(createField, handleCreateField),
    takeEvery(updateField, handleUpdateField),
    takeEvery(deleteField, handleDeleteField),
  ]);
}
