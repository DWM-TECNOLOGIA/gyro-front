<template>
  <BCard no-body class="users-card">
    <BCardBody class="p-4">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-start mb-4 w-100">
        <StandardButton variant="primary" class="w-auto text-nowrap" @click="openNewTeacherModal()">
          <IMdiPlus color="white" class="me-2" />
          Novo professor
        </StandardButton>
      </div>

      <!-- Tabela de Professores -->
      <ReusableTable
        :items="teachers"
        :fields="teacherColumns"
        :show-details="false"
        title="Meus professores"
        :avatarFieldsConfig="avatarConfig"
        :has-next-page="!!nextPageId"
        :loading="isLoading"
        @load-more="handleLoadMore"
      />
    </BCardBody>
  </BCard>

  <!-- Modal de Professor -->
  <ConfirmModal
    :show="showModal"
    @update:show="(val) => (showModal = val)"
    :title="`${formType} Professor`"
    size="lg"
    confirm-text="Salvar"
    :loading="isSaving"
    :disable-button="v$.form.$invalid"
    @close="showModal = false"
    @confirm="handleSubmit"
  >
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
      id="phone"
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
      label="Senha"
      class="mt-3"
      :type="isPasswordVisible ? 'text' : 'password'"
      placeholder="Digite a senha"
      v-model="form.password"
      :errors="v$.form.password.$errors"
      :dirty="v$.form.password.$dirty"
      @blur="v$.form.password.$touch"
    >
      <template #append>
        <PasswordToggle v-model="isPasswordVisible" />
      </template>
    </InputField>
  </ConfirmModal>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers, email as emailValidator } from '@vuelidate/validators'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TeachersList',
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      isPasswordVisible: false,
      perPage: 10,
      nextPageId: null,
      isLoading: false,
      showModal: false,
      formType: 'Novo',
      form: {
        name: '',
        email: '',
        cellphone: '',
        password: '',
      },
      teachers: [],
      teacherColumns: [
        { key: 'avatar', label: '' },
        { key: 'name', label: 'Nome' },
        { key: 'cellphone', label: 'Telefone', formatter: '$formatPhone' },
        { key: 'createdAt', label: 'Cadastrado em', formatter: '$formatDateUtc' },
      ],
      avatarConfig: [
        {
          key: 'avatar',
          nameField: 'name',
        },
      ],
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
          required: helpers.withMessage(messages.required, required),
          minLength: helpers.withMessage(messages.minLength, minLength(6)),
        },
      },
    }
  },
  computed: {
    ...mapGetters({
      isSaving: 'user/getIsSaving',
      getUsers: 'user/getUsers',
      getUserFromStorage: 'auth/getUserFromStorage',
    }),
    mountedUsers() {
      return this.getUsers
    },
  },
  watch: {
    mountedUsers: {
      handler(newValue) {
        if (newValue) {
          if (!this.nextPageId) {
            this.teachers = newValue.items || []
          } else {
            this.teachers = [...this.teachers, ...(newValue.items || [])]
          }
          this.nextPageId = newValue.nextPageId || null
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.handleFetchTeachers()
  },
  methods: {
    ...mapActions({
      fetchUsers: 'user/fetchUsers',
      createUser: 'user/createUser',
    }),

    cleanPhoneNumber(phone) {
      return phone.replace(/\D/g, '')
    },

    async handleFetchTeachers() {
      this.isLoading = true
      try {
        const params = { limit: this.perPage, profile: 'teacher', companyId: this.getUserFromStorage?.companyId }
        if (this.nextPageId) {
          params.startFrom = { SK: this.nextPageId.SK, PK: this.nextPageId.PK }
        }
        await this.fetchUsers(params)
      } catch ({ message }) {
        this.handleNotification('error', message)
      } finally {
        this.isLoading = false
      }
    },

    async handleLoadMore() {
      if (this.nextPageId?.SK) {
        await this.handleFetchTeachers()
      }
    },

    openNewTeacherModal() {
      this.formType = 'Novo'
      this.form = {
        name: '',
        email: '',
        cellphone: '',
        password: '',
      }
      this.v$.form.$reset()
      this.showModal = true
    },

    async handleSubmit() {
      this.v$.$touch()
      if (this.v$.$invalid) return

      try {
        const body = {
          name: this.form.name,
          email: this.form.email,
          cellphone: this.cleanPhoneNumber(this.form.cellphone),
          password: this.form.password,
          profile: 'teacher',
          companyId: this.getUserFromStorage?.companyId,
        }

        await this.createUser(body)
        this.handleNotification('success', 'Professor criado com sucesso')
        this.showModal = false

        this.nextPageId = null
        await this.handleFetchTeachers()
      } catch ({ message }) {
        this.handleNotification('error', message || 'Erro ao criar professor')
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

.mw-130 {
  min-width: 130px;
}

.data-table {
  :deep(th) {
    background-color: var(--bs-gray-100);
    font-weight: 600;
  }
}

@media (max-width: 768px) {
  .users-card {
    border-radius: 0;
  }
}
</style>
