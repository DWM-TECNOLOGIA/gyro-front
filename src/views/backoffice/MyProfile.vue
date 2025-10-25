<template>
  <BCard no-body class="users-card">
    <BCardBody class="p-4">
      <h5 class="mb-4">Meu perfil</h5>

      <BRow>
        <BCol sm="12" md="6" lg="6">
          <h6 class="mb-3">Dados pessoais</h6>
          <InputField
            id="name"
            label="Nome"
            type="text"
            placeholder="Digite o nome"
            v-model="form.name"
            :errors="v$.form.name.$errors"
            :dirty="v$.form.name.$dirty"
            @blur="v$.form.name.$touch"
          />

          <InputField
            id="email"
            label="E-mail"
            class="mt-3"
            autocomplete="email"
            type="email"
            placeholder="Digite o e-mail"
            v-model="form.email"
            :errors="v$.form.email.$errors"
            :dirty="v$.form.email.$dirty"
            @blur="v$.form.email.$touch"
          />

          <InputField
            id="cellphone"
            label="Telefone"
            class="mt-3"
            autocomplete="tel"
            type="tel"
            placeholder="Digite o telefone"
            v-model="form.cellphone"
            :errors="v$.form.cellphone.$errors"
            :dirty="v$.form.cellphone.$dirty"
            @blur="v$.form.cellphone.$touch"
            mask="(##) #####-####"
          />

          <InputField
            id="password"
            label="Nova senha (opcional)"
            class="mt-3"
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Digite a nova senha"
            v-model="form.password"
            :errors="v$.form.password.$errors"
            :dirty="v$.form.password.$dirty"
            @blur="v$.form.password.$touch"
          >
            <template #append>
              <PasswordToggle v-model="isPasswordVisible" />
            </template>
          </InputField>

          <div class="my-4">
            <StandardButton variant="primary" class="w-auto text-nowrap" :loading="isSaving" @click="handleSubmit">
              Salvar alterações
            </StandardButton>
          </div>
        </BCol>

        <BCol sm="12" md="6" lg="6" v-if="isOwner">
          <h6 class="mb-3 mt-4 mt-lg-0">Dados da empresa</h6>
          <InputField
            id="companyName"
            label="Nome da empresa"
            placeholder="Digite o nome da empresa"
            v-model="companyForm.companyName"
            :errors="v$.companyForm.companyName.$errors"
            :dirty="v$.companyForm.companyName.$dirty"
            @blur="v$.companyForm.companyName.$touch"
          />

          <RadioGroup
            id="companyDocumentType"
            class="mt-3"
            label="Tipo do documento:"
            :options="['CPF', 'CNPJ']"
            v-model="companyForm.companyDocumentType"
          />

          <InputField
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

          <div class="my-4">
            <StandardButton variant="primary" class="w-auto text-nowrap" :loading="isSaving" @click="handleSubmit">
              Salvar empresa
            </StandardButton>
          </div>
        </BCol>
      </BRow>
    </BCardBody>
  </BCard>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers, email as emailValidator, requiredIf } from '@vuelidate/validators'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MyProfile',
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      isPasswordVisible: false,
      form: {
        name: '',
        email: '',
        cellphone: '',
        password: '',
      },
      companyForm: {
        companyName: '',
        companyDocumentType: 'CPF',
        companyDocument: '',
      },
    }
  },
  validations() {
    const messages = {
      required: 'Campo obrigatório',
      email: 'Por favor, insira um e-mail válido',
      minLength: 'Mínimo de 6 caracteres',
    }
    return {
      form: {
        name: { required: helpers.withMessage(messages.required, required) },
        email: {
          required: helpers.withMessage(messages.required, required),
          email: helpers.withMessage(messages.email, emailValidator),
        },
        cellphone: {
          required: helpers.withMessage(messages.required, required),
        },
        password: {
          // senha opcional, mas se preenchida precisa ter 6+ caracteres
          minLength: helpers.withMessage(messages.minLength, minLength(6)),
        },
      },
      companyForm: {
        companyName: {
          required: helpers.withMessage(
            'Nome da empresa é obrigatório',
            requiredIf(() => this.isOwner),
          ),
        },
        companyDocument: {
          required: helpers.withMessage(
            'Documento da empresa é obrigatório',
            requiredIf(() => this.isOwner),
          ),
        },
      },
    }
  },
  computed: {
    ...mapGetters({
      isSaving: 'user/getIsSaving',
      getUserFromStorage: 'auth/getUserFromStorage',
    }),
    isOwner() {
      return this.getUserFromStorage?.profile === 'owner'
    },
  },
  mounted() {
    const u = this.getUserFromStorage || {}
    this.form.name = u.name || ''
    this.form.email = u.email || ''
    this.form.cellphone = u.cellphone ? this.formatPhone(u.cellphone) : ''

    // Prefill empresa
    this.companyForm.companyName = u.partner || ''
    this.companyForm.companyDocumentType = u.companyDocumentType || 'CPF'
    this.companyForm.companyDocument = u.companyDocument || ''
  },
  methods: {
    ...mapActions({ updateUser: 'user/updateUser' }),

    formatPhone(phone) {
      const only = String(phone).replace(/\D/g, '')
      if (only.length >= 11) return `(${only.slice(0, 2)}) ${only.slice(2, 7)}-${only.slice(7, 11)}`
      if (only.length >= 10) return `(${only.slice(0, 2)}) ${only.slice(2, 6)}-${only.slice(6, 10)}`
      return phone
    },

    cleanPhoneNumber(phone) {
      return String(phone).replace(/\D/g, '')
    },

    async handleSubmit() {
      this.v$.$touch()
      if (this.v$.$invalid) return

      try {
        const body = {
          name: this.form.name,
          email: this.form.email,
          cellphone: this.cleanPhoneNumber(this.form.cellphone),
          ...(this.form.password && { password: this.form.password }),
          ...(this.isOwner && {
            companyName: this.companyForm.companyName,
            companyDocumentType: this.companyForm.companyDocumentType,
            companyDocument: this.companyForm.companyDocument,
          }),
        }

        await this.updateUser(body)
        this.handleNotification('success', 'Perfil atualizado com sucesso')
      } catch ({ message }) {
        this.handleNotification('error', message || 'Erro ao atualizar perfil')
      }
    },

    handleNotification(type, text) {
      this.$toast[type](text)
    },
  },
}
</script>

<style scoped lang="scss">
.users-card {
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>
