import { http } from "@/http";

// Anamnese forms service
// Endpoints:
// - POST   /teacher/forms
// - GET    /teacher/forms/anamnesis
// - PUT    /teacher/forms/:formId
// - DELETE /teacher/forms/:formId

const createForm = (payload) => http.post(`/teacher/forms`, { ...payload });

const getAnamnesisForms = () => http.get(`/teacher/forms/anamnesis`);

const updateForm = ({ formId, body }) => http.put(`/teacher/forms/${formId}`, { ...body });

const deleteForm = (formId) => http.delete(`/teacher/forms/${formId}`);

export const anamneseService = { createForm, getAnamnesisForms, updateForm, deleteForm };


