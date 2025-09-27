<template>
  <BCard no-body>
    <BCardHeader class="mb-3">Peso</BCardHeader>
    <BCardBody>
      <div style="height: 280px">
        <canvas ref="canvas"></canvas>
      </div>
    </BCardBody>
  </BCard>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { mapGetters } from 'vuex'

Chart.register(...registerables)

export default {
  name: 'WeightChart',
  data() {
    return { chart: null }
  },
  computed: {
    ...mapGetters({ getProgress: 'student/getProgress' }),
    weightSeries() {
      return this.getProgress?.weight || []
    },
    dateRangeDays() {
      if (!this.weightSeries.length) return 0
      const first = new Date(this.weightSeries[0].date)
      const last = new Date(this.weightSeries[this.weightSeries.length - 1].date)
      return Math.max(1, Math.round((last - first) / (1000 * 60 * 60 * 24)))
    },
    categories() {
      const useMonth = this.dateRangeDays > 45
      return this.weightSeries.map((p) => this.$moment(p.date).format(useMonth ? 'MM/YYYY' : 'DD/MM'))
    },
    dataValues() {
      return this.weightSeries.map((p) => Number(p.value))
    },
    latestIndex() {
      return Math.max(0, this.dataValues.length - 1)
    },
    colors() {
      const styles = getComputedStyle(document.documentElement)
      return {
        text: styles.getPropertyValue('--dark-text-primary')?.trim() || '#fff',
        border: styles.getPropertyValue('--dark-border')?.trim() || '#444',
        primary: '#0d6efd',
        highlight: '#20c997',
      }
    },
  },
  watch: {
    weightSeries: {
      handler() {
        this.renderChart()
      },
      deep: true,
    },
  },
  mounted() {
    this.renderChart()
  },
  beforeUnmount() {
    this.destroyChart()
  },
  methods: {
    destroyChart() {
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
    },
    renderChart() {
      if (!this.$refs.canvas) return
      this.destroyChart()
      const ctx = this.$refs.canvas.getContext('2d')
      const latestIndex = this.latestIndex
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: 'Peso (kg)',
              data: this.dataValues,
              borderColor: this.colors.primary,
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.35,
              pointRadius: (ctx) => (ctx.dataIndex === latestIndex ? 5 : 3),
              pointBackgroundColor: (ctx) =>
                ctx.dataIndex === latestIndex ? this.colors.highlight : this.colors.primary,
              pointBorderColor: (ctx) => (ctx.dataIndex === latestIndex ? this.colors.highlight : this.colors.primary),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false, labels: { color: this.colors.text } },
            tooltip: {
              callbacks: {
                title: (items) => {
                  const idx = items?.[0]?.dataIndex
                  const raw = this.weightSeries[idx]?.date
                  return raw ? this.$moment(raw).format('DD/MM/YYYY') : items?.[0]?.label
                },
                label: (item) => `${Number(item.parsed.y).toFixed(1)} kg`,
              },
            },
          },
          scales: {
            x: { ticks: { color: this.colors.text }, grid: { color: this.colors.border } },
            y: {
              ticks: { color: this.colors.text, callback: (val) => `${Number(val).toFixed(1)}` },
              grid: { color: this.colors.border },
              title: { display: true, text: 'kg', color: this.colors.text },
            },
          },
        },
      })
    },
  },
}
</script>

<style scoped></style>
