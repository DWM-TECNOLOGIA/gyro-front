<template>
  <BFormGroup :label="label" :label-for="id" v-if="!noLabel">
    <BFormRadioGroup
      :id="id"
      :name="name || id"
      :options="normalizedOptions"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :state="validationState"
      @blur="$emit('blur')"
      :disabled="disabled"
      :stacked="stacked"
      :buttons="buttons"
      :button-variant="buttonVariant"
      :size="size"
    />

    <BFormInvalidFeedback id="radio-live-feedback" v-for="error of errors" :key="error.$uid">
      {{ error.$message }}
    </BFormInvalidFeedback>
  </BFormGroup>

  <div v-else>
    <BFormRadioGroup
      :id="id"
      :name="name || id"
      :options="normalizedOptions"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :state="validationState"
      @blur="$emit('blur')"
      :disabled="disabled"
      :stacked="stacked"
      :buttons="buttons"
      :button-variant="buttonVariant"
      :size="size"
    />

    <BFormInvalidFeedback id="radio-live-feedback" v-for="error of errors" :key="error.$uid">
      {{ error.$message }}
    </BFormInvalidFeedback>
  </div>
</template>

<script>
export default {
  name: 'RadioGroup',
  props: {
    id: String,
    label: String,
    name: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    modelValue: [String, Number, Boolean],
    errors: {
      type: Array,
      default: () => [],
    },
    dirty: Boolean,
    noLabel: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    stacked: {
      type: Boolean,
      default: false,
    },
    buttons: {
      type: Boolean,
      default: false,
    },
    buttonVariant: {
      type: String,
      default: 'outline-primary',
    },
    size: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue', 'blur'],
  computed: {
    validationState() {
      return this.dirty ? !this.errors.length : null
    },
    normalizedOptions() {
      return this.options.map((opt) =>
        typeof opt === 'object' && opt !== null ? opt : { text: String(opt), value: opt },
      )
    },
  },
}
</script>

<style scoped lang="scss">
.form-check-label {
  font-size: 14px;
}
.invalid-feedback {
  font-size: 12px;
}
</style>
