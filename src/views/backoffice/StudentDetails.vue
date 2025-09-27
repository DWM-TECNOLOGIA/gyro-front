<template>
  <div class="student-details">
    <StudentHeader :student="student" @edit="onEditProfile" />

    <div class="mt-3">
      <StudentPipeline :stages="pipelineStages" />
    </div>

    <BCard no-body class="mt-3">
      <BCardHeader>
        <BTabs v-model="activeTab" small class="student-tabs">
          <BTab title="Progresso" title-item-class="px-3" lazy>
            <div class="p-3">
              <StudentProgress>
                <template #ai>
                  <StudentAIAnalysis />
                </template>
              </StudentProgress>
            </div>
          </BTab>
          <BTab title="Fotos" title-item-class="px-3" lazy>
            <div class="p-3">
              <StudentPhotos :photos="photos" @upload="onUploadPhoto" />
            </div>
          </BTab>
          <BTab title="Treinos" title-item-class="px-3" lazy>
            <div class="p-3">
              <StudentTrainings
                :items="trainings"
                :fields="trainingColumns"
                :has-next-page="!!nextPageId"
                :loading="isTrainingsLoading"
                @load-more="handleLoadMore"
                @open="showTrainingDetails"
                @create="openNewTrainingModal"
              />
            </div>
          </BTab>
          <BTab title="Dietas" title-item-class="px-3" lazy>
            <div class="p-3">
              <StudentDiets @create="onCreateDiet" />
            </div>
          </BTab>
          <BTab title="Configurações" title-item-class="px-3" lazy>
            <div class="p-3">
              <StudentSettings :settings="settings" @save="onSaveSettings" />
            </div>
          </BTab>
        </BTabs>
      </BCardHeader>
    </BCard>

    <ConfirmModal
      :show="showModal"
      @update:show="(val) => (showModal = val)"
      title="Novo treino"
      size="lg"
      confirm-text="Salvar"
      :loading="isTrainingsLoading"
      :disable-button="false"
      @close="showModal = false"
      @confirm="handleSubmit"
    >
      <div class="placeholder-graph">Placeholder do formulário de treino</div>
    </ConfirmModal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import StudentHeader from '@/components/student/StudentHeader.vue'
import StudentPipeline from '@/components/student/StudentPipeline.vue'
import StudentProgress from '@/components/student/StudentProgress.vue'
import StudentPhotos from '@/components/student/StudentPhotos.vue'
import StudentTrainings from '@/components/student/StudentTrainings.vue'
import StudentDiets from '@/components/student/StudentDiets.vue'
import StudentSettings from '@/components/student/StudentSettings.vue'
import StudentAIAnalysis from '@/components/student/StudentAIAnalysis.vue'

export default {
  name: 'StudentDetails',
  components: {
    StudentHeader,
    StudentPipeline,
    StudentProgress,
    StudentPhotos,
    StudentTrainings,
    StudentDiets,
    StudentSettings,
    StudentAIAnalysis,
  },
  data() {
    return {
      activeTab: 0,
      showModal: false,
      nextPageId: null,
      student: {},
      photos: [],
      trainings: [],
      settings: { photoPeriod: 'weekly', trainingPeriod: 'weekly', dietPeriod: 'weekly' },
      pipelineStages: [
        { key: 'profile', title: 'Ficha de respostas', subtitle: 'Cadastro', state: 'pending', stateLabel: 'Pendente' },
        { key: 'photos', title: 'Fotos', subtitle: 'Histórico de uploads', state: 'done', stateLabel: 'Concluído' },
        { key: 'training', title: 'Treino atual', subtitle: 'Plano ativo', state: 'pending', stateLabel: 'Pendente' },
        { key: 'diet', title: 'Dieta atual', subtitle: 'Plano ativo', state: 'pending', stateLabel: 'Pendente' },
        { key: 'renewal', title: 'Renovação', subtitle: 'Vencimento', state: 'overdue', stateLabel: 'Vencido' },
      ],
      trainingColumns: [
        { key: 'workoutNumber', label: 'Número' },
        { key: 'workoutName', label: 'Nome do treino' },
        { key: 'workoutDescription', label: 'Descrição' },
        { key: 'days', label: 'Dias', formatter: (value) => (value || []).join(', ') },
        { key: 'actions', label: '', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters({
      isTrainingsLoading: 'training/getIsSaving',
      getTrainings: 'training/getTrainings',
      getUserFromStorage: 'auth/getUserFromStorage',
      getSelectedStudent: 'student/getSelectedStudent',
      getStudentPhotos: 'student/getStudentPhotos',
      getStudentSettings: 'student/getStudentSettings',
    }),
    studentId() {
      return this.$route.params.id
    },
  },
  watch: {
    getTrainings: {
      handler(newValue) {
        if (!newValue) return
        this.trainings = this.nextPageId ? [...this.trainings, ...(newValue.items || [])] : newValue.items || []
        this.nextPageId = newValue.nextPageId || null
      },
      immediate: true,
    },
  },
  mounted() {
    this.bootstrapData()
  },
  methods: {
    ...mapActions({
      fetchTrainings: 'training/fetchTrainings',
      fetchStudentDetails: 'student/fetchStudentDetails',
      fetchStudentPhotos: 'student/fetchStudentPhotos',
      fetchStudentSettings: 'student/fetchStudentSettings',
    }),
    async bootstrapData() {
      await Promise.all([
        this.fetchStudentDetails({ studentId: this.studentId }),
        this.fetchStudentPhotos({ studentId: this.studentId }),
        this.fetchStudentSettings({ studentId: this.studentId }),
      ])
      this.student = this.getSelectedStudent
      this.photos = this.getStudentPhotos
      this.settings = this.getStudentSettings
      this.handleFetchTrainings()
    },
    async handleFetchTrainings() {
      try {
        const params = { limit: 10 }
        if (this.nextPageId) params.startFrom = { SK: this.nextPageId.SK }
        await this.fetchTrainings({ params, studentId: this.studentId })
      } catch (e) {
        console.error(e)
        this.$toast?.error?.('Não foi possível carregar os treinos')
      }
    },
    handleLoadMore() {
      if (this.nextPageId?.SK) this.handleFetchTrainings()
    },
    onEditProfile() {
      /* placeholder */
    },
    onUploadPhoto() {
      /* placeholder */
    },
    onCreateDiet() {
      /* placeholder */
    },
    onSaveSettings() {
      this.$toast?.success?.('Configurações salvas')
    },
    showTrainingDetails(row) {
      console.log('open training', row)
    },
    openNewTrainingModal() {
      this.showModal = true
    },
    handleSubmit() {
      this.showModal = false
      this.$toast?.success?.('Treino criado')
    },
  },
}
</script>

<style scoped lang="scss">
.placeholder-graph {
  height: 160px;
  border: 1px dashed var(--bs-gray-400);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bs-gray-600);
}

.student-tabs :deep(.nav-tabs .nav-link) {
  color: #fff;

  &:hover:not(.active) {
    background-color: transparent !important;
  }

  &.active {
    color: #fff;
    font-weight: 700;
    border-bottom: none !important;
  }
}
</style>
