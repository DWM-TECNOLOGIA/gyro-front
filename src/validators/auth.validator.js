import { required, minLength, helpers } from '@vuelidate/validators'

const messages = {
    required: 'Campo obrigatório',
    email: 'Por favor, insira um e-mail válido',
    minLength: 'Mínimo de 6 caracteres',
    invalidCode: 'Código inválido'
}


export const loginValidations = {
    phone: {
        required: helpers.withMessage(messages.required, required),
    },
    password: {
        required: helpers.withMessage(messages.required, required),
        minLength: helpers.withMessage(
            messages.minLength,
            minLength(6)
        )
    }
}

export const resetPasswordValidations = {
    phone: {
        required: helpers.withMessage(messages.required, required),
    },
    code: {
        required: helpers.withMessage(messages.required, required),
        invalidCode: helpers.withMessage(messages.invalidCode, (value) => value === '1234')
    },
    password: {
        required: helpers.withMessage(messages.required, required),
        minLength: helpers.withMessage(
            messages.minLength,
            minLength(8)
        )
    }
}

export const adminUserValidations = {
    name: { required: helpers.withMessage(messages.required, required) },
    phone: {
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