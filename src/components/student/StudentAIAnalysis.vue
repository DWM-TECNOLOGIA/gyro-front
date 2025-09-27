<template>
  <BCard>
    <BCardHeader>Análise por IA</BCardHeader>
    <BCardBody>
      <div class="placeholder-graph">Placeholder de comparações/insights por IA</div>
    </BCardBody>
  </BCard>
</template>

<script>
export default { name: 'StudentAIAnalysis' }
</script>

<style scoped lang="scss">
.placeholder-graph {
  height: 220px;
  border: 1px dashed var(--bs-gray-400);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bs-gray-600);
}
</style>
