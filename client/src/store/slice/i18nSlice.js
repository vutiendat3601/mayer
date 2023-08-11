import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { defaultLang, supportedLangs } from "../../configs/appConfig";
import { fetchTranslations } from "../../utils/i18n";

const initialState = {
  status: "loading",
  language: defaultLang,
  supportedLangs: { ...supportedLangs },
  translations: {},
};

export const setLangAsync = createAsyncThunk(
  "i18n/setLangAsync",
  async (lang, { getState, dispatch }) => {
    const resolvedLang = lang || getState().i18n.language;
    const translations = await fetchTranslations(resolvedLang);
    dispatch(i18nSlice.actions.setLanguage(resolvedLang));
    return translations;
  }
);

export const i18nSlice = createSlice({
  name: "i18n",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setLangAsync.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(setLangAsync.fulfilled, (state, action) => {
      state.translations = action.payload;
      state.status = "idle";
    });
  },
});

export const { setLanguage } = i18nSlice.actions;

export const selectTranslations = (state) => state.i18n.translations;

export default i18nSlice.reducer;
