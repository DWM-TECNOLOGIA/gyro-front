<template>
  <div class="login-page">
    <BContainer class="login-container">
      <BRow class="justify-content-start h-100">
        <BCol cols="12" md="6" lg="5" xl="4" class="p-0 m-0 h-100">
          <BCard no-body class="login-card p-0 m-0 h-100">
            <BCardBody class="p-4 d-flex flex-column justify-content-center">
              <template v-if="!showCreateForm && !showResetForm">
                <h5 class="mb-3">Entrar</h5>
                <p class="mb-3 subtitle">
                  Não possui uma conta?
                  <BLink @click="showCreateForm = true">Criar conta</BLink>
                </p>
                <LoginForm @show-reset="showResetForm = true" />
              </template>

              <template v-else-if="showCreateForm">
                <h5 class="mb-3">Criar conta</h5>
                <p class="mb-3 subtitle">
                  Já possui uma conta?
                  <BLink @click="showCreateForm = false">Entrar</BLink>
                </p>
                <RegisterUserForm @show-login="showCreateForm = false" @create-success="handleActionSuccess" />
              </template>

              <template v-else-if="showResetForm">
                <h5 class="mb-3">Recuperar senha</h5>
                <p class="mb-3 subtitle">
                  Lembrou sua senha?
                  <BLink @click="showResetForm = false">Entrar</BLink>
                </p>
                <PasswordResetForm @reset-success="handleActionSuccess" />
              </template>
            </BCardBody>
          </BCard>
        </BCol>

        <BCol
          cols="12"
          md="6"
          lg="7"
          xl="8"
          class="m-0 h-100 d-flex justify-content-center align-items-center position-relative"
        >
          <div class="logo-wrapper d-flex flex-column align-items-center">
            <img src="@/assets/images/gyro-logo.png" alt="logotipo" />

            <p>Controle de cargas, treinos e resultados em um só lugar</p>
          </div>
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script>
import logo from '@/assets/images/logo.png'

export default {
  data() {
    return {
      showCreateForm: false,
      showResetForm: false,
      logo,
    }
  },
  methods: {
    handleActionSuccess() {
      this.showResetForm = false
      this.showCreateForm = false
    },
  },
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0;
  background-image: url('@/assets/images/fitness-photo.jpg');
  background-size: contain;
  background-position: right;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .logo-wrapper {
    position: absolute;
    margin: auto;
    img {
      height: auto;
      width: 350px;
    }
    p {
      font-weight: 600;
      margin-top: 20px;
    }
  }

  .login-container {
    max-width: 100%;
    height: 100vh;

    p {
      color: var(--bs-white);
    }
  }

  .login-card {
    border-radius: 0 12px 12px 0;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    border: none;

    .card-body {
      gap: 16px;
      overflow-y: auto;

      .subtitle {
        font-size: 16px;
      }
    }

    .login-logo {
      max-height: 80px;
      width: auto;
    }
  }
}
</style>
