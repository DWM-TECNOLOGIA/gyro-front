<template>
  <AuthForm @submit="handleSubmit">
    <InputField
      id="email"
      label="E-mail"
      class="mt-3"
      autocomplete="email"
      type="email"
      placeholder="Digite seu e-mail"
      v-model="email"
      :errors="v$.email.$errors"
      :dirty="v$.email.$dirty"
      @blur="v$.email.$touch"
    />

    <InputField
      id="password"
      label="Senha"
      class="mt-3"
      :type="isPasswordVisible ? 'text' : 'password'"
      placeholder="Digite sua senha"
      v-model="password"
      :errors="v$.password.$errors"
      :dirty="v$.password.$dirty"
      @blur="v$.password.$touch"
    >
      <template #append>
        <PasswordToggle v-model="isPasswordVisible" />
      </template>
    </InputField>

    <StandardButton class="mt-4" type="submit" :loading="isLoading" :disabled="v$.$invalid"> Entrar </StandardButton>

    <StandardButton class="d-block mt-3" variant="link" href="#" @click="() => $emit('show-reset')">
      Esqueci minha senha
    </StandardButton>
  </AuthForm>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { loginValidations } from '@/validators/auth.validator'
import { mapGetters, mapActions } from 'vuex'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      isPasswordVisible: false,
    }
  },
  validations() {
    return loginValidations
  },
  computed: {
    ...mapGetters({
      isLoading: 'auth/getIsSaving',
    }),
  },
  methods: {
    ...mapActions({
      login: 'auth/login',
    }),

    async handleSubmit() {
      this.v$.$touch()
      if (this.v$.$invalid) return

      try {
        await this.login({
          email: this.email,
          password: this.password,
        })
        this.handleNotification('success', 'Login realizado com sucesso')
        this.$router.push({ name: 'students' })
      } catch ({ message }) {
        this.handleNotification('error', message)
      }
    },
    handleNotification(type, text) {
      this.$toast[type](text)
    },
  },
}
</script>
