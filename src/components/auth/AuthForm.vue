<template>
  <BForm @submit.prevent="$emit('submit')" class="auth-form">
    <slot></slot>
  </BForm>
</template>

<script>
export default {
  emits: ['submit'],
}
</script>

<style lang="scss" scoped>
.auth-form {
  .form-group {
    margin-bottom: 1.5rem;
  }

  .btn-link {
    padding: 0;
    font-size: 0.875rem;
  }
}
</style>
