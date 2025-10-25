<template>
  <AuthForm @submit="handleSubmit">
    <InputField
      id="name"
      label="Nome Completo"
      type="text"
      autocomplete="name"
      placeholder="Digite o nome completo"
      v-model="name"
      :errors="v$.name.$errors"
      :dirty="v$.name.$dirty"
      @blur="v$.name.$touch"
    />

    <InputField
      id="email"
      label="E-mail"
      class="mt-3"
      autocomplete="email"
      type="email"
      placeholder="Digite o e-mail"
      v-model="email"
      :errors="v$.email.$errors"
      :dirty="v$.email.$dirty"
      @blur="v$.email.$touch"
    />

    <InputField
      id="phone"
      label="Telefone"
      class="mt-3"
      autocomplete="tel"
      type="tel"
      placeholder="Digite o telefone"
      v-model="phone"
      :errors="v$.phone.$errors"
      :dirty="v$.phone.$dirty"
      @blur="v$.phone.$touch"
      mask="(##) #####-####"
    />

    <hr v-if="!isClient && isNormalFormComplete" class="mb-3 mt-4" />

    <InputField
      v-if="!isClient && isNormalFormComplete"
      id="companyName"
      class="mt-3"
      label="Nome da empresa"
      placeholder="Digite o nome da empresa"
      v-model="companyForm.companyName"
      :errors="v$.companyForm.companyName.$errors"
      :dirty="v$.companyForm.companyName.$dirty"
      @blur="v$.companyForm.companyName.$touch"
    />

    <RadioGroup
      v-if="!isClient && isNormalFormComplete"
      id="companyDocumentType"
      class="mt-3"
      label="Tipo do documento:"
      :options="['CPF', 'CNPJ']"
      v-model="companyForm.companyDocumentType"
    />

    <InputField
      v-if="!isClient && isNormalFormComplete"
      id="companyDocument"
      class="mt-3"
      label="Número do documento"
      placeholder="Digite o documento da empresa"
      v-maska="companyForm.companyDocumentType === 'CPF' ? '###.###.###-##' : '##.###.###/####-##'"
      v-model="companyForm.companyDocument"
      :errors="v$.companyForm.companyDocument.$errors"
      :dirty="v$.companyForm.companyDocument.$dirty"
      @blur="v$.companyForm.companyDocument.$touch"
    />

    <hr class="mb-3 mt-4" />

    <InputField
      id="password"
      label="Senha"
      class="mt-3"
      :type="isPasswordVisible ? 'text' : 'password'"
      placeholder="Digite a senha"
      v-model="password"
      :errors="v$.password.$errors"
      :dirty="v$.password.$dirty"
      @blur="v$.password.$touch"
    >
      <template #append>
        <PasswordToggle v-model="isPasswordVisible" />
      </template>
    </InputField>

    <InputField
      id="confirmPassword"
      label="Confirmar Senha"
      class="mt-3"
      :type="isConfirmPasswordVisible ? 'text' : 'password'"
      placeholder="Confirme a senha"
      v-model="confirmPassword"
      :errors="v$.confirmPassword.$errors"
      :dirty="v$.confirmPassword.$dirty"
      @blur="v$.confirmPassword.$touch"
    >
      <template #append>
        <PasswordToggle v-model="isConfirmPasswordVisible" />
      </template>
    </InputField>

    <StandardButton class="mt-4" type="submit" :loading="isLoading" :disabled="v$.$invalid"> Cadastrar </StandardButton>
  </AuthForm>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { required, sameAs, requiredIf } from '@vuelidate/validators'
import { mapGetters, mapActions } from 'vuex'
import { adminUserValidations } from '@/validators/auth.validator'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      companyForm: {
        companyName: '',
        companyDocumentType: 'CPF',
        companyDocument: '',
      },
      password: '',
      confirmPassword: '',
      isPasswordVisible: false,
      isConfirmPasswordVisible: false,
    }
  },
  validations() {
    return {
      ...adminUserValidations,
      confirmPassword: {
        required: helpers.withMessage('Confirme a senha', required),
        sameAsPassword: helpers.withMessage('As senhas devem ser iguais', sameAs(this.password)),
      },
      companyForm: {
        companyName: {
          required: helpers.withMessage(
            'Nome da empresa é obrigatório',
            requiredIf(() => !this.$route.params.companyId),
          ),
        },
        companyDocument: {
          required: helpers.withMessage(
            'Documento da empresa é obrigatório',
            requiredIf(() => !this.$route.params.companyId),
          ),
        },
      },
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'user/getIsSaving',
    }),
    isNormalFormComplete() {
      const normalFields = ['name', 'email', 'phone']
      return normalFields.every((field) => this.v$[field].$dirty && !this.v$[field].$errors.length)
    },
    isClient() {
      return this.$route.params.companyId
    },
  },
  methods: {
    ...mapActions({
      registerUser: 'user/createUser',
    }),

    async handleSubmit() {
      this.v$.$touch()
      if (this.v$.$invalid) return

      try {
        await this.registerUser({
          name: this.name,
          email: this.email,
          cellphone: '+55' + this.phone.replace(/\D/g, ''),
          password: this.password,
          profile: this.$route.params.companyId ? 'client' : 'owner',
          ...(this.isClient && { companyId: this.$route.params.companyId }),
          ...(!this.isClient && this.companyForm),
        })

        this.handleNotification('success', `${this.isClient ? 'Aluno' : 'Administrador'} cadastrado com sucesso`)
        this.$emit('create-success')
      } catch ({ message }) {
        this.handleNotification('error', message || `Erro ao cadastrar ${this.isClient ? 'aluno' : 'administrador'}`)
      }
    },

    handleNotification(type, text) {
      this.$toast[type](text)
    },
  },
}
</script>
