import { createSlice, createAction } from "@reduxjs/toolkit";

const initialState = {
  fieldList: [],
  data: {},
  errors: {},
  selectedID: undefined,
  selectedField: {},
};

export const fieldSlice = createSlice({
  name: "field",
  initialState,
  reducers: {
    actionGetFieldList: (state, action) => {
      state.data = action.payload.data;
    },
    actionCreateField: (state, action) => {},
    actionDeleteField: (state, action) => {},
    actionUpdateField: (state, action) => {},
    updateErrorsField: (state, action) => {
      state.errors = action.payload.errors;
    },
    updateDataField: (state, action) => {
      state.data = action.payload;
    },
    updateSelectedIDField: (state, action) => {
      state.selectedID = action.payload;
    },
    updateSelectedField: (state, action) => {
      state.selectedField = action.payload;
    },
    updateFieldList: (state, action) => {
      state.fieldList = action.payload;
    },
  },
});

export const getFieldList = createAction("GET_FIELD_LIST");
export const createField = createAction("CREATE_FIELD");
export const updateField = createAction("UPDATE_FIELD");
export const deleteField = createAction("DELETE_FIELD");

export const {
  // action api
  actionGetFieldList,
  actionDeleteField,
  actionCreateField,
  actionUpdateField,
  // action update
  updateErrorsField,
  updateDataField,
  updateSelectedIDField,
  updateSelectedField,
  updateFieldList,
} = fieldSlice.actions;

export const selectInputListField = (state) => state.field.inputList || [];
export const selectDataField = (state) => state.field.data || {};
export const selectErrorsField = (state) => state.field.errors || {};
export const selectSelectedIDField = (state) =>
  state.field.selectedID || undefined;
export const selectFieldList = (state) => state.field.fieldList || [];
export const selectSelectedField = (state) => state.field.selectedField || {};

export default fieldSlice.reducer;
