<template>
  <ConfirmModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    :title="modalTitle"
    size="lg"
    confirm-text="Enviar"
    :loading="isSaving"
    :disable-button="!canSubmit"
    @close="$emit('update:show', false)"
    @confirm="handleConfirm"
  >
    <div class="mw-600">
      <div class="mb-3">
        <strong>Destino:</strong>
        <span v-if="resolvedClientName"> {{ resolvedClientName }} </span>
        <span v-else class="text-muted">Selecione o aluno</span>
      </div>

      <div class="mb-3">
        <strong>Formulário:</strong>
        <span v-if="resolvedFormName"> {{ resolvedFormName }} </span>
        <span v-else class="text-muted">Selecione o formulário</span>
      </div>

      <BRow>
        <BCol cols="12" md="6" v-if="shouldShowStudentSelect">
          <BFormGroup label="Aluno(s)">
            <BFormSelect v-model="selectedClientIds" :options="studentOptions" :multiple="true" />
          </BFormGroup>
        </BCol>
        <BCol cols="12" md="6" v-if="shouldShowFormSelect">
          <BFormGroup label="Formulário de anamnese">
            <BFormSelect v-model="selectedFormId" :options="formOptions" :disabled="!!formId" />
          </BFormGroup>
        </BCol>
      </BRow>
    </div>
  </ConfirmModal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

export default {
  name: 'AnamneseResponseModal',
  components: { ConfirmModal },
  props: {
    show: { type: Boolean, required: true },
    variantType: { type: String, default: 'by-student' }, // 'by-student' | 'by-form'
    clientId: { type: String, default: '' },
    clientName: { type: String, default: '' },
    formId: { type: String, default: '' },
    formName: { type: String, default: '' },
  },
  emits: ['update:show', 'created'],
  data() {
    return {
      isLoading: false,
      selectedClientId: '', // used for by-student (hidden select)
      selectedClientIds: [], // used for by-form (multi-select)
      selectedFormId: '',
      studentOptions: [],
      formOptions: [],
    }
  },
  computed: {
    ...mapGetters({
      isSaving: 'anamneseRes/getIsSaving',
      authUser: 'auth/getUserFromStorage',
      formsState: 'anamnese/getForms',
      studentsState: 'student/getStudents',
    }),
    modalTitle() {
      return 'Enviar formulário de anamnese'
    },
    shouldShowStudentSelect() {
      return this.variantType === 'by-form'
    },
    shouldShowFormSelect() {
      return this.variantType === 'by-student'
    },
    resolvedClientId() {
      return this.clientId || this.selectedClientId
    },
    resolvedFormId() {
      return this.formId || this.selectedFormId
    },
    resolvedClientName() {
      if (this.clientName) return this.clientName
      const found = (this.studentsState?.items || []).find(
        (s) => `${this.cleanPhoneNumber(s.cellphone)}` === `${this.resolvedClientId}`,
      )
      return found?.name || ''
    },
    resolvedFormName() {
      if (this.formName) return this.formName
      const found = (this.formsState?.items || []).find((f) => `${f.id}` === `${this.resolvedFormId}`)
      return found?.name || ''
    },
    canSubmit() {
      if (this.variantType === 'by-student') {
        return !!this.resolvedClientId && !!this.selectedFormId
      }
      // by-form
      return this.selectedClientIds.length > 0 && !!this.resolvedFormId
    },
  },
  watch: {
    show: {
      immediate: true,
      async handler(val) {
        if (val) {
          this.bootstrap()
        }
      },
    },
  },
  methods: {
    ...mapActions({
      fetchForms: 'anamnese/fetchForms',
      fetchStudents: 'student/fetchStudents',
      createResponse: 'anamneseRes/createResponse',
    }),
    cleanPhoneNumber(phone) {
      return (phone || '').replace(/\D/g, '')
    },
    async bootstrap() {
      try {
        this.isLoading = true
        const promises = []
        if (!this.formId) promises.push(this.fetchForms())
        if (!this.clientId) {
          const teacherId = this.authUser?.username
          if (teacherId) {
            promises.push(this.fetchStudents({ params: { limit: 100 }, teacherId }))
          }
        }
        await Promise.all(promises)
        this.studentOptions = [{ value: '', text: 'Selecione' }].concat(
          (this.studentsState?.items || []).map((s) => ({ value: this.cleanPhoneNumber(s.cellphone), text: s.name })),
        )
        this.formOptions = [{ value: '', text: 'Selecione' }].concat(
          (this.formsState?.items || []).map((f) => ({ value: f.id, text: f.name })),
        )
        if (this.clientId) this.selectedClientId = this.clientId
        if (this.formId) this.selectedFormId = this.formId
      } catch (e) {
        console.error(e)
        this.$toast?.error?.('Não foi possível carregar os dados')
      } finally {
        this.isLoading = false
      }
    },
    async handleConfirm() {
      try {
        if (this.variantType === 'by-student') {
          await this.createResponse({ clientId: this.resolvedClientId, formId: this.selectedFormId })
          this.$toast?.success?.('Solicitação enviada ao aluno')
        } else {
          const results = await Promise.allSettled(
            (this.selectedClientIds || []).map((id) =>
              this.createResponse({ clientId: id, formId: this.resolvedFormId }),
            ),
          )
          const fulfilled = results.filter((r) => r.status === 'fulfilled').length
          const rejected = results.length - fulfilled
          if (fulfilled > 0)
            this.$toast?.success?.(`${fulfilled} solicitaç${fulfilled === 1 ? 'ão' : 'ões'} enviada(s)`)
          if (rejected > 0) this.$toast?.error?.(`${rejected} falha(s) ao enviar`)
        }
        this.$emit('created')
        this.$emit('update:show', false)
      } catch ({ message }) {
        this.$toast?.error?.(message)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.mw-600 {
  max-width: 600px;
}
</style>
