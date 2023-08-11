import { createSlice, createAction } from "@reduxjs/toolkit";

import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from "../../configs/appConfig";

const initialState = {
  page: PAGE_DEFAULT,
  pageSize: PAGE_SIZE_DEFAULT,
  totalPage: 0,
  data: {},
  selectedIds: [],
  selectedAll: [],
  selectedProject: undefined,
  showModalCreate: false,
  showModalDelete: false,
  showModalUpdate: false,
  options: [],
  isLoading: false,
  search: undefined,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    updateSearch: (state, action) => {
      state.search = action.payload;
    },
    updateOptions: (state, action) => {
      state.options = action.payload;
    },
    updateIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateProjectList: (state, action) => {
      state.page = action.payload.page;
      state.pageSize = action.payload.page_size;
      state.totalPage = action.payload.total_page;
      state.data = action.payload.data;
      state.selectedAll = [];
      state.selectedIds = [];
      state.options = action.payload.data;
      state.isLoading = false;
      action.payload.data.forEach((data) => state.selectedAll.push(data.id));
    },
    showModalUpdate: (state, action) => {
      state.selectedProject = action.payload.data;
      state.showModalUpdate = true;
    },
    unshowModalUpdate: (state, action) => {
      state.selectedProject = undefined;
      state.showModalUpdate = false;
    },
    showModalCreate: (state, action) => {
      state.showModalCreate = false;
    },
    updateSelectedIdsProject: (state, action) => {
      state.selectedIds = action.payload;
    },
    updateSelectedIdProject: (state, action) => {
      state.selectedIds.push(action.payload);
    },
    removeSelectedIdProject: (state, action) => {
      state.selectedIds.splice(state.selectedIds.indexOf(action.payload), 1);
    },
    updateSelectedProject: (state, action) => {
      state.showModalCreate = action.payload;
    },
    updateShowModalCreateProject: (state, action) => {
      state.showModalCreate = action.payload;
    },
    updateShowModalDeleteProject: (state, action) => {
      state.showModalDelete = action.payload;
    },
    updateShowModalUpdateProject: (state, action) => {
      state.showModalUpdate = action.payload;
    },
  },
});

export const getProjectList = createAction("GET_PROJECT_LIST");
export const getProject = createAction("GET_PROJECT");
export const createProject = createAction("CREATE_PROJECT");
export const updateProject = createAction("UPDATE_PROJECT");
export const deleteProject = createAction("DELETE_PROJECT");

export const {
  updateSearch,
  updateOptions,
  updateIsLoading,
  updateProjectList,
  showModalUpdate,
  unshowModalUpdate,
  showModalCreate,
  updateSelectedIdsProject,
  updateSelectedIdProject,
  removeSelectedIdProject,
  updateSelectedProject,
  updateShowModalCreateProject,
  updateShowModalDeleteProject,
  updateShowModalUpdateProject,
} = projectSlice.actions;

export const selectDataProject = (state) => state.project.data || {};
export const selectPageProject = (state) => state.project.page || PAGE_DEFAULT;
export const selectPageSizeProject = (state) =>
  state.project.pageSize || PAGE_SIZE_DEFAULT;
export const selectTotalPageProject = (state) => state.project.totalPage || 0;
export const selectSelectedIdsProject = (state) =>
  state.project.selectedIds || [];
export const selectSelectedAllProject = (state) =>
  state.project.selectedAll || [];
export const selectSelectedUpdateProject = (state) =>
  state.project.selectedProject || undefined;
export const selectShowModalCreateProject = (state) =>
  state.project.showModalCreate || false;
export const selectShowModalDeleteProject = (state) =>
  state.project.showModalDelete || false;
export const selectShowModalUpdateProject = (state) =>
  state.project.showModalUpdate || false;
export const selectOptions = (state) => state.project.options || [];
export const selectSearch = (state) => state.project.search || undefined;
export const selectIsLoading = (state) => state.project.isLoading || false;

export default projectSlice.reducer;
