<template>
  <BModal
    :modelValue="show"
    :title="title"
    :size="size"
    centered
    hide-footer
    @update:modelValue="$emit('update:show', $event)"
    @hide="$emit('close')"
  >
    <slot></slot>

    <template #footer>
      <BRow class="w-100">
        <BCol>
          <StandardButton variant="secondary" @click="$emit('close')" class="me-2"> Cancelar </StandardButton>
        </BCol>
        <BCol>
          <StandardButton variant="primary" @click="$emit('confirm')" :loading="loading" :disabled="disableButton">
            {{ confirmText }}
          </StandardButton>
        </BCol>
      </BRow>
    </template>
  </BModal>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Confirmação',
    },
    size: {
      type: String,
      default: 'md',
    },
    confirmText: {
      type: String,
      default: 'Confirmar',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disableButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:show', 'close', 'confirm'],
}
</script>
