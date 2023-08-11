import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { defaultLang } from "../../configs/appConfig";
import { fetchTypeOfField } from "../../utils/type";

const initialState = {
  status: "loading",
  language: defaultLang,
  types: [],
  showModal: false,
  selectedType: {},
};

export const getTypesAsync = createAsyncThunk(
  "type/getTypesAsync",
  async (lang, { getState, dispatch }) => {
    const resolvedLang = lang || getState().type.language;
    const types = await fetchTypeOfField(resolvedLang);
    dispatch(typeSlice.actions.updateLanguage(resolvedLang));
    return types;
  }
);

export const typeSlice = createSlice({
  name: "type",
  initialState,
  reducers: {
    updateLanguage: (state, action) => {
      state.language = action.payload;
    },
    updateShowModalType: (state, action) => {
      state.showModal = action.payload;
    },
    updateSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTypesAsync.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getTypesAsync.fulfilled, (state, action) => {
      state.types = action.payload;
      state.status = "idle";
    });
  },
});

export const { updateLanguage, updateShowModalType, updateSelectedType } = typeSlice.actions;

export const selectTypes = (state) => state.type.types || [];
export const selectShowModalType = (state) => state.type.showModal || false;
export const selectSelectedType = (state) => state.type.selectedType || {};

export default typeSlice.reducer;
