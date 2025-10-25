import { anamneseResService } from "@/services";

export default {
    namespaced: true,
    state: {
        isSaving: false,
        responses: {
            items: [],
            count: 0,
            nextPageId: null
        },
    },
    getters: {
        getIsSaving: (state) => state.isSaving,
        getResponses: (state) => state.responses,
    },
    mutations: {
        SET_FETCH_STATUS(state, status) {
            state.isSaving = status
        },
        SET_RESPONSES_LIST(state, data) {
            state.responses = {
                items: data.data.items || data.data || [],
                count: data.data.count || (Array.isArray(data.data) ? data.data.length : 0),
                nextPageId: data.data.nextPageId || null
            }
        },
    },
    actions: {
        async fetchClientResponses({ commit }, { clientId }) {
            commit("SET_FETCH_STATUS", true);
            try {
                const { data } = await anamneseResService.getClientResponses({ clientId });
                commit("SET_RESPONSES_LIST", data);
                return data;
            } catch (error) {
                const message = error?.response?.data?.message || 'Não foi possível carregar as respostas';
                throw { error, message }
            } finally {
                commit("SET_FETCH_STATUS", false);
            }
        },
        async createResponse({ commit }, payload) {
            commit("SET_FETCH_STATUS", true);
            try {
                const { data } = await anamneseResService.createResponse(payload);
                return data;
            } catch (error) {
                const message = error?.response?.data?.message || 'Não foi possível criar a resposta';
                throw { error, message }
            } finally {
                commit("SET_FETCH_STATUS", false);
            }
        },
        async updateResponse({ commit }, { formResponseId, body }) {
            commit("SET_FETCH_STATUS", true);
            try {
                const { data } = await anamneseResService.updateResponse({ formResponseId, body });
                return data;
            } catch (error) {
                const message = error?.response?.data?.message || 'Não foi possível atualizar a resposta';
                throw { error, message }
            } finally {
                commit("SET_FETCH_STATUS", false);
            }
        },
        async deleteResponse({ commit }, { formResponseId }) {
            commit("SET_FETCH_STATUS", true);
            try {
                const { data } = await anamneseResService.deleteResponse({ formResponseId });
                return data;
            } catch (error) {
                const message = error?.response?.data?.message || 'Não foi possível remover a resposta';
                throw { error, message }
            } finally {
                commit("SET_FETCH_STATUS", false);
            }
        },
    }
};


