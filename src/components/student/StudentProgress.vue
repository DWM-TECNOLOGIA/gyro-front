<template>
  <div class="student-progress">
    <BRow class="mb-4">
      <BCol sm="12" md="4">
        <BCard class="h-100">
          <BCardHeader>Peso atual</BCardHeader>
          <BCardBody>
            <div class="fs-3">{{ currentWeight }} kg</div>
            <div class="small-text text-muted">Atualizado em {{ lastDate }}</div>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol sm="12" md="4">
        <BCard class="h-100">
          <BCardHeader>Variação</BCardHeader>
          <BCardBody>
            <div class="fs-3">{{ weightChange.signed }} kg</div>
            <BBadge :variant="weightChange.value >= 0 ? 'success' : 'danger'">{{ weightChange.percent }}%</BBadge>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol sm="12" md="4">
        <BCard class="h-100">
          <BCardHeader>Progresso corporal</BCardHeader>
          <BCardBody>
            <div class="fs-3">{{ shapeDelta.signed }} pts</div>
            <div class="small-text text-muted">Evolução do score</div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <BRow class="mb-4">
      <BCol sm="12" lg="6">
        <WeightChart />
      </BCol>
      <BCol sm="12" lg="6">
        <ShapeChart />
      </BCol>
      <BCol sm="12">
        <BCard class="mt-4">
          <BCardHeader class="mb-3">Insights por IA</BCardHeader>
          <BCardBody>
            <ul class="mb-0">
              <li>Aluno progredindo bem, sem necessidade de alterar a dieta.</li>
              <li>Possível platô detectado, considerar ajuste no treino.</li>
            </ul>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import WeightChart from '@/components/charts/WeightChart.vue'
import ShapeChart from '@/components/charts/ShapeChart.vue'

export default {
  name: 'StudentProgress',
  components: { WeightChart, ShapeChart },
  computed: {
    ...mapGetters({ getProgress: 'student/getProgress' }),
    weightSeries() {
      return this.getProgress.weight || []
    },
    shapeSeries() {
      return this.getProgress.shape || []
    },
    currentWeight() {
      const last = this.weightSeries[this.weightSeries.length - 1]
      return last ? Number(last.value).toFixed(1) : '-'
    },
    lastDate() {
      const last = this.weightSeries[this.weightSeries.length - 1]
      return last ? this.$formatDateUtc(last.date) : '-'
    },
    weightChange() {
      const first = this.weightSeries[0]
      const last = this.weightSeries[this.weightSeries.length - 1]
      if (!first || !last) return { value: 0, signed: '0.0', percent: '0.0' }
      const value = Number(last.value - first.value)
      const percent = first.value ? (value / first.value) * 100 : 0
      const signed = `${value >= 0 ? '+' : ''}${value.toFixed(1)}`
      return { value, signed, percent: percent.toFixed(1) }
    },
    shapeDelta() {
      const first = this.shapeSeries[0]
      const last = this.shapeSeries[this.shapeSeries.length - 1]
      if (!first || !last) return { value: 0, signed: '0' }
      const value = Number(last.score - first.score)
      const signed = `${value >= 0 ? '+' : ''}${value.toFixed(0)}`
      return { value, signed }
    },
  },
  methods: {
    ...mapActions({ fetchProgress: 'student/fetchProgress' }),
  },
  mounted() {
    // Student id could be passed via route in parent; for now mock with action only
    this.fetchProgress({ studentId: 'mock' })
  },
}
</script>

<style scoped></style>
