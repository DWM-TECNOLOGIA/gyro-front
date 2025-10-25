<template>
  <BCard no-body class="users-card">
    <BCardBody class="p-4">
      <div class="d-flex justify-content-between align-items-start mb-4 w-100">
        <StandardButton variant="primary" class="w-auto text-nowrap" @click="handleCreate()">
          <IMdiPlus color="white" class="me-2" />
          Novo formulário
        </StandardButton>
      </div>

      <ReusableTable
        :items="forms"
        :fields="columns"
        :show-details="false"
        title="Formulários de Anamnese"
        :has-next-page="false"
        :loading="isLoading"
      >
        <template #cell(questions)="{ item }"> {{ item.questions?.length || 0 }} perguntas </template>

        <template #actions="{ item }">
          <BButton
            variant="link"
            class="p-0 me-3"
            v-b-tooltip.hover
            title="Enviar anamnese"
            @click.stop="openResByForm(item)"
          >
            Enviar
          </BButton>
          <BButton
            variant="link"
            class="p-0 text-primary me-3"
            v-b-tooltip.hover
            title="Editar"
            @click.stop="handleEdit(item)"
          >
            <IMdiPencil color="white" />
          </BButton>
          <BButton
            variant="link"
            class="p-0 text-danger"
            v-b-tooltip.hover
            title="Excluir"
            @click.stop="confirmDelete(item)"
          >
            <IMdiTrashCanOutline color="white" />
          </BButton>
        </template>
      </ReusableTable>
    </BCardBody>
  </BCard>

  <!-- Modal: Criar/Editar Formulário -->
  <ConfirmModal
    :show="showFormModal"
    @update:show="(val) => (showFormModal = val)"
    :title="`${formType} formulário`"
    size="lg"
    confirm-text="Salvar"
    :loading="isSaving"
    :disable-button="!canSave"
    @close="showFormModal = false"
    @confirm="handleSubmit"
  >
    <AnamneseForm v-model="formModel" />
  </ConfirmModal>

  <!-- Modal: Enviar Formulário para aluno -->
  <AnamneseResponseModal
    :show="showResModal"
    @update:show="(v) => (showResModal = v)"
    variantType="by-form"
    :formId="resForm?.id"
    :formName="resForm?.name"
  />

  <ConfirmModal
    :show="showDeleteModal"
    @update:show="(val) => (showDeleteModal = val)"
    title="Confirmar Exclusão"
    confirm-text="Remover"
    :loading="isSaving"
    @close="showDeleteModal = false"
    @confirm="handleDelete"
  >
    <p>
      Tem certeza que deseja excluir o formulário
      <strong>{{ selectedForm?.name }}</strong
      >?
    </p>
  </ConfirmModal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AnamneseForm from '@/components/anamnese/AnamneseForm.vue'
import AnamneseResponseModal from '@/components/anamnese/AnamneseResponseModal.vue'

export default {
  name: 'AnamneseFormsList',
  components: { AnamneseForm, AnamneseResponseModal },
  data() {
    return {
      isLoading: false,
      showFormModal: false,
      showDeleteModal: false,
      showResModal: false,
      selectedForm: null,
      formType: 'Novo',
      formModel: { name: '', questions: [] },
      resForm: null,
      forms: [],
      columns: [
        { key: 'name', label: 'Nome' },
        { key: 'questions', label: 'Perguntas' },
        { key: 'actions', label: '', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters({
      isSaving: 'anamnese/getIsSaving',
      getForms: 'anamnese/getForms',
    }),
    canSave() {
      return !!this.formModel?.name && this.formModel.name.trim().length > 0
    },
  },
  watch: {
    getForms: {
      handler(newValue) {
        if (newValue) {
          this.forms = newValue.items || []
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.loadForms()
  },
  methods: {
    ...mapActions({
      fetchForms: 'anamnese/fetchForms',
      deleteForm: 'anamnese/deleteForm',
      createForm: 'anamnese/createForm',
      updateForm: 'anamnese/updateForm',
    }),
    async loadForms() {
      this.isLoading = true
      try {
        await this.fetchForms()
      } catch ({ message }) {
        this.$toast.error(message)
      } finally {
        this.isLoading = false
      }
    },
    handleCreate() {
      this.formType = 'Novo'
      this.formModel = { name: '', questions: [] }
      this.showFormModal = true
    },
    handleEdit(item) {
      this.formType = 'Editar'
      this.formModel = {
        name: item.name || '',
        questions: (item.questions || []).map((q, idx) => ({
          localId: `${q.id || Math.random().toString(36).slice(2)}`,
          id: q.id ?? idx + 1,
          name: q.name,
          type: q.type,
          required: !!q.required,
        })),
        id: item.id,
      }
      this.showFormModal = true
    },
    openResByForm(item) {
      this.resForm = { id: item.id, name: item.name }
      this.showResModal = true
    },
    confirmDelete(item) {
      this.selectedForm = item
      this.showDeleteModal = true
    },
    async handleSubmit() {
      const payload = {
        name: this.formModel.name,
        questions: (this.formModel.questions || []).map((q, idx) => ({
          id: q.id ?? idx + 1,
          name: q.name,
          type: q.type,
          required: !!q.required,
        })),
      }

      try {
        if (this.formType === 'Novo') {
          await this.createForm(payload)
        } else {
          await this.updateForm({ formId: this.formModel.id, body: payload })
        }
        this.$toast.success(`Formulário ${this.formType === 'Novo' ? 'criado' : 'atualizado'} com sucesso`)
        this.showFormModal = false
        await this.loadForms()
      } catch ({ message }) {
        this.$toast.error(message)
      }
    },
    async handleDelete() {
      try {
        await this.deleteForm(this.selectedForm.id)
        this.$toast.success('Formulário removido com sucesso')
        await this.loadForms()
        this.showDeleteModal = false
      } catch ({ message }) {
        this.$toast.error(message)
      }
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
</style>
