import {
  call,
  put,
  select,
  takeEvery,
  all,
  takeLeading,
} from "redux-saga/effects";
import { v1 as uuidv1 } from "uuid";

import httpSaga from "./httpSaga";

import API from "../../configs/Api";

import {
  //action saga
  getListSchema,
  getSchema,
  createSchema,
  updateSchema,
  deleteSchema,
  // action api
  actionGetListSchema,
  actionGetSchema,
  actionCreateSchema,
  actionDeleteSchema,
  actionUpdateSchema,
  // action select
  selectPageSchema,
  selectPageSizeSchema,
  selectSelectedIdsSchema,
  selectSelectedSchema,
  //orther action
  updateErrorSchema,
} from "../slice/schemaSlice";
import { updateFieldList, createField } from "../slice/fieldSlice";

function* handleGetListSchema({ payload: { page, pageSize } = {} }) {
  page = page || (yield select(selectPageSchema));
  pageSize = pageSize || (yield select(selectPageSizeSchema));

  yield httpSaga({
    api: API.GET_LIST_SCHEMAS,
    params: {
      page,
      page_size: pageSize,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(actionGetListSchema(responseData));
    },
    onError: function* errorResponse(responseData, response) {
      yield put(updateErrorSchema(responseData));
    },
  });
}

function* handleGetSchema({ payload: { schemaId } = {} }) {
  const id = schemaId || (yield select(selectSelectedIdsSchema));

  yield httpSaga({
    api: API.GET_SCHEMA,
    urlParams: {
      id,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(actionGetSchema(responseData));
    },
    onError: function* errorResponse(responseData, response) {
      yield put(updateErrorSchema(responseData));
    },
  });
}

function* handleCreateSchema(action) {
  const name = action && action.payload ? action.payload.name : null;
  const project_id = action && action.payload ? action.payload.projectID : null;

  yield httpSaga({
    api: API.CREATE_SCHEMA,
    data: {
      name,
      project_id,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(actionCreateSchema(responseData));

      const fields = [
        {
          name: "id",
          code_type: "type_row_number",
          schema_id: responseData.data.id,
          null_percentage: 0,
          name_type: "Row Number",
          formula: "",
        },
        {
          name: "name",
          code_type: "type_full_name",
          schema_id: responseData.data.id,
          null_percentage: 0,
          name_type: "Full Name",
          formula: "",
        },
        {
          name: "birth_day",
          code_type: "type_date_time",
          schema_id: responseData.data.id,
          null_percentage: 0,
          name_type: "Date Time",
          option_from: "12/12/2021",
          option_to: "12/12/2022",
          option_format: "dd/mm/yyyy",
          formula: "",
        },
        {
          name: "gender",
          code_type: "type_gender",
          schema_id: responseData.data.id,
          null_percentage: 0,
          name_type: "Gender",
          formula: "",
        },
        {
          code_type: "type_email_address",
          name: "email",
          schema_id: responseData.data.id,
          null_percentage: 0,
          name_type: "Email Address",
          formula: "",
        },
      ];

      for (let index = 0; index < fields.length; index++) {
        const element = fields[index];
        yield put(createField(element));
      }

      yield call(action.payload.setSubmitting(false));
    },
    onError: function* errorResponse(responseData, response) {
      yield put(updateErrorSchema(responseData));
    },
  });
}

function* handleUpdateSchema(action) {
  const selectedSchema = yield select(selectSelectedSchema);
  const id = action && action.payload ? action.payload.id : selectedSchema.id;
  const name_type =
    action && action.payload
      ? action.payload.name_type
      : selectedSchema.name_type;
  const project_id =
    action && action.payload
      ? action.payload.projectID
      : selectedSchema.projectID;

  yield httpSaga({
    api: API.UPDATE_SCHEMA,
    urlParams: {
      id,
    },
    data: {
      name_type,
      project_id,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(actionUpdateSchema(responseData));
      yield put(getListSchema());
      yield call(action.payload.setSubmitting(false));
    },
    onError: function* errorResponse(responseData, response) {
      yield put(updateErrorSchema(responseData));
    },
  });
}

function* handleDeleteSchema() {
  const ids = yield select(selectSelectedIdsSchema);

  yield httpSaga({
    api: API.DELETE_SCHEMA,
    params: {
      ids,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(actionDeleteSchema());
      yield put(getListSchema());
    },
    onError: function* errorResponse(responseData, response) {
      yield put(updateErrorSchema(responseData));
    },
  });
}

export default function* schemaSaga() {
  yield all([
    takeLeading(getListSchema, handleGetListSchema),
    takeLeading(getSchema, handleGetSchema),
    takeEvery(createSchema, handleCreateSchema),
    takeEvery(updateSchema, handleUpdateSchema),
    takeEvery(deleteSchema, handleDeleteSchema),
  ]);
}
