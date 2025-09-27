<template>
  <AuthForm @submit="handleSubmit">
    <InputField
      id="name"
      label="Nome Completo"
      type="text"
      autocomplete="name"
      placeholder="Digite o nome completo"
      v-model="name"
      :errors="v$.name.$errors"
      :dirty="v$.name.$dirty"
      @blur="v$.name.$touch"
    />

    <InputField
      id="email"
      label="E-mail"
      class="mt-3"
      autocomplete="email"
      type="email"
      placeholder="Digite o e-mail"
      v-model="email"
      :errors="v$.email.$errors"
      :dirty="v$.email.$dirty"
      @blur="v$.email.$touch"
    />

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

    <InputField
      id="password"
      label="Senha"
      class="mt-3"
      :type="isPasswordVisible ? 'text' : 'password'"
      placeholder="Digite a senha"
      v-model="password"
      :errors="v$.password.$errors"
      :dirty="v$.password.$dirty"
      @blur="v$.password.$touch"
    >
      <template #append>
        <PasswordToggle v-model="isPasswordVisible" />
      </template>
    </InputField>

    <InputField
      id="confirmPassword"
      label="Confirmar Senha"
      class="mt-3"
      :type="isConfirmPasswordVisible ? 'text' : 'password'"
      placeholder="Confirme a senha"
      v-model="confirmPassword"
      :errors="v$.confirmPassword.$errors"
      :dirty="v$.confirmPassword.$dirty"
      @blur="v$.confirmPassword.$touch"
    >
      <template #append>
        <PasswordToggle v-model="isConfirmPasswordVisible" />
      </template>
    </InputField>

    <StandardButton class="mt-4" type="submit" :loading="isLoading" :disabled="v$.$invalid"> Cadastrar </StandardButton>
  </AuthForm>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { required, sameAs } from '@vuelidate/validators'
import { mapGetters, mapActions } from 'vuex'
import { adminUserValidations } from '@/validators/auth.validator'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      isPasswordVisible: false,
      isConfirmPasswordVisible: false,
    }
  },
  validations() {
    return {
      ...adminUserValidations,
      confirmPassword: {
        required: helpers.withMessage('Confirme a senha', required),
        sameAsPassword: helpers.withMessage('As senhas devem ser iguais', sameAs(this.password)),
      },
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'user/getIsSaving',
    }),
  },
  methods: {
    ...mapActions({
      registerUser: 'user/createUser',
    }),

    async handleSubmit() {
      this.v$.$touch()
      if (this.v$.$invalid) return

      try {
        await this.registerUser({
          name: this.name,
          email: this.email,
          cellphone: '+55' + this.phone.replace(/\D/g, ''),
          password: this.password,
          profile: 'teacher',
        })

        this.handleNotification('success', 'Usuário admin cadastrado com sucesso')
        this.$router.push({ name: 'login' })
      } catch ({ message }) {
        this.handleNotification('error', message || 'Erro ao cadastrar usuário admin')
      }
    },

    handleNotification(type, text) {
      this.$toast[type](text)
    },
  },
}
</script>
