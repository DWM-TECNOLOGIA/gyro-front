import { required, minLength, helpers, email as emailValidator } from '@vuelidate/validators'

const messages = {
    required: 'Campo obrigatório',
    email: 'Por favor, insira um e-mail válido',
    minLength: 'Mínimo de 6 caracteres',
    invalidCode: 'Código inválido'
}


export const loginValidations = {
    email: {
        required: helpers.withMessage(messages.required, required),
        email: helpers.withMessage(messages.email, emailValidator),
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
    email: {
        required: helpers.withMessage(messages.required, required),
        email: helpers.withMessage(messages.email, emailValidator),
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
    email: {
        required: helpers.withMessage(messages.required, required),
        email: helpers.withMessage(messages.email, emailValidator),
    },
    password: {
        required: helpers.withMessage(messages.required, required),
        minLength: helpers.withMessage(
            messages.minLength,
            minLength(6)
        ),
    },
}