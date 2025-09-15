import axios from "axios";
import store from "@/store";
import { environments } from "@/config/configManager";
const baseURL = environments.backend;

// Serviço com auth
const http = axios.create({
	baseURL,
	timeout: 120000,
});

// Serviço sem auth
const httpUser = axios.create({
	baseURL,
	timeout: 120000,
});

http.interceptors.request.use(
	(config) => {
		try {
			if (localStorage.getItem("user")) {
				var user = JSON.parse(localStorage.getItem("user"));
				if (user.idToken) {
					config.headers.Authorization = `${user.idToken}`;
				}
				else {
					if (localStorage.getItem("token")) {
						config.headers.Authorization =
							localStorage.getItem("token");
					}
				}
			}
		} catch (error) {
			Promise.reject(error);
		}
		return config;
	},
	(error) => Promise.reject(error)
);

http.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		switch (error?.response?.status) {
			case 401:
			case 403:
				retrieveToken();
				break;
		}
		return Promise.reject(error);
	}
);

function logOut() {
	store.dispatch("auth/logout");
	return;
}

function retrieveToken() {
	try {
		let user = localStorage.getItem("user");
		if (user === "undefined" || !user) {
			logOut();
		}
		user = JSON.parse(user);

		store.dispatch("auth/refreshToken", {
			token: localStorage.getItem("refreshToken"),
			username: user.username,
		});
	} catch (error) {
		console.error(error);
		logOut();
	}
}

export { http, httpUser };
