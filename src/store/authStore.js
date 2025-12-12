import { create } from 'zustand';
import { login as loginApi } from '../services/api';

const TOKEN_KEY = 'hsi_auth_token';
const USER_KEY = 'hsi_user_data';

const useAuthStore = create((set) => ({
  // State
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  token: localStorage.getItem(TOKEN_KEY),
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  loading: false,
  error: null,

  // Actions
  login: async (usuario, contrasena) => {
    set({ loading: true, error: null });
    try {
      const response = await loginApi(usuario, contrasena);

      // Guardar en localStorage
      localStorage.setItem(TOKEN_KEY, response.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify({
        usuario: response.usuario,
        nombre_apellido: response.nombre_apellido,
        rol: response.rol
      }));

      set({
        isAuthenticated: true,
        token: response.access_token,
        user: {
          usuario: response.usuario,
          nombre_apellido: response.nombre_apellido,
          rol: response.rol
        },
        loading: false
      });

      return { success: true };
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        isAuthenticated: false,
        token: null,
        user: null
      });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    // Limpiar localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    set({
      isAuthenticated: false,
      token: null,
      user: null,
      error: null
    });
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
