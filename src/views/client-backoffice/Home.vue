<template>
  <BCard no-body class="users-card">
    <BCardBody class="p-4 d-flex flex-column gap-3">
      <div>
        <h5 class="mb-1">Olá, {{ userName }} 👋</h5>
        <p class="text-muted mb-0">Bem-vindo ao painel do cliente</p>
      </div>

      <BRow class="g-3 mt-1">
        <BCol sm="12" md="6">
          <BCard class="h-100">
            <BCardBody>
              <h6 class="mb-2">Meu perfil</h6>
              <p class="mb-3 text-muted">Atualize seus dados pessoais</p>
              <StandardButton
                variant="primary"
                class="w-auto text-nowrap"
                @click="$router.push({ name: 'my-profile-client' })"
              >
                Ir para Meu perfil
              </StandardButton>
            </BCardBody>
          </BCard>
        </BCol>
        <BCol sm="12" md="6">
          <BCard class="h-100">
            <BCardBody>
              <h6 class="mb-2">Ajuda</h6>
              <p class="mb-3 text-muted">Precisa de suporte? Entre em contato com seu professor.</p>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>
    </BCardBody>
  </BCard>
</template>

<script>
export default {
  name: 'ClientHome',
  computed: {
    userName() {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        const user = userData?.user || userData || {}
        return user.name || 'Usuário'
      } catch {
        return 'Usuário'
      }
    },
  },
}
</script>

<style scoped lang="scss">
.users-card {
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>
