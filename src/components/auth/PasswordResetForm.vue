<template>
  <AuthForm @submit="handleSubmit">
    <InputField
      id="phone"
      label="Telefone"
      class="mt-3"
      autocomplete="tel"
      type="tel"
      placeholder="Digite o telefone"
      v-model="phone"
      :errors="v$.phone.$errors"
      :dirty="v$.phone.$dirty"
      @blur="v$.phone.$touch"
      mask="(##) #####-####"
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
      phone: '',
      code: '',
      password: '',
      showCodeField: false,
      isPasswordVisible: false,
    }
  },
  validations() {
    return {
      phone: resetPasswordValidations.phone,
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
          await this.forgotPassword({ cellphone: this.phone })
          this.showCodeField = true
          this.handleNotification('success', 'Um código foi enviado para o seu telefone')
        } else {
          await this.resetPassword({
            cellphone: this.phone.replace(/\D/g, ''),
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
