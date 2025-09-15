import momentTimezone from "moment-timezone";

export default {
	install(app) {
		// CPF/CNPJ formatter
		app.config.globalProperties.$formatCPF = (documentId, documentType) => {
			documentId =
				typeof documentId !== "string"
					? documentId.toString()
					: documentId;
			if (documentType === "J") {
				documentId = documentId.padStart(14, "0");
				documentId = documentId.replace(
					/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
					"$1.$2.$3/$4-$5"
				);
			} else {
				documentId = documentId.padStart(11, "0");
				documentId = documentId.replace(
					/^(\d{3})(\d{3})(\d{3})(\d{2})/,
					"$1.$2.$3-$4"
				);
			}
			return documentId;
		};

		// Phone formatter
		app.config.globalProperties.$formatPhone = (phone) => {
			if (!phone) {
				return "Não informado";
			}
			phone = phone.toString();
			phone = phone.replace("+55", "");
			if (phone.substring(0, 2) === " 5") {
				phone = phone.substring(3);
			}
			phone = phone.replace(/^(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
			return phone;
		};

		// Format date with UTC and timezone
		app.config.globalProperties.$formatDateUtc = (value) => {
			if (!value) {
				return "";
			}
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			return momentTimezone
				.utc(value)
				.tz(timezone)
				.format("DD/MM/YY HH:mm");
		};

		// Get first name
		app.config.globalProperties.$firstName = (name) => {
			return name.split(" ")[0];
		};

		// CamelCase formatter
		app.config.globalProperties.$camelCase = (value) => {
			if (!value) {
				return "";
			}
			value = value.toString();
			return value.charAt(0).toUpperCase() + value.slice(1);
		};
	},
};
