<template>
  <div>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in"> <component :is="Component" /> </Transition>
    </RouterView>
  </div>
</template>

<style lang="scss">
@use './assets/scss/main.scss';

#app {
  height: 100vh;
}
</style>
