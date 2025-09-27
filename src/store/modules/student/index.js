import { studentService } from "@/services";

export default {
	namespaced: true,
	state: {
		isSaving: false,
		students: {
			items: [],
			count: 0,
			nextPageId: null
		},
		selectedStudent: null,
		studentPhotos: [],
		studentSettings: { photoPeriod: 'weekly', trainingPeriod: 'weekly', dietPeriod: 'weekly' },
		progress: { weight: [], shape: [] }
	},
	getters: {
		getIsSaving: (state) => state.isSaving,
		getStudents: (state) => state.students,
		getSelectedStudent: (state) => state.selectedStudent,
		getStudentPhotos: (state) => state.studentPhotos,
		getStudentSettings: (state) => state.studentSettings,
		getProgress: (state) => state.progress
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
		},
		SET_SELECTED_STUDENT(state, student) { state.selectedStudent = student },
		SET_STUDENT_PHOTOS(state, photos) { state.studentPhotos = photos || [] },
		SET_STUDENT_SETTINGS(state, settings) { state.studentSettings = { ...state.studentSettings, ...settings } },
		SET_STUDENT_PROGRESS(state, progress) { state.progress = { ...state.progress, ...progress } }
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
		async fetchStudentDetails({ commit }, { studentId }) {
			// Mocked details for now
			const mock = {
				id: studentId,
				name: 'Student Name',
				cellphone: '11999999999',
				createdAt: new Date().toISOString(),
				isActive: true,
				age: 25,
				avatar: ''
			}
			commit('SET_SELECTED_STUDENT', mock)
			return mock
		},
		async fetchStudentPhotos({ commit }, { studentId }) {
			// Mocked photos
			const mock = []
			commit('SET_STUDENT_PHOTOS', mock)
			return mock
		},
		async fetchStudentSettings({ commit }, { studentId }) {
			// Mocked settings
			const mock = { photoPeriod: 'weekly', trainingPeriod: 'weekly', dietPeriod: 'weekly' }
			commit('SET_STUDENT_SETTINGS', mock)
			return mock
		},
		async fetchProgress({ commit }, { studentId }) {
			// Mock: generate last 8 weeks weight and a simple shape score trend
			const today = new Date()
			const weight = Array.from({ length: 8 }, (_, i) => {
				const d = new Date(today)
				d.setDate(today.getDate() - (7 * (7 - i)))
				return { date: d.toISOString(), value: 80 - (7 - i) * 0.5 }
			})
			const shape = Array.from({ length: 8 }, (_, i) => ({ date: weight[i].date, score: 60 + i * 2 }))
			const mock = { weight, shape }
			commit('SET_STUDENT_PROGRESS', mock)
			return mock
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
