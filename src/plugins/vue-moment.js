import moment from "moment";

export default {
	install(app) {
		// Expondo moment globalmente para Vue 3
		app.config.globalProperties.$moment = moment;
	},
};
