import { authService } from "@/services";
import router from '@/router';

export default {
	namespaced: true,
	state: {
		userData: null,

		// STATUSES
		isRefreshing: false,
		isSaving: false,
	},
	getters: {

		getIsRefreshing(state) {
			return state.isRefreshing;
		},
		getIsSaving(state) {
			return state.isSaving;
		},
		getUserData(state) {
			return state.userData;
		},
		getUserFromStorage() {
			return JSON.parse(localStorage.getItem("user"));
		},
	},
	mutations: {
		SET_REFRESH_STATUS(state, value) {
			state.isRefreshing = value;
		},
		SET_SAVE_STATUS(state, value) {
			state.isSaving = value;
		},
		CLEAR_LOGGED_USER() {
			localStorage.clear();
		},
		SET_USER(state, user) {
			state.userData = user;
		},
	},
	actions: {
		async logout({ commit }) {
			commit("CLEAR_LOGGED_USER");
			const cookies = document.cookie.split(";");

			for (let i = 0; i < cookies.length; i++) {
				const cookie = cookies[i];
				const pos = cookie.indexOf("=");
				const nome = pos > -1 ? cookie.substr(0, pos) : cookie;
				document.cookie =
					nome + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
			}

			router.push({ name: 'login' });
		},
		async forgotPassword({ commit }, params) {
			commit("SET_SAVE_STATUS", true);
			try {
				const { data } = await authService.forgotPassword(params);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Erro ao recuperar senha';
				throw { error, message }
			} finally {
				commit("SET_SAVE_STATUS", false);
			}
		},
		async resetPassword({ commit }, params) {
			commit("SET_SAVE_STATUS", true);
			try {
				const { data } = await authService.resetPassword(params);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Erro ao resetar senha';
				throw { error, message }
			} finally {
				commit("SET_SAVE_STATUS", false);
			}
		},
		async login({ commit }, params) {
			commit("SET_SAVE_STATUS", true);
			try {
				const { data } = await authService.login(params);

				localStorage.setItem("user", JSON.stringify(data.user));
				localStorage.setItem("refreshToken", data.refreshToken);
				localStorage.setItem("token", data.idToken);

				commit("SET_USER", data.user);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível realizar o login';
				throw { error, message }
			} finally {
				commit("SET_SAVE_STATUS", false);

			}
		},
		async refreshToken({ commit }, payload) {
			commit("SET_REFRESH_STATUS", true);
			try {
				const { data } = await authService.refreshToken(payload);

				if (data.user) {
					localStorage.setItem("user", JSON.stringify(data.user));
				}
				localStorage.setItem("refreshToken", data.refreshToken);
				localStorage.setItem("token", data.idToken);

				setTimeout(() => {
					window.location.reload();
				}, 1000);

				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Erro ao atualizar token';
				throw { error, message }
			} finally {
				commit("SET_REFRESH_STATUS", false);
			}
		},

	},
};
