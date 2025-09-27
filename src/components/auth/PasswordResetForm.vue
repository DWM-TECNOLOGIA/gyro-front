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

    <template v-if="showCodeField">
      <InputField
        id="code"
        label="Código"
        placeholder="Digite o código recebido"
        v-model="code"
        :errors="v$.code.$errors"
        :dirty="v$.code.$dirty"
        @blur="v$.code.$touch"
      />

      <InputField
        id="new-password"
        label="Nova Senha"
        :type="isPasswordVisible ? 'text' : 'password'"
        placeholder="Digite sua nova senha"
        v-model="password"
        :errors="v$.password.$errors"
        :dirty="v$.password.$dirty"
        @blur="v$.password.$touch"
      >
        <template #append>
          <PasswordToggle v-model="isPasswordVisible" />
        </template>
      </InputField>
    </template>

    <StandardButton type="submit" :loading="isLoading" :disabled="v$.$invalid" class="mt-4">
      {{ showCodeField ? 'Alterar Senha' : 'Enviar Código' }}
    </StandardButton>
  </AuthForm>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { resetPasswordValidations } from '@/validators/auth.validator'
import { mapActions, mapGetters } from 'vuex'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      email: '',
      code: '',
      password: '',
      showCodeField: false,
      isPasswordVisible: false,
    }
  },
  validations() {
    return {
      email: resetPasswordValidations.email,
      code: this.showCodeField ? resetPasswordValidations.code : {},
      password: this.showCodeField ? resetPasswordValidations.password : {},
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'auth/getIsSaving',
    }),
    // ... computed para error messages similar ao LoginForm
  },
  methods: {
    ...mapActions({
      forgotPassword: 'auth/forgotPassword',
      resetPassword: 'auth/resetPassword',
    }),
    async handleSubmit() {
      this.v$.$touch()
      if (this.v$.$invalid) return

      try {
        if (!this.showCodeField) {
          await this.forgotPassword({ email: this.email })
          this.showCodeField = true
          this.handleNotification('success', 'Um código foi enviado para o seu e-mail')
        } else {
          await this.resetPassword({
            email: this.email,
            code: this.code,
            password: this.password,
          })
          this.handleNotification('success', 'Senha alterada com sucesso')
          this.$emit('reset-success')
        }
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
