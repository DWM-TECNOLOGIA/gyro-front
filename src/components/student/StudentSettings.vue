<template>
  <div class="student-settings">
    <BCard>
      <BCardHeader>Períodos de atualização</BCardHeader>
      <BCardBody>
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <BFormGroup label="Fotos">
              <BFormSelect :options="periodOptions" v-model="localSettings.photoPeriod" />
            </BFormGroup>
          </div>
          <div class="col-12 col-md-4">
            <BFormGroup label="Treino">
              <BFormSelect :options="periodOptions" v-model="localSettings.trainingPeriod" />
            </BFormGroup>
          </div>
          <div class="col-12 col-md-4">
            <BFormGroup label="Dieta">
              <BFormSelect :options="periodOptions" v-model="localSettings.dietPeriod" />
            </BFormGroup>
          </div>
        </div>
        <div class="mt-3">
          <BButton variant="primary" @click="save">Salvar</BButton>
        </div>
      </BCardBody>
    </BCard>
  </div>
</template>

<script>
export default {
  name: 'StudentSettings',
  props: {
    settings: {
      type: Object,
      default: () => ({ photoPeriod: 'weekly', trainingPeriod: 'weekly', dietPeriod: 'weekly' }),
    },
  },
  emits: ['save'],
  data() {
    return {
      periodOptions: [
        { value: 'weekly', text: 'Semanal' },
        { value: 'biweekly', text: 'Quinzenal' },
        { value: 'monthly', text: 'Mensal' },
      ],
      localSettings: { ...this.settings },
    }
  },
  watch: {
    settings: {
      deep: true,
      handler(val) {
        this.localSettings = { ...val }
      },
    },
  },
  methods: {
    save() {
      this.$emit('save', { ...this.localSettings })
    },
  },
}
</script>

<style scoped></style>
