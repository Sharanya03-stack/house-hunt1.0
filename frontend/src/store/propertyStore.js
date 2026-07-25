import { create } from 'zustand';
import api from '../lib/api';

export const usePropertyStore = create((set, get) => ({
  properties: [],
  featured: [],
  currentProperty: null,
  favorites: [],
  filters: {
    city: '', min_price: '', max_price: '', property_type: '',
    listing_type: '', bedrooms: '', bathrooms: '', furnished: '',
    parking: '', pet_friendly: '', search: '',
  },
  pagination: { total: 0, page: 1, limit: 12, totalPages: 1 },
  isLoading: false,
  error: null,

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: { city: '', min_price: '', max_price: '', property_type: '', listing_type: '', bedrooms: '', bathrooms: '', furnished: '', parking: '', pet_friendly: '', search: '' } }),

  fetchProperties: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const filters = get().filters;
      const { data } = await api.get('/properties', { params: { ...filters, ...params } });
      set({ properties: data.data.properties, pagination: data.data.pagination, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchFeatured: async () => {
    try {
      const { data } = await api.get('/properties/featured');
      set({ featured: data.data.properties });
    } catch (error) {
      console.error('Failed to fetch featured:', error);
    }
  },

  fetchProperty: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/properties/${id}`);
      set({ currentProperty: data.data.property, isLoading: false });
      return data.data.property;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchFavorites: async () => {
    try {
      const { data } = await api.get('/user/favorites');
      set({ favorites: data.data.favorites });
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  },

  toggleFavorite: async (propertyId) => {
    try {
      const { data } = await api.post(`/user/favorites/${propertyId}`);
      if (data.saved) {
        set((state) => ({ favorites: [...state.favorites, { property_id: propertyId }] }));
      } else {
        set((state) => ({ favorites: state.favorites.filter((f) => f.property_id !== propertyId) }));
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  isFavorite: (propertyId) => {
    return get().favorites.some((f) => f.property_id === propertyId);
  },
}));
