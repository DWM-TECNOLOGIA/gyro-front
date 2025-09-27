<template>
  <div class="student-diets">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">Dietas</h5>
      <BButton variant="primary" @click="$emit('create')">Nova dieta</BButton>
    </div>
    <div class="placeholder-graph">Placeholder da lista de dietas</div>
  </div>
</template>

<script>
export default { name: 'StudentDiets', emits: ['create'] }
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
</style>
