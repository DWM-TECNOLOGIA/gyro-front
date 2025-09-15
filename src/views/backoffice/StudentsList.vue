<template>
  <BCard no-body class="users-card">
    <BCardBody class="p-4">
      <!-- Filtros e Cabeçalho -->
      <div class="d-flex justify-content-between align-items-start mb-4 w-100">
        <StandardButton variant="primary" class="mw-130" @click="openNewStudentModal()">
          <IMdiPlus color="white" class="me-2" />
          Novo aluno
        </StandardButton>
      </div>

      <!-- Tabela de Usuários -->
      <ReusableTable
        :items="students"
        :fields="userColumns"
        :show-details="false"
        title="Meus alunos"
        :avatarFieldsConfig="avatarConfig"
        :has-next-page="!!nextPageId"
        :loading="isLoading"
        @load-more="handleLoadMore"
      >
        <template #actions="{ item }">
          <BButton
            variant="link"
            class="p-0 text-primary"
            v-b-tooltip.hover
            title="Ver detalhes"
            @click.stop="handleViewDetails(item)"
          >
            <IMdiAccountEyeOutline color="white" />
          </BButton>
        </template>
      </ReusableTable>
    </BCardBody>
  </BCard>

  <!-- Modal de Aluno -->
  <ConfirmModal
    :show="showModal"
    @update:show="(val) => (showModal = val)"
    :title="`${formType} Aluno`"
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

    <CheckboxField class="mt-3" id="must-send-message" name="must-send-message" v-model="form.mustSendMessage">
      Enviar mensagens?
    </CheckboxField>
  </ConfirmModal>

  <ConfirmModal
    :show="showDeleteModal"
    @update:show="(val) => (showDeleteModal = val)"
    title="Confirmar Exclusão"
    confirm-text="Remover"
    :loading="isSaving"
    @close="showDeleteModal = false"
    @confirm="confirmDelete"
  >
    <p>
      Tem certeza que deseja excluir o aluno
      <strong>{{ selectedStudent?.name }}</strong
      >?
    </p>
  </ConfirmModal>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { studentValidations } from '@/validators/student.validator'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UsersView',
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      isPasswordVisible: false,
      searchName: '',
      perPage: 10,
      nextPageId: null,
      isLoading: false,
      showModal: false,
      showDeleteModal: false,
      formType: 'Novo',
      form: {
        cellphone: '',
        name: '',
        password: '',
        mustSendMessage: false,
        profile: 'student',
      },
      selectedStudent: null,
      students: [],
      userColumns: [
        { key: 'avatar', label: '' },
        { key: 'name', label: 'Nome' },
        { key: 'cellphone', label: 'Telefone', formatter: '$formatPhone' },
        { key: 'createdAt', label: 'Cadastrado em', formatter: '$formatDateUtc' },
        { key: 'actions', label: '', sortable: false },
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
    return studentValidations
  },
  computed: {
    ...mapGetters({
      isAuthLoading: 'auth/getIsSaving',
      isSaving: 'student/getIsSaving',
      getStudents: 'student/getStudents',
      getUserFromStorage: 'auth/getUserFromStorage',
    }),
    mountedStudents() {
      return this.getStudents
    },
  },
  watch: {
    mountedStudents: {
      handler(newValue) {
        if (newValue) {
          // Se for a primeira página, substitui os dados
          if (!this.nextPageId) {
            this.students = newValue.items || []
          } else {
            // Se for "carregar mais", concatena com os dados existentes
            this.students = [...this.students, ...(newValue.items || [])]
          }
          this.nextPageId = newValue.nextPageId || null
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.handleFetchStudents()
  },
  methods: {
    ...mapActions({
      fetchStudents: 'student/fetchStudents',
      createStudent: 'student/createStudent',
      updateStudent: 'student/updateStudent',
      deleteStudent: 'student/deleteStudent',
      assignToTeacher: 'student/assignToTeacher',
    }),

    // Função para limpar o número de telefone
    cleanPhoneNumber(phone) {
      return phone.replace(/\D/g, '')
    },

    async handleFetchStudents() {
      this.isLoading = true
      try {
        const params = {
          limit: this.perPage,
        }

        // Adiciona startFrom apenas se houver nextPageId
        if (this.nextPageId) {
          params.startFrom = {
            SK: this.nextPageId.SK,
            PK: this.nextPageId.PK,
          }
        }

        await this.fetchStudents({
          params,
          teacherId: this.getUserFromStorage.username,
        })
      } catch ({ message }) {
        this.handleNotification('error', message)
      } finally {
        this.isLoading = false
      }
    },

    async handleLoadMore() {
      if (this.nextPageId?.SK) {
        await this.handleFetchStudents()
      }
    },

    openNewStudentModal() {
      this.formType = 'Novo'
      this.form = {
        ...this.form,
        cellphone: '',
        name: '',
        password: '',
        mustSendMessage: false,
      }
      this.v$.form.$reset()
      this.showModal = true
    },

    showDetails(user) {
      this.formType = 'Editar'
      this.form = { ...user }
      this.showModal = true
    },

    showDeleteConfirm(user) {
      this.selectedStudent = user
      this.showDeleteModal = true
    },

    async confirmDelete() {
      try {
        await this.deleteStudent(this.selectedStudent.id)
        this.handleNotification('success', 'Aluno removido com sucesso')

        // Reseta a paginação ao deletar
        this.nextPageId = null
        await this.handleFetchStudents()
        this.showDeleteModal = false
      } catch ({ message }) {
        this.handleNotification('error', message)
      }
    },

    async handleSubmit() {
      this.v$.$touch()
      if (this.v$.$invalid) return

      try {
        // Cria uma cópia do form com o telefone limpo
        const formData = {
          ...this.form,
          cellphone: this.cleanPhoneNumber(this.form.cellphone),
        }

        if (this.formType === 'Novo') {
          await this.createStudent(formData)
          await this.assignToTeacher({
            teacherId: this.getUserFromStorage.username,
            body: { cellphone: formData.cellphone },
          })
        } else {
          await this.updateStudent(formData)
        }

        this.handleNotification('success', `Aluno ${this.formType === 'Novo' ? 'criado' : 'atualizado'} com sucesso`)
        this.showModal = false

        // Reseta a paginação ao criar/atualizar
        this.nextPageId = null
        await this.handleFetchStudents()
      } catch ({ message }) {
        this.handleNotification('error', message)
      }
    },

    handleNotification(type, text) {
      this.$toast[type](text)
    },

    handleViewDetails(student) {
      this.$router.push({
        name: 'student-details',
        params: { id: this.cleanPhoneNumber(student.cellphone) },
      })
    },
  },
}
</script>

<style scoped lang="scss">
.users-view {
  padding: 2rem 0;
}

.users-card {
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.mw-400 {
  max-width: 400px;
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
  .users-container {
    padding: 0;
  }

  .users-card {
    border-radius: 0;
  }
}
</style>
