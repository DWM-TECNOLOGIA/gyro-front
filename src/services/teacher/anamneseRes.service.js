import { http } from "@/http";

// Anamnese responses service
// Endpoints:
// - POST   /form-responses
// - GET    /client/:clientId/form-responses
// - DELETE /form-responses/:formResponseId
// - PUT    /form-responses/:formResponseId

const createResponse = (payload) => http.post(`/form-responses`, { ...payload });

const getClientResponses = ({ clientId }) => http.get(`/client/${clientId}/form-responses`);

const deleteResponse = ({ formResponseId }) => http.delete(`/form-responses/${formResponseId}`);

const updateResponse = ({ formResponseId, body }) => http.put(`/form-responses/${formResponseId}`, { ...body });

export const anamneseResService = { createResponse, getClientResponses, deleteResponse, updateResponse };


