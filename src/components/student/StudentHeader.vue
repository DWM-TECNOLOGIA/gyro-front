<template>
  <BCard no-body class="student-header-card">
    <BCardBody class="d-flex align-items-center gap-3 p-3">
      <div class="avatar-container">
        <img v-if="student?.avatar" :src="student.avatar" :alt="`Avatar ${student?.name}`" class="avatar-img" />
        <div v-else class="avatar-default">
          <MdiUserCircle />
        </div>
      </div>
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="mb-1">{{ student?.name }}</h6>
            <p class="text-muted mb-1">{{ student?.age ? student.age + ' anos' : '-' }}</p>
            <p class="text-muted mb-0">Cadastrado em {{ $formatDateUtc(student?.createdAt) }}</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <BBadge :variant="student?.isActive ? 'success' : 'secondary'">
              {{ student?.isActive ? 'Ativo' : 'Inativo' }}
            </BBadge>
            <IconButton variant="primary" :tooltip="'Editar perfil'" aria-label="Editar perfil" @click="$emit('edit')">
              <IMdiPencil />
            </IconButton>
          </div>
        </div>
      </div>
    </BCardBody>
  </BCard>
</template>

<script>
import MdiUserCircle from '~icons/mdi/user-circle'
import IMdiPencil from '~icons/mdi/pencil'
import IconButton from '@/components/form/IconButton.vue'

export default {
  name: 'StudentHeader',
  components: { MdiUserCircle, IMdiPencil, IconButton },
  props: {
    student: { type: Object, default: () => ({}) },
  },
  emits: ['edit'],
}
</script>

<style scoped lang="scss">
.student-header-card {
  border-radius: 0.5rem;

  .avatar-container {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-default {
      width: 100%;
      height: 100%;
      background-color: #6c757d;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }
  }
}
</style>
