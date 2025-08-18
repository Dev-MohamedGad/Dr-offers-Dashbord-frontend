import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDirection } from '../../../i18n';

export interface LanguageState {
  currentLanguage: string;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
}

const initialState: LanguageState = {
  currentLanguage: 'en',
  direction: 'ltr',
  isRTL: false,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      const language = action.payload;
      state.currentLanguage = language;
      state.direction = getDirection(language);
      state.isRTL = state.direction === 'rtl';
    },
    initializeLanguage: (state, action: PayloadAction<string>) => {
      const language = action.payload;
      state.currentLanguage = language;
      state.direction = getDirection(language);
      state.isRTL = state.direction === 'rtl';
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;
export default languageSlice.reducer;

// Selectors
export const selectCurrentLanguage = (state: { language: LanguageState }) => state.language.currentLanguage;
export const selectDirection = (state: { language: LanguageState }) => state.language.direction;
export const selectIsRTL = (state: { language: LanguageState }) => state.language.isRTL;
