import moment from "moment";
import VueMoment from "vue-moment";

export default {
	install(app) {
		app.use(VueMoment, {
			moment,
		});

		// Opcional: se quiser disponibilizar o moment globalmente sem VueMoment
		app.config.globalProperties.$moment = moment;
	},
};
