import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Brand } from './brandsApiSlice';

interface BrandsState {
  brands: Brand[];
  selectedBrand: Brand | null;
  loading: boolean;
  error: string | null;
}

const initialState: BrandsState = {
  brands: [],
  selectedBrand: null,
  loading: false,
  error: null,
};

export const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    setBrands: (state, action: PayloadAction<Brand[]>) => {
      state.brands = action.payload;
    },
    setSelectedBrand: (state, action: PayloadAction<Brand | null>) => {
      state.selectedBrand = action.payload;
    },
    addBrand: (state, action: PayloadAction<Brand>) => {
      state.brands.push(action.payload);
    },
    updateBrand: (state, action: PayloadAction<Brand>) => {
      const index = state.brands.findIndex(brand => brand.id === action.payload.id);
      if (index !== -1) {
        state.brands[index] = action.payload;
      }
    },
    removeBrand: (state, action: PayloadAction<number>) => {
      state.brands = state.brands.filter(brand => brand.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setBrands, 
  setSelectedBrand, 
  addBrand, 
  updateBrand, 
  removeBrand, 
  setLoading, 
  setError, 
  clearError 
} = brandsSlice.actions;

export default brandsSlice.reducer; 