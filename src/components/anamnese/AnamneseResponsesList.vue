<template>
  <div>
    <div class="d-flex justify-content-between align-items-start mb-3">
      <h6 class="mb-0">Respostas de Anamnese</h6>
      <StandardButton variant="primary" class="mw-130" @click="openCreate">
        <IMdiPlus color="white" class="me-2" />
        Enviar anamnese
      </StandardButton>
    </div>

    <ReusableTable
      :items="responses"
      :fields="columns"
      :show-details="false"
      title=""
      :has-next-page="false"
      :loading="isLoading"
    >
      <template #cell(status)="{ item }"> {{ item.status || '-' }} </template>
      <template #actions="{ item }">
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

    <ConfirmModal
      :show="showDeleteModal"
      @update:show="(val) => (showDeleteModal = val)"
      title="Confirmar Exclusão"
      confirm-text="Remover"
      :loading="isSaving"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    >
      <p>Tem certeza que deseja excluir a resposta?</p>
    </ConfirmModal>

    <AnamneseResponseModal
      :show="showResModal"
      @update:show="(v) => (showResModal = v)"
      variantType="by-student"
      :clientId="clientId"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AnamneseResponseModal from '@/components/anamnese/AnamneseResponseModal.vue'

export default {
  name: 'AnamneseResponsesList',
  components: { AnamneseResponseModal },
  props: {
    clientId: { type: String, required: true },
  },
  data() {
    return {
      isLoading: false,
      showDeleteModal: false,
      showResModal: false,
      selectedResponse: null,
      responses: [],
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: '', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters({
      isSaving: 'anamneseRes/getIsSaving',
      responsesState: 'anamneseRes/getResponses',
    }),
  },
  watch: {
    responsesState: {
      handler(n) {
        if (!n) return
        this.responses = n.items || []
      },
      immediate: true,
    },
    clientId: {
      immediate: true,
      handler() {
        this.loadResponses()
      }
    }
  },
  methods: {
    ...mapActions({
      fetchClientResponses: 'anamneseRes/fetchClientResponses',
      deleteResponse: 'anamneseRes/deleteResponse',
    }),
    async loadResponses() {
      if (!this.clientId) return
      this.isLoading = true
      try {
        await this.fetchClientResponses({ clientId: this.clientId })
      } catch ({ message }) {
        this.$toast?.error?.(message)
      } finally {
        this.isLoading = false
      }
    },
    openCreate() { this.showResModal = true },
    confirmDelete(item) {
      this.selectedResponse = item
      this.showDeleteModal = true
    },
    async handleDelete() {
      try {
        await this.deleteResponse({ formResponseId: this.selectedResponse.id })
        this.$toast?.success?.('Resposta removida')
        this.showDeleteModal = false
        await this.loadResponses()
      } catch ({ message }) {
        this.$toast?.error?.(message)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.mw-130 { min-width: 130px; }
</style>


