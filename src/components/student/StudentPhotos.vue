<template>
  <div class="student-photos">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">Fotos</h5>
      <BButton variant="outline-primary" @click="$emit('upload')">Enviar foto</BButton>
    </div>
    <div class="row g-3">
      <div v-for="(photo, idx) in photos" :key="idx" class="col-6 col-md-3">
        <BCard no-body class="h-100">
          <img :src="photo.url" class="card-img-top" :alt="`Photo ${idx + 1}`" />
          <BCardBody>
            <div class="text-muted small">{{ $formatDateUtc(photo.date) }}</div>
          </BCardBody>
        </BCard>
      </div>
      <div v-if="!photos?.length" class="col-12">
        <div class="placeholder-graph">Sem fotos ainda</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentPhotos',
  props: { photos: { type: Array, default: () => [] } },
  emits: ['upload'],
}
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
img {
  object-fit: cover;
}
</style>
