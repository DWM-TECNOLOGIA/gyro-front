import { studentService } from "@/services";

export default {
	namespaced: true,
	state: {
		isSaving: false,
		students: {
			items: [],
			count: 0,
			nextPageId: null
		}
	},
	getters: {
		getIsSaving: (state) => state.isSaving,
		getStudents: (state) => state.students
	},
	mutations: {
		SET_FETCH_STATUS(state, status) {
			state.isSaving = status
		},
		SET_USERS_LIST(state, data) {
			console.log('aqui', data)
			state.students = {
				items: data.data.items || [],
				count: data.data.count || 0,
				nextPageId: data.data.nextPageId
			}
		}
	},
	actions: {
		async fetchStudents({ commit }, params) {
			commit("SET_FETCH_STATUS", true);
			try {
				const { data } = await studentService.getList(params);
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
		async createStudent({ commit }, payload) {
			commit("SET_FETCH_STATUS", true);
			try {
				const { data } = await studentService.create(payload);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível criar o usuário';
				throw { error, message }
			} finally {
				commit("SET_FETCH_STATUS", false);
			}
		},
		async updateStudent({ commit }, payload) {
			commit("SET_FETCH_STATUS", true);
			try {
				const { data } = await studentService.update(payload);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível atualizar o usuário';
				throw { error, message }
			} finally {
				commit("SET_FETCH_STATUS", false);
			}
		},
		async deleteStudent({ commit }, id) {
			commit("SET_FETCH_STATUS", true);
			try {
				const { data } = await studentService.delete(id);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível remover o usuário';
				throw { error, message }
			} finally {
				commit("SET_FETCH_STATUS", false);
			}
		},
		async assignToTeacher({ commit }, payload) {
			commit("SET_FETCH_STATUS", true);
			try {
				const { data } = await studentService.assignToTeacher(payload);
				return data;
			} catch (error) {
				const message = error?.response?.data?.message || 'Não foi possível atribuir o aluno ao professor';
				throw { error, message }
			} finally {
				commit("SET_FETCH_STATUS", false);
			}
		}
	}
};
