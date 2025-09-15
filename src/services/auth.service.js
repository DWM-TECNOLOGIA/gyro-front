import { http, httpUser } from "@/http";


const login = (payload) => httpUser.post(`/user/login`, { ...payload });

const forgotPassword = (payload) =>
	httpUser.post(`/auth/forgot`, { ...payload });

const resetPassword = (payload) =>
	httpUser.put(`/auth/redefine`, { ...payload });

const refreshToken = (payload) => http.post(`/auth/refresh`, { ...payload });

export const authService = {
	login,
	forgotPassword,
	resetPassword,
	refreshToken,
};
