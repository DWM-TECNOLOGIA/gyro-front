<template>
  <BButton
    :variant="variant"
    :size="size"
    :disabled="disabled"
    class="icon-button"
    :class="{ 'rounded-circle': rounded }"
    v-b-tooltip.hover="tooltipOptions"
    :title="tooltip"
    :aria-label="ariaLabel || tooltip"
  >
    <slot />
  </BButton>
</template>

<script>
export default {
  name: 'IconButton',
  props: {
    tooltip: { type: String, required: true },
    variant: { type: String, default: 'link' },
    size: { type: String, default: 'sm' },
    disabled: { type: Boolean, default: false },
    rounded: { type: Boolean, default: true },
    ariaLabel: { type: String, default: '' },
    tooltipOptions: { type: Object, default: () => ({}) },
  },
}
</script>

<style scoped lang="scss">
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
}

:deep(svg) {
  width: 1rem;
  height: 1rem;
}
</style>
