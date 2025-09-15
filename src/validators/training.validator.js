import { required, helpers, minLength } from '@vuelidate/validators'

const messages = {
    required: 'Campo obrigatório',
    minLength: 'Deve ter pelo menos {min} caracteres',
    minArrayLength: 'Selecione pelo menos {min} item',
    invalidNumber: 'Deve ser um número válido',
    minValue: 'Deve ser maior que {min}'
}

const exerciseStepValidations = {
    description: {
        required: helpers.withMessage(messages.required, required)
    },
    repetitions: {
        required: helpers.withMessage(messages.required, required),
        numeric: helpers.withMessage(messages.invalidNumber, (value) => !isNaN(value) && value > 0)
    },
    weight: {
        required: helpers.withMessage(messages.required, required),
        numeric: helpers.withMessage(messages.invalidNumber, (value) => !isNaN(value) && value > 0)
    }
}

const exerciseValidations = {
    exerciseName: {
        required: helpers.withMessage(messages.required, required),
        minLength: helpers.withMessage(messages.minLength, minLength(3))
    },
    description: {
        required: helpers.withMessage(messages.required, required)
    },
    steps: {
        required: helpers.withMessage(messages.required, required),
        minLength: helpers.withMessage(messages.minArrayLength, minLength(1)),
        $each: exerciseStepValidations
    }
}

export const trainingValidations = {
    form: {
        workoutNumber: {
            required: helpers.withMessage(messages.required, required),
            numeric: helpers.withMessage(messages.invalidNumber, (value) => !isNaN(value) && value > 0)
        },
        workoutName: {
            required: helpers.withMessage(messages.required, required),
            minLength: helpers.withMessage(messages.minLength, minLength(3))
        },
        workoutDescription: {
            required: helpers.withMessage(messages.required, required)
        },
        days: {
            required: helpers.withMessage(messages.required, required),
            minLength: helpers.withMessage(messages.minArrayLength, minLength(1))
        }
    }
}

export const exercisesValidations = {
    exercises: {
        required: helpers.withMessage(messages.required, required),
        minLength: helpers.withMessage(messages.minArrayLength, minLength(1)),
        $each: exerciseValidations
    }
} 