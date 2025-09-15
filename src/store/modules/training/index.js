import { trainingService } from "@/services";

export default {
	namespaced: true,
	state: {
		isSaving: false,
		trainings: {
			items: [],
			count: 0,
			nextPageId: null
		}
	},
	getters: {
		getIsSaving: (state) => state.isSaving,
		getTrainings: (state) => state.trainings
	},
	mutations: {
		SET_FETCH_STATUS(state, status) {
			state.isSaving = status
		},
		SET_USERS_LIST(state, data) {
			console.log('aqui', data)
			state.trainings = {
				items: data.data.items || [],
				count: data.data.count || 0,
				nextPageId: data.data.nextPageId
			}
		}
	},
	actions: {
		async fetchTrainings({ commit }, params) {
			commit("SET_FETCH_STATUS", true);
			try {
				const { data } = await trainingService.getList(params);
				commit("SET_USERS_LIST", data);
				return data;
			} catch (error) {
				console.log('error', error)
				const message = error?.response?.data?.message || 'Não foi possível carregar os usuários';
				throw { error, message }
			} finally {
				commit("SET_FETCH_STATUS", false);
			}
		},
		async createTraining({ commit }, payload) {
			commit("SET_FETCH_STATUS", true);
			try {
				const { data } = await trainingService.create(payload);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível criar o usuário';
				throw { error, message }
			} finally {
				commit("SET_FETCH_STATUS", false);
			}
		},
		async updateTraining({ commit }, payload) {
			commit("SET_FETCH_STATUS", true);
			try {
				const { data } = await trainingService.update(payload);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível atualizar o usuário';
				throw { error, message }
			} finally {
				commit("SET_FETCH_STATUS", false);
			}
		},
		async deleteTraining({ commit }, id) {
			commit("SET_FETCH_STATUS", true);
			try {
				const { data } = await trainingService.delete(id);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível remover o usuário';
				throw { error, message }
			} finally {
				commit("SET_FETCH_STATUS", false);
			}
		},

	}
};
