import { login as apiLogin } from '@/services/authService';

export default {
  namespaced: true,
  state: () => ({
    token: null,
    user: null
  }),
  mutations: {
    SET_AUTH(state, { token, user }) {
      state.token = token;
      state.user = user;
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const { data } = await apiLogin(credentials);
      commit('SET_AUTH', { token: data.token, user: data.user });
      localStorage.setItem('authToken', data.token);
    },
    logout({ commit }) {
      commit('SET_AUTH', { token: null, user: null });
      localStorage.removeItem('authToken');
    }
  }
};