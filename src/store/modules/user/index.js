import { userService } from "@/services";

export default {
	namespaced: true,
	state: {
		usersList: null,

		// STATUSES
		isFetching: false,
		isSaving: false,
	},
	getters: {
		getIsFetching(state) {
			return state.isFetching;
		},
		getIsSaving(state) {
			return state.isSaving;
		},
		getUsers(state) {
			return state.usersList;
		},
	},
	mutations: {
		SET_FETCH_STATUS(state, value) {
			state.isFetching = value;
		},
		SET_SAVE_STATUS(state, value) {
			state.isSaving = value;
		},
		SET_USERS_LIST(state, users) {
			state.usersList = users;
		},
	},
	actions: {
		async createUser({ commit }, params) {
			commit("SET_SAVE_STATUS", true);
			try {
				const { data } = await userService.create(params);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível criar o usuário';
				throw { error, message }
			} finally {
				commit("SET_SAVE_STATUS", false);
			}
		},
		async updateUser({ commit }, params) {
			commit("SET_SAVE_STATUS", true);
			try {
				const { data } = await userService.update(params);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível atualizar o usuário';
				throw { error, message }
			} finally {
				commit("SET_SAVE_STATUS", false);
			}
		},
		async deleteUser({ commit }, params) {
			commit("SET_SAVE_STATUS", true);
			try {
				const { data } = await userService.remove(params);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível deletar o usuário';
				throw { error, message }
			} finally {
				commit("SET_SAVE_STATUS", false);
			}
		},
		async fetchUsers({ commit }, params) {
			commit("SET_FETCH_STATUS", true);
			try {
				const { data } = await userService.getList(params);
				commit("SET_USERS_LIST", data);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível carregar os usuários';
				throw { error, message }
			} finally {
				commit("SET_FETCH_STATUS", false);

			}
		},
		async fetchUser({ commit }, params) {
			commit("SET_FETCH_STATUS", true);
			try {
				const { data } = await userService.getById(params);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível carregar o usuário';
				throw { error, message }
			} finally {
				commit("SET_FETCH_STATUS", false);
			}
		},
	},
};
