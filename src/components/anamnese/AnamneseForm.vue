<template>
  <BRow>
    <BCol sm="12" md="6" lg="6">
      <InputField id="name" label="Nome do formulário" type="text" placeholder="Digite o nome" v-model="form.name" />
    </BCol>

    <BCol cols="12">
      <div class="d-flex align-items-center justify-content-between my-3">
        <h6 class="mb-0">Perguntas</h6>
        <StandardButton variant="outline-primary" class="w-auto text-nowrap" @click="addQuestion">
          <IMdiPlus class="me-2" /> Adicionar pergunta
        </StandardButton>
      </div>

      <div v-if="form.questions.length === 0" class="text-muted">Nenhuma pergunta adicionada.</div>

      <div v-for="(q, idx) in form.questions" :key="q.localId" class="border rounded p-3 mb-3">
        <BRow>
          <BCol class="d-flex align-items-center">
            <InputField
              :id="`q-name-${idx}`"
              class="flex-fill"
              label="Pergunta"
              type="text"
              placeholder="Digite a pergunta"
              v-model="q.name"
            />
          </BCol>

          <BCol class="d-flex align-items-center">
            <BFormGroup label="Tipo" class="flex-fill">
              <BFormSelect v-model="q.type" :options="questionTypeOptions" full-width />
            </BFormGroup>
          </BCol>

          <BCol cols="2" class="d-flex align-items-center">
            <CheckboxField :id="`q-required-${idx}`" v-model="q.required">Obrigatória</CheckboxField>
          </BCol>

          <BCol cols="1" class="d-flex align-items-center">
            <BButton variant="link" class="text-danger p-0" @click="removeQuestion(idx)">
              <IMdiTrashCanOutline />
            </BButton>
          </BCol>
        </BRow>
      </div>
    </BCol>
  </BRow>
</template>

<script>
export default {
  name: 'AnamneseForm',
  props: {
    modelValue: {
      type: Object,
      default: () => ({ name: '', questions: [] }),
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      localForm: { name: '', questions: [] },
      questionTypeOptions: [
        { value: 'text', text: 'Texto' },
        { value: 'number', text: 'Número' },
        { value: 'boolean', text: 'Sim/Não' },
      ],
    }
  },
  computed: {
    form: {
      get() {
        return this.localForm
      },
      set(v) {
        this.localForm = v
        this.$emit('update:modelValue', v)
      },
    },
  },
  watch: {
    modelValue: {
      handler(n) {
        const mapped = {
          name: n?.name || '',
          questions: (n?.questions || []).map((q) => ({
            localId: `${q.id || Math.random().toString(36).slice(2)}`,
            id: q.id,
            name: q.name,
            type: q.type || 'text',
            required: !!q.required,
          })),
        }
        this.localForm = JSON.parse(JSON.stringify(mapped))
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    addQuestion() {
      this.form = {
        ...this.form,
        questions: [
          ...this.form.questions,
          { localId: Math.random().toString(36).slice(2), name: '', type: 'text', required: false },
        ],
      }
    },
    removeQuestion(index) {
      const questions = [...this.form.questions]
      questions.splice(index, 1)
      this.form = { ...this.form, questions }
    },
  },
}
</script>

<style scoped lang="scss">
.mw-600 {
  max-width: 600px;
}
</style>
