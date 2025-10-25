<template>
  <BCard no-body class="users-card">
    <BCardBody class="p-4">
      <h5 class="mb-3">Início</h5>

      <!-- Linha: Administração -->
      <h6 class="text-muted mb-3">Administração</h6>
      <BRow class="g-3 mb-4">
        <BCol sm="12" md="6" lg="4">
          <div class="feature-card" @click="$router.push({ name: 'my-profile' })">
            <div class="feature-card__title">Meu perfil</div>
            <div class="feature-card__desc">Gerencie seus dados pessoais</div>
          </div>
        </BCol>
        <BCol sm="12" md="6" lg="4" v-if="isOwner">
          <div class="feature-card" @click="$router.push({ name: 'teachers' })">
            <div class="feature-card__title">Professores</div>
            <div class="feature-card__desc">Gerencie os professores da sua empresa</div>
          </div>
        </BCol>
      </BRow>

      <!-- Linha: Treinos e Alunos -->
      <h6 class="text-muted mb-3">Treinos e alunos</h6>
      <BRow class="g-3">
        <BCol sm="12" md="6" lg="4">
          <div class="feature-card" @click="$router.push({ name: 'students' })">
            <div class="feature-card__title">Meus alunos</div>
            <div class="feature-card__desc">Acompanhe e gerencie seus alunos</div>
          </div>
        </BCol>
        <BCol sm="12" md="6" lg="4">
          <div class="feature-card" @click="$router.push({ name: 'trainings' })">
            <div class="feature-card__title">Treinos</div>
            <div class="feature-card__desc">Crie e organize treinos</div>
          </div>
        </BCol>
        <BCol sm="12" md="6" lg="4">
          <div class="feature-card" @click="$router.push({ name: 'anamnese-forms' })">
            <div class="feature-card__title">Anamneses</div>
            <div class="feature-card__desc">Gerencie formulários e respostas</div>
          </div>
        </BCol>
      </BRow>
    </BCardBody>
  </BCard>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BackofficeHome',
  computed: {
    ...mapGetters({ getUserFromStorage: 'auth/getUserFromStorage' }),
    isOwner() {
      return this.getUserFromStorage?.profile === 'owner'
    },
  },
}
</script>

<style scoped lang="scss">
.users-card {
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.feature-card {
  border: 1px solid var(--bs-border-color);
  background: var(--bs-body-bg);
  color: var(--bs-body-color);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition:
    box-shadow 0.2s ease,
    transform 0.1s ease,
    border-color 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
    border-color: var(--bs-primary);
  }

  &__title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 6px;
  }
  &__desc {
    font-size: 13px;
    opacity: 0.8;
  }
}
</style>
