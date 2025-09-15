import { http } from "@/http";
import { serialize } from "@/utils/serialize";

const getList = (payload) => http.get(`/teacher/list-student-workouts/${payload.studentId}${serialize(payload.params)}`);

const getById = (payload) => http.get(`/teacher/${payload.teacherId}/student/${payload.studentId}`);

const create = (payload) => http.post(`/user/create`, { ...payload });

const remove = (payload) => http.delete(`/teacher/${payload.teacherId}/student/${payload.studentId}`);


export const trainingService = {
    getList,
    getById,
    create,
    remove,
};
