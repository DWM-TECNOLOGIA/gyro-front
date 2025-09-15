import { http } from "@/http";
import { serialize } from "@/utils/serialize";

const getList = (payload) => http.get(`/users${serialize(payload)}`);

const getById = (id) => http.get(`/users/${id}`);

const create = (payload) => http.post(`/user/create`, { ...payload });

const remove = (payload) => http.delete(`/users/${payload}`);

export const userService = {
	getList,
	getById,
	create,
	remove,
};
