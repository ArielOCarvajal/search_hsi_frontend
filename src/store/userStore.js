import { create } from 'zustand';
import { searchUsers, getAllUsers, getUserById } from '../services/api';

const useUserStore = create((set, get) => ({
  // State
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  limit: 50,

  // Search filters
  searchFilters: {
    q: '',
    nombre: '',
    dni: '',
    usuario: '',
    rol: '',
    matricula: ''
  },

  // Actions
  setSearchFilters: (filters) => set({ searchFilters: filters }),

  setCurrentPage: (page) => set({ currentPage: page }),

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { currentPage, limit } = get();
      const offset = (currentPage - 1) * limit;
      const data = await getAllUsers(limit, offset);
      set({
        users: data.users,
        total: data.total,
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  searchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { searchFilters, currentPage, limit } = get();
      const offset = (currentPage - 1) * limit;

      // Only send non-empty filters
      const activeFilters = Object.entries(searchFilters)
        .filter(([_, value]) => value !== '')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      const data = await searchUsers(activeFilters, limit, offset);
      set({
        users: data.users,
        total: data.total,
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const user = await getUserById(id);
      set({ selectedUser: user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  clearFilters: () => {
    set({
      searchFilters: {
        q: '',
        nombre: '',
        dni: '',
        usuario: '',
        rol: '',
        matricula: ''
      },
      currentPage: 1
    });
  }
}));

export default useUserStore;
