import { createSlice, createAction } from "@reduxjs/toolkit";

import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from "../../configs/appConfig";

const initialState = {
  page: PAGE_DEFAULT,
  pageSize: PAGE_SIZE_DEFAULT,
  totalPage: 0,
  data: {},
  errors: {},
  selectedIds: [],
  selectedSchema: {},
  showModalCreate: false,
  showModalDelete: false,
  showModalUpdate: false,
  isCreateSchema: false,
};

export const schemaSlice = createSlice({
  name: "schema",
  initialState,
  reducers: {
    actionGetListSchema: (state, action) => {
      state.data = action.payload.data;
      state.page = action.payload.page;
      state.pageSize = action.payload.page_size;
      state.totalPage = action.payload.total_page;
      state.selectedIds = [];
    },
    actionGetSchema: (state, action) => {
      state.selectedSchema = action.payload.data;
    },
    actionCreateSchema: (state, action) => {
      state.selectedSchema = action.payload.data;
      state.showModalCreate = false;
      state.isCreateSchema = true;
    },
    actionDeleteSchema: (state, action) => {
      state.showModalDelete = false;
    },
    actionUpdateSchema: (state, action) => {
      // state.data = action.payload.data;
    },
    updateErrorSchema: (state, action) => {
      state.errors = action.payload.errors;
    },
    updateSelectedIdsSchema: (state, action) => {
      state.selectedIds = action.payload;
    },
    addSelectedIdSchema: (state, action) => {
      state.selectedIds.push(action.payload);
    },
    removeSelectedIdSchema: (state, action) => {
      state.selectedIds.splice(state.selectedIds.indexOf(action.payload), 1);
    },
    updateSelectedSchemas: (state, action) => {
      state.selectedSchema = action.payload;
    },
    updateShowModalCreateSchema: (state, action) => {
      state.showModalCreate = action.payload;
    },
    updateShowModalUpdateSchema: (state, action) => {
      state.showModalUpdate = action.payload;
    },
    updateShowModalDeleteSchema: (state, action) => {
      state.showModalDelete = action.payload;
    },
    updateIsCreateSchema: (state, action) => {
      state.isCreateSchema = action.payload;
    },
  },
});

export const {
  actionGetListSchema,
  actionGetSchema,
  actionCreateSchema,
  actionDeleteSchema,
  actionUpdateSchema,
  updateErrorSchema,
  updateSelectedIdsSchema,
  addSelectedIdSchema,
  removeSelectedIdSchema,
  updateSelectedSchemas,
  updateShowModalCreateSchema,
  updateShowModalUpdateSchema,
  updateShowModalDeleteSchema,
  updateIsCreateSchema,
} = schemaSlice.actions;

export const getListSchema = createAction("GET_LIST_SCHEMA");
export const getSchema = createAction("GET_SCHEMA");
export const createSchema = createAction("CREATE_SCHEMA");
export const updateSchema = createAction("UPDATE_SCHEMA");
export const deleteSchema = createAction("DELETE_SCHEMA");

export const selectPageSchema = (state) => state.schema.page || undefined;
export const selectPageSizeSchema = (state) =>
  state.schema.pageSize || undefined;
export const selectTotalPageSchema = (state) =>
  state.schema.totalPage || undefined;
export const selectDataSchema = (state) => state.schema.data || {};
export const selectErrorSchema = (state) => state.schema.errors || {};
export const selectSelectedIdsSchema = (state) =>
  state.schema.selectedIds || [];
export const selectSelectedSchema = (state) =>
  state.schema.selectedSchema || {};
export const selectShowModalCreateSchema = (state) =>
  state.schema.showModalCreate || false;
export const selectShowModalUpdateSchema = (state) =>
  state.schema.showModalUpdate || false;
export const selectShowModalDeleteSchema = (state) =>
  state.schema.showModalDelete || false;
export const selectIsCreateSchema = (state) =>
  state.schema.isCreateSchema || false;

export default schemaSlice.reducer;
