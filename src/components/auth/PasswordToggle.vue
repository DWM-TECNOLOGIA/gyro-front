<template>
  <BButton
    variant="link"
    class="password-toggle"
    @click="toggleVisibility"
    v-b-tooltip.hover
    :title="modelValue ? 'Ocultar senha' : 'Mostrar senha'"
  >
    <IMdiEyeOffOutline color="white" v-if="modelValue" />
    <IMdiEyeOutline color="white" v-else />
  </BButton>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    toggleVisibility() {
      this.$emit('update:modelValue', !this.modelValue)
    },
  },
}
</script>

<style lang="scss" scoped>
.password-toggle {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--bs-secondary);
  padding: 0;
}
</style>
