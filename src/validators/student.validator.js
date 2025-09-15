import { required, minLength, helpers } from '@vuelidate/validators'

const messages = {
    required: 'Campo obrigatório',
    email: 'Por favor, insira um e-mail válido',
    minLength: 'Mínimo de 6 caracteres',
    completeName: 'Por favor, insira seu nome completo',
}


export const studentValidations = {
    form: {
        name: { required: helpers.withMessage(messages.required, required) },
        cellphone: {
            required: helpers.withMessage(messages.required, required),
        },
        password: {
            required: helpers.withMessage(messages.required, required),
            minLength: helpers.withMessage(
                messages.minLength,
                minLength(6)
            ),
        },
    }

}

