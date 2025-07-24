import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Offer } from 'src/types/offer.type';

interface OffersState {
  offers: Offer[];
  selectedOffer: Offer | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string;
    category: string;
    brand_id?: number;
    min_discount?: number;
    max_price?: number;
  };
  selectedOffers: number[];
  sortBy: 'title' | 'created_date' | 'status' | 'priority' | 'end_date';
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
}

const initialState: OffersState = {
  offers: [],
  selectedOffer: null,
  loading: false,
  error: null,
  filters: {
    status: 'All Status',
    category: 'All Categories',
    brand_id: undefined,
    min_discount: undefined,
    max_price: undefined,
  },
  selectedOffers: [],
  sortBy: 'created_date',
  sortOrder: 'desc',
  currentPage: 1,
  itemsPerPage: 10,
};

export const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
    },
    
    setSelectedOffer: (state, action: PayloadAction<Offer | null>) => {
      state.selectedOffer = action.payload;
    },
    
    addOffer: (state, action: PayloadAction<Offer>) => {
      state.offers.unshift(action.payload);
    },
    
    updateOffer: (state, action: PayloadAction<Offer>) => {
      const index = state.offers.findIndex(offer => offer.id === action.payload.id);
      if (index !== -1) {
        state.offers[index] = action.payload;
      }
      if (state.selectedOffer?.id === action.payload.id) {
        state.selectedOffer = action.payload;
      }
    },
    
    removeOffer: (state, action: PayloadAction<number>) => {
      state.offers = state.offers.filter(offer => offer.id !== action.payload);
      if (state.selectedOffer?.id === action.payload) {
        state.selectedOffer = null;
      }
      state.selectedOffers = state.selectedOffers.filter(id => id !== action.payload);
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
    
    setFilters: (state, action: PayloadAction<Partial<OffersState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
    
    toggleOfferSelection: (state, action: PayloadAction<number>) => {
      const offerId = action.payload;
      const index = state.selectedOffers.indexOf(offerId);
      if (index !== -1) {
        state.selectedOffers.splice(index, 1);
      } else {
        state.selectedOffers.push(offerId);
      }
    },
    
    selectAllOffers: (state, action: PayloadAction<number[]>) => {
      state.selectedOffers = action.payload;
    },
    
    clearSelection: (state) => {
      state.selectedOffers = [];
    },
    

  },
});

export const { 
  setOffers,
  setSelectedOffer,
  addOffer,
  updateOffer,
  removeOffer,
  setLoading,
  setError,
  clearError,
  setFilters,
  clearFilters,
  toggleOfferSelection,
  selectAllOffers,
  clearSelection,


} = offersSlice.actions;

export default offersSlice.reducer; 