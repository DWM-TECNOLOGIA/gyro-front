import config from "./index.json";

const environmentMapping = {
	"https://link-dev": "development",
	"https://link-stg": "staging",
	"https://link-uat": "uat",
};

const currentHost = location.host;
const currentEnvironment =
	environmentMapping[currentHost] || import.meta.env.MODE || "production";

export const environments = {
	backend: config[currentEnvironment]?.backend || config.production.backend,
	socket: config[currentEnvironment]?.socket || config.production.socket,
};
