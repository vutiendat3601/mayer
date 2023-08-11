import {
  call,
  put,
  select,
  takeEvery,
  all,
  takeLeading,
} from "redux-saga/effects";

import httpSaga from "./httpSaga";

import {
  selectPageProject,
  selectPageSizeProject,
  selectSelectedIdsProject,
  selectSelectedUpdateProject,
  selectSelectedAllProject,
  updateProjectList,
  showModalUpdate,
  showModalCreate,
  unshowModalUpdate,
  getProjectList,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  selectSearch,
} from "../slice/projectSlice";

import API from "../../configs/Api";

function* handleGetListProject({ payload: { page, pageSize, search } = {} }) {
  page = page || (yield select(selectPageProject));
  pageSize = pageSize || (yield select(selectPageSizeProject));
  search = search || (yield select(selectSearch));

  yield httpSaga({
    api: API.GET_LIST_PROJECTS,
    params: {
      page,
      page_size: pageSize,
      search: search,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(updateProjectList(responseData));
    },
  });
}

function* handleGetProject(action) {
  const id =
    action && action.payload
      ? action.payload
      : yield select(selectSelectedIdsProject);

  yield httpSaga({
    api: Object.assign({}, API.GET_PROJECT, {
      url: "/api/v1/projects/" + id.toString(),
    }),
    // api: API.GET_PROJECT,
    // urlParams: {
    //   id
    // },
    onSuccess: function* successResponse(responseData, response) {
      yield put(showModalUpdate(responseData));
    },
  });
}

function* handleCreateProject(action) {
  const name = action && action.payload ? action.payload.name : null;

  yield httpSaga({
    api: API.CREATE_PROJECT,
    data: {
      name,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(showModalCreate(responseData));
      yield put(getProjectList());
      yield call(action.payload.setSubmitting(false));
    },
  });
}

function* handleUpdateProject(action) {
  const selectedProject = yield select(selectSelectedUpdateProject);
  const name =
    action && action.payload ? action.payload.name : selectedProject.name;

  yield httpSaga({
    api: Object.assign({}, API.UPDATE_PROJECT, {
      url: "/api/v1/projects/" + selectedProject.id.toString(),
    }),
    data: {
      name,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(unshowModalUpdate(responseData));
      yield put(getProjectList());
      yield call(action.payload.setSubmitting(false));
    },
  });
}

function* handleDeleteProject() {
  const listId = yield select(selectSelectedIdsProject);

  const ids =
    Array.isArray(listId) && listId.length > 0
      ? listId
      : yield select(selectSelectedAllProject);

  yield httpSaga({
    api: API.DELETE_PROJECT,
    params: {
      ids,
    },
    onSuccess: function* successResponse(responseData, response) {
      yield put(getProjectList());
    },
  });
}

export default function* projectSaga() {
  yield all([
    takeLeading(getProjectList, handleGetListProject),
    takeLeading(getProject, handleGetProject),
    takeEvery(createProject, handleCreateProject),
    takeEvery(updateProject, handleUpdateProject),
    takeEvery(deleteProject, handleDeleteProject),
  ]);
}
