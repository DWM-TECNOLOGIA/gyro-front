<template>
  <div class="student-pipeline d-grid gap-3">
    <BCard v-for="stage in stages" :key="stage.key" no-body class="pt-2">
      <BCardBody class="d-flex align-items-center justify-content-between" v-b-tooltip.hover="stage.stateLabel">
        <div class="d-flex align-items-center gap-2">
          <span class="dot" :class="`state-${stage.state}`"></span>
          <div>
            <p class="fw-semibold">{{ stage.title }}</p>
            <div class="text-muted small-text">{{ stage.subtitle }}</div>
          </div>
        </div>
      </BCardBody>
    </BCard>
  </div>
</template>

<script>
export default {
  name: 'StudentPipeline',
  props: {
    stages: {
      type: Array,
      default: () => [
        { key: 'profile', title: 'Ficha de respostas', subtitle: 'Cadastro', state: 'pending' },
        { key: 'photos', title: 'Fotos', subtitle: 'Histórico de uploads', state: 'done' },
        { key: 'training', title: 'Treino atual', subtitle: 'Plano ativo', state: 'pending' },
        { key: 'diet', title: 'Dieta atual', subtitle: 'Plano ativo', state: 'pending' },
        { key: 'renewal', title: 'Renovação', subtitle: 'Vencimento', state: 'overdue' },
      ],
    },
  },
  methods: {
    badgeVariant(state) {
      const variants = {
        done: 'success',
        overdue: 'danger',
        pending: 'secondary',
      }
      return variants[state] || 'secondary'
    },
  },
}
</script>

<style scoped lang="scss">
.student-pipeline {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.state-pending {
  background: #adb5bd;
}
.state-done {
  background: #28a745;
}
.state-overdue {
  background: #dc3545;
}
</style>
