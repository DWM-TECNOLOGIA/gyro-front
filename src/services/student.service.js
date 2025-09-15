import { http } from "@/http";
import { serialize } from "@/utils/serialize";

const getList = (payload) => http.get(`/teacher/${payload.teacherId}/students${serialize(payload.params)}`);

const getById = (payload) => http.get(`/teacher/${payload.teacherId}/student/${payload.studentId}`);

const create = (payload) => http.post(`/user/create`, { ...payload });

const remove = (payload) => http.delete(`/teacher/${payload.teacherId}/student/${payload.studentId}`);

const assignToTeacher = (payload) => http.post(`/teacher/${payload.teacherId}/assign-student`, { ...payload.body });

export const studentService = {
    getList,
    getById,
    create,
    remove,
    assignToTeacher
};
