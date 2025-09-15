<template>
  <div class="auth-layout">
    <AppHeader />
    <main>
      <BContainer>
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </BContainer>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AppLayout',
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 36px;
  padding-bottom: 36px;
}
</style>
