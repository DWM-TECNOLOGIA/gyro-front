<template>
  <BButton
    :type="type"
    :variant="variant"
    :size="size"
    :block="block"
    :disabled="disabled || loading"
    class="standard-button"
    @click="$emit('click')"
  >
    <BSpinner small v-if="loading" class="me-2" />
    <slot v-else></slot>
  </BButton>
</template>

<script>
export default {
  name: 'StandardButton',
  props: {
    type: {
      type: String,
      default: 'button',
    },
    variant: {
      type: String,
      default: 'primary',
    },
    size: {
      type: String,
      default: 'md',
    },
    block: {
      type: Boolean,
      default: false,
    },
    disabled: Boolean,
    loading: Boolean,
  },
  emits: ['click'],
}
</script>

<style scoped>
.standard-button {
  min-height: 42px;
  font-weight: 500;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
