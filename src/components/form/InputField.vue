<template>
  <BFormGroup :label="label" :label-for="id" v-if="!noLabel">
    <BFormInput
      :id="id"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :type="type"
      :placeholder="placeholder"
      :state="validationState"
      @blur="$emit('blur')"
      v-maska="mask"
    >
      <slot name="append"></slot>
    </BFormInput>

    <BFormInvalidFeedback id="input-live-feedback" v-for="error of errors" :key="error.$uid">
      {{ error.$message }}
    </BFormInvalidFeedback>
  </BFormGroup>

  <div v-else>
    <BFormInput
      :id="id"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :type="type"
      :placeholder="placeholder"
      :state="validationState"
      @blur="$emit('blur')"
      v-maska="mask"
    >
      <slot name="append"></slot>
    </BFormInput>

    <BFormInvalidFeedback id="input-live-feedback" v-for="error of errors" :key="error.$uid">
      {{ error.$message }}
    </BFormInvalidFeedback>
  </div>
</template>

<script>
export default {
  name: 'InputField',
  props: {
    id: String,
    label: String,
    type: {
      type: String,
      default: 'text',
    },
    placeholder: String,
    value: [String, Number],
    errors: {
      type: Array,
      default: () => [],
    },
    dirty: Boolean,
    noLabel: {
      type: Boolean,
      default: false,
    },
    modelValue: String,
    mask: {
      type: String,
      default: '',
    },
  },
  computed: {
    validationState() {
      return this.dirty ? !this.errors.length : null
    },
  },
  emits: ['update:modelValue', 'blur'],
}
</script>

<style lang="scss">
.form-control {
  min-height: 42px;
}
.form-label,
.form-control {
  font-size: 14px;
}
.invalid-feedback {
  font-size: 12px;
}
</style>
