<template>
  <div class="student-trainings">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">Treinos</h5>
      <BButton variant="primary" @click="$emit('create')">Novo treino</BButton>
    </div>
    <ReusableTable
      :items="items"
      :fields="fields"
      :show-details="true"
      title="Lista de treinos"
      :has-next-page="hasNextPage"
      :loading="loading"
      @load-more="$emit('load-more')"
      @row-clicked="(row) => $emit('open', row)"
    >
      <template #details="{ item }">
        <div class="p-3">
          <h6 class="mb-2">Detalhes do treino</h6>
          <p class="mb-0">{{ item.description }}</p>
        </div>
      </template>
    </ReusableTable>
  </div>
</template>

<script>
export default {
  name: 'StudentTrainings',
  props: {
    items: { type: Array, default: () => [] },
    fields: { type: Array, default: () => [] },
    hasNextPage: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  emits: ['create', 'open', 'load-more'],
}
</script>

<style scoped></style>
