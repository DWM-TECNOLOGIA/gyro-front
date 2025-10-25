import { anamneseService } from "@/services";

export default {
    namespaced: true,
    state: {
        isSaving: false,
        forms: {
            items: [],
            count: 0,
            nextPageId: null
        },
        selectedForm: null,
    },
    getters: {
        getIsSaving: (state) => state.isSaving,
        getForms: (state) => state.forms,
        getSelectedForm: (state) => state.selectedForm,
    },
    mutations: {
        SET_FETCH_STATUS(state, status) {
            state.isSaving = status
        },
        SET_FORMS_LIST(state, data) {
            state.forms = {
                items: data.data.items || data.data || [],
                count: data.data.count || (Array.isArray(data.data) ? data.data.length : 0),
                nextPageId: data.data.nextPageId || null
            }
        },
        SET_SELECTED_FORM(state, form) { state.selectedForm = form },
    },
    actions: {
        async fetchForms({ commit }) {
            commit("SET_FETCH_STATUS", true);
            try {
                const { data } = await anamneseService.getAnamnesisForms();
                commit("SET_FORMS_LIST", data);
                return data;
            } catch (error) {
                const message = error?.response?.data?.message || 'Não foi possível carregar os formulários';
                throw { error, message }
            } finally {
                commit("SET_FETCH_STATUS", false);
            }
        },
        async createForm({ commit }, payload) {
            commit("SET_FETCH_STATUS", true);
            try {
                const { data } = await anamneseService.createForm(payload);
                return data;
            } catch (error) {
                const message = error?.response?.data?.message || 'Não foi possível criar o formulário';
                throw { error, message }
            } finally {
                commit("SET_FETCH_STATUS", false);
            }
        },
        async updateForm({ commit }, { formId, body }) {
            commit("SET_FETCH_STATUS", true);
            try {
                const { data } = await anamneseService.updateForm({ formId, body });
                return data;
            } catch (error) {
                const message = error?.response?.data?.message || 'Não foi possível atualizar o formulário';
                throw { error, message }
            } finally {
                commit("SET_FETCH_STATUS", false);
            }
        },
        async deleteForm({ commit }, formId) {
            commit("SET_FETCH_STATUS", true);
            try {
                const { data } = await anamneseService.deleteForm(formId);
                return data;
            } catch (error) {
                const message = error?.response?.data?.message || 'Não foi possível remover o formulário';
                throw { error, message }
            } finally {
                commit("SET_FETCH_STATUS", false);
            }
        },
    }
};


