<template>
  <BCard no-body class="student-details-card">
    <BCardBody class="p-4">
      <!-- Informações do Aluno -->
      <div class="student-info mb-4">
        <div class="d-flex align-items-center">
          <div class="avatar-container me-3">
            <img v-if="student?.avatar" :src="student.avatar" :alt="`Avatar de ${student?.name}`" class="avatar-img" />
            <div v-else class="avatar-default">
              <MdiUserCircle />
            </div>
          </div>
          <div>
            <h3 class="mb-2">{{ student?.name }}</h3>
            <p class="text-muted mb-1">{{ $formatPhone(student?.cellphone) }}</p>
            <p class="text-muted small">Cadastrado em {{ $formatDateUtc(student?.createdAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Lista de Treinos -->
      <div class="trainings-section">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="mb-0">Treinos</h4>
          <StandardButton variant="primary" class="mw-130" @click="openNewTrainingModal">
            <IMdiPlus color="white" class="me-2" />
            Novo treino
          </StandardButton>
        </div>

        <ReusableTable
          :items="trainings"
          :fields="trainingColumns"
          :show-details="true"
          title="Lista de Treinos"
          :has-next-page="!!nextPageId"
          :loading="isLoading"
          @load-more="handleLoadMore"
          @row-clicked="showTrainingDetails"
        >
          <template #details="{ item }">
            <div class="p-3">
              <h5>Detalhes do Treino</h5>
              <p>{{ item.description }}</p>
              <!-- Adicione mais detalhes do treino conforme necessário -->
            </div>
          </template>
        </ReusableTable>
      </div>
    </BCardBody>
  </BCard>

  <!-- Modal de Novo Treino -->
  <ConfirmModal
    :show="showModal"
    @update:show="(val) => (showModal = val)"
    title="Novo Treino"
    size="lg"
    confirm-text="Salvar"
    :loading="isSaving"
    :disable-button="v$.form.$invalid || v$exercises.exercises.$invalid"
    @close="showModal = false"
    @confirm="handleSubmit"
  >
    <div class="row g-3">
      <div class="col-12 col-md-6">
        <InputField
          v-model="form.workoutNumber"
          label="Número do Treino"
          type="number"
          :error="v$.form.workoutNumber.$errors[0]?.$message"
        />
      </div>
      <div class="col-12 col-md-6">
        <InputField
          v-model="form.workoutName"
          label="Nome do Treino"
          :error="v$.form.workoutName.$errors[0]?.$message"
        />
      </div>
      <div class="col-12">
        <InputField
          v-model="form.workoutDescription"
          label="Descrição"
          type="textarea"
          :error="v$.form.workoutDescription.$errors[0]?.$message"
        />
      </div>
      <div class="col-12">
        <label class="form-label">Dias da Semana</label>
        <div class="d-flex flex-wrap gap-2">
          <BFormCheckbox
            v-for="day in availableDays"
            :key="day.value"
            v-model="form.days"
            :value="day.value"
            :error="v$.form.days.$errors[0]?.$message"
          >
            {{ day.text }}
          </BFormCheckbox>
        </div>
      </div>

      <!-- Lista de Exercícios -->
      <div class="col-12">
        <h5 class="mb-3">Exercícios</h5>
        <div v-for="(exercise, index) in form.exercises" :key="index" class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h6 class="card-title mb-0">Exercício {{ index + 1 }}</h6>
              <BButton variant="danger" size="sm" @click="removeExercise(index)">
                <IMdiTrashOutline color="white" />
              </BButton>
            </div>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <InputField
                  v-model="exercise.exerciseName"
                  label="Nome do Exercício"
                  :error="v$exercises.exercises.$each.$response.$errors[index]?.exerciseName?.[0]?.$message"
                />
              </div>
              <div class="col-12 col-md-6">
                <InputField
                  v-model="exercise.description"
                  label="Descrição"
                  :error="v$exercises.exercises.$each.$response.$errors[index]?.description?.[0]?.$message"
                />
              </div>

              <!-- Steps do Exercício -->
              <div class="col-12">
                <h6 class="mb-3">Séries</h6>
                <div v-for="(step, stepIndex) in exercise.steps" :key="stepIndex" class="card mb-2">
                  <div class="card-body">
                    <div class="row g-3">
                      <div class="col-12">
                        <InputField
                          v-model="step.description"
                          label="Descrição"
                          :error="
                            v$exercises.exercises.$each.$response.$errors[index]?.steps?.$each?.$response.$errors[
                              stepIndex
                            ]?.description?.[0]?.$message
                          "
                        />
                      </div>
                      <div class="col-6">
                        <InputField
                          v-model="step.repetitions"
                          label="Repetições"
                          type="number"
                          :error="
                            v$exercises.exercises.$each.$response.$errors[index]?.steps?.$each?.$response.$errors[
                              stepIndex
                            ]?.repetitions?.[0]?.$message
                          "
                        />
                      </div>
                      <div class="col-6">
                        <InputField
                          v-model="step.weight"
                          label="Peso (kg)"
                          type="number"
                          :error="
                            v$exercises.exercises.$each.$response.$errors[index]?.steps?.$each?.$response.$errors[
                              stepIndex
                            ]?.weight?.[0]?.$message
                          "
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <BButton variant="outline-primary" size="sm" class="mt-2" @click="addStep(exercise)">
                  <IMdiPlus color="white" class="me-2" />
                  Adicionar Série
                </BButton>
              </div>
            </div>
          </div>
        </div>
        <BButton variant="outline-primary" @click="addExercise">
          <IMdiPlus color="white" class="me-2" /> Adicionar Exercício
        </BButton>
      </div>
    </div>
  </ConfirmModal>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { mapGetters, mapActions } from 'vuex'
import MdiUserCircle from '~icons/mdi/user-circle'
import { studentService } from '@/services'
import { trainingValidations, exercisesValidations } from '@/validators/training.validator'

export default {
  name: 'StudentDetails',
  components: { MdiUserCircle },
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  validations() {
    return {
      ...trainingValidations,
      ...exercisesValidations,
    }
  },
  data() {
    return {
      perPage: 10,
      nextPageId: null,
      isLoading: false,
      showModal: false,
      student: null,
      trainings: [],
      form: {
        workoutNumber: '',
        workoutName: '',
        workoutDescription: '',
        days: [],
        exercises: [],
      },
      trainingColumns: [
        { key: 'workoutNumber', label: 'Número' },
        { key: 'workoutName', label: 'Nome do Treino' },
        { key: 'workoutDescription', label: 'Descrição' },
        { key: 'days', label: 'Dias', formatter: (value) => value.join(', ') },
        { key: 'actions', label: '', sortable: false },
      ],
      availableDays: [
        { value: 1, text: 'Segunda' },
        { value: 2, text: 'Terça' },
        { value: 3, text: 'Quarta' },
        { value: 4, text: 'Quinta' },
        { value: 5, text: 'Sexta' },
        { value: 6, text: 'Sábado' },
        { value: 7, text: 'Domingo' },
      ],
      currentExercise: {
        exerciseName: '',
        description: '',
        steps: [
          {
            description: '',
            repetitions: null,
            weight: null,
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'training/getIsSaving',
      getTrainings: 'training/getTrainings',
      getUserFromStorage: 'auth/getUserFromStorage',
    }),
    studentId() {
      return this.$route.params.id
    },
  },
  watch: {
    getTrainings: {
      handler(newValue) {
        if (newValue) {
          if (!this.nextPageId) {
            this.trainings = newValue.items || []
          } else {
            this.trainings = [...this.trainings, ...(newValue.items || [])]
          }
          this.nextPageId = newValue.nextPageId || null
        }
      },
      immediate: true,
    },
  },
  async created() {
    // Carrega os dados do aluno quando o componente é criado
    if (this.id) {
      try {
        const response = await studentService.getStudentDetails(this.id)
        this.student = response.data
      } catch (error) {
        console.error('Erro ao carregar detalhes do aluno:', error)
        this.$toast.error('Erro ao carregar detalhes do aluno')
      }
    }
  },
  methods: {
    ...mapActions({
      fetchTrainings: 'training/fetchTrainings',
      createTraining: 'training/createTraining',
      updateTraining: 'training/updateTraining',
      deleteTraining: 'training/deleteTraining',
    }),

    async handleFetchTrainings() {
      this.isLoading = true
      try {
        const params = {
          limit: this.perPage,
        }

        if (this.nextPageId) {
          params.startFrom = {
            SK: this.nextPageId.SK,
          }
        }

        await this.fetchTrainings({
          params,
          studentId: this.studentId,
        })
      } catch ({ message }) {
        this.handleNotification('error', message)
      } finally {
        this.isLoading = false
      }
    },

    async handleLoadMore() {
      if (this.nextPageId?.SK) {
        await this.handleFetchTrainings()
      }
    },

    openNewTrainingModal() {
      this.form = {
        workoutNumber: '',
        workoutName: '',
        workoutDescription: '',
        days: [],
        exercises: [
          {
            exerciseName: '',
            description: '',
            steps: [
              {
                description: '',
                repetitions: null,
                weight: null,
              },
            ],
          },
        ],
      }
      this.v$.$reset()
      this.v$exercises.$reset()
      this.showModal = true
    },

    showTrainingDetails(training) {
      // Implemente a lógica para mostrar detalhes do treino
      console.log('Training details:', training)
    },

    addExercise() {
      this.form.exercises.push({
        exerciseName: '',
        description: '',
        steps: [
          {
            description: '',
            repetitions: null,
            weight: null,
          },
        ],
      })
    },

    removeExercise(index) {
      this.form.exercises.splice(index, 1)
    },

    addStep(exercise) {
      exercise.steps.push({
        description: '',
        repetitions: null,
        weight: null,
      })
    },

    async handleSubmit() {
      this.v$.$touch()
      this.v$exercises.$touch()
      if (this.v$.form.$invalid || this.v$exercises.exercises.$invalid) return

      try {
        await this.createTraining({
          ...this.form,
          userId: this.studentId,
        })

        this.handleNotification('success', 'Treino criado com sucesso')
        this.showModal = false
        this.nextPageId = null
        await this.handleFetchTrainings()
      } catch ({ message }) {
        this.handleNotification('error', message)
      }
    },

    handleNotification(type, text) {
      this.$toast[type](text)
    },
  },
}
</script>

<style scoped lang="scss">
.student-details-card {
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-default {
  width: 100%;
  height: 100%;
  background-color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.mw-130 {
  min-width: 130px;
}

@media (max-width: 768px) {
  .student-details-card {
    border-radius: 0;
  }
}
</style>
