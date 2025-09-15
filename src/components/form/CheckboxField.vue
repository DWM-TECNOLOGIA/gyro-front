<template>
  <BFormCheckbox
    :id="id"
    :name="name"
    :disabled="disabled"
    :required="required"
    :state="state"
    :value="value"
    :unchecked-value="uncheckedValue"
    v-model="internalValue"
    class="checkbox-field"
  >
    <slot></slot>
  </BFormCheckbox>
</template>

<script>
export default {
  name: 'CheckboxField',
  props: {
    id: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    state: {
      type: Boolean,
      default: null,
    },
    value: {
      type: [String, Number, Boolean, Object],
      default: true,
    },
    uncheckedValue: {
      type: [String, Number, Boolean, Object],
      default: false,
    },
    modelValue: {
      type: [Boolean, Array],
      default: false,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    internalValue: {
      get() {
        return this.modelValue
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue)
      },
    },
  },
}
</script>

<style scoped lang="scss">
.checkbox-field {
  display: inline-flex;
  align-items: center;

  :deep(.form-check-label) {
    margin: 0;
    font-size: 14px;
  }
}

.checkbox-field :deep(.form-check-input) {
  margin-top: 0;
  margin-right: 0.5rem;
}
</style>
