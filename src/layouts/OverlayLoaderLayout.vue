<template>
  <div class="loader">
    <img src="@/assets/images/loader.png" alt="ícone de carregamento" />
  </div>
</template>

<script>
export default {
  name: 'loader-layout',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.678);
  z-index: 1039;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    @keyframes logo-spin {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    animation: logo-spin infinite 1s linear;
  }
}
</style>
