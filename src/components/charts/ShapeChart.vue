<template>
  <BCard no-body>
    <BCardHeader class="mb-3">Shape</BCardHeader>
    <BCardBody>
      <div class="mb-4" style="height: 280px"><canvas ref="radarCanvas"></canvas></div>
      <div style="height: 280px"><canvas ref="barCanvas"></canvas></div>
    </BCardBody>
  </BCard>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { mapGetters } from 'vuex'

Chart.register(...registerables)

export default {
  name: 'ShapeChart',
  data() {
    return { radarChart: null, barChart: null }
  },
  computed: {
    ...mapGetters({ getProgress: 'student/getProgress' }),
    // For radar, mock body parts; later replace with real metrics if available
    radarCategories() {
      return ['Braços', 'Peito', 'Abdômen', 'Pernas', 'Costas']
    },
    radarSeries() {
      // Create a single series using the last shape score as baseline distributed
      const last = this.getProgress?.shape?.[this.getProgress.shape.length - 1]?.score || 70
      const values = this.radarCategories.map((_, i) => Math.max(10, Math.min(100, last + (i - 2) * 3)))
      return [{ name: 'Shape', data: values }]
    },
    barSeries() {
      const series = (this.getProgress?.shape || []).map((s) => s.score)
      return [{ name: 'Shape score', data: series }]
    },
    barCategories() {
      return (this.getProgress?.shape || []).map((s) => this.$moment(s.date).format('DD/MM'))
    },
    colors() {
      const styles = getComputedStyle(document.documentElement)
      return {
        text: styles.getPropertyValue('--dark-text-primary')?.trim() || '#fff',
        border: styles.getPropertyValue('--dark-border')?.trim() || '#444',
        primary: '#0d6efd',
        accent: '#20c997',
      }
    },
  },
  watch: {
    getProgress: {
      handler() {
        this.renderCharts()
      },
      deep: true,
    },
  },
  mounted() {
    this.renderCharts()
  },
  beforeUnmount() {
    this.destroyCharts()
  },
  methods: {
    destroyCharts() {
      this.radarChart && this.radarChart.destroy()
      this.radarChart = null
      this.barChart && this.barChart.destroy()
      this.barChart = null
    },
    renderCharts() {
      if (!this.$refs.radarCanvas || !this.$refs.barCanvas) return
      this.destroyCharts()
      const radarCtx = this.$refs.radarCanvas.getContext('2d')
      const barCtx = this.$refs.barCanvas.getContext('2d')

      this.radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
          labels: this.radarCategories,
          datasets: [
            {
              label: 'Shape',
              data: this.radarSeries[0].data,
              backgroundColor: 'rgba(13,110,253,0.2)',
              borderColor: this.colors.primary,
              pointBackgroundColor: this.colors.primary,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: this.colors.text } } },
          scales: {
            r: {
              angleLines: { color: this.colors.border },
              grid: { color: this.colors.border },
              pointLabels: { color: this.colors.text },
              ticks: { color: this.colors.text, backdropColor: 'transparent' },
            },
          },
        },
      })

      this.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: this.barCategories,
          datasets: [
            {
              label: 'Shape score',
              data: this.barSeries[0].data,
              backgroundColor: 'rgba(32,201,151,0.4)',
              borderColor: this.colors.accent,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: this.colors.text }, grid: { color: this.colors.border } },
            y: { ticks: { color: this.colors.text }, grid: { color: this.colors.border }, min: 0, max: 100 },
          },
        },
      })
    },
  },
}
</script>

<style scoped></style>
