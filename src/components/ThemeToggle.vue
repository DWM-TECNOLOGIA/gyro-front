<template>
  <b-button @click="toggleTheme" variant="outline-secondary">
    <template v-if="currentTheme === 'light'"> <i class="bi bi-moon-fill"></i> Modo Escuro </template>
    <template v-else> <i class="bi bi-sun-fill"></i> Modo Claro </template>
  </b-button>
</template>

<script>
export default {
  name: 'ThemeToggle',
  data() {
    return {
      currentTheme: 'light',
    }
  },
  created() {
    // Carrega o tema salvo no localStorage ou usa o padrão
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      this.currentTheme = savedTheme
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Detecta preferência do sistema
      this.currentTheme = 'dark'
    }
    this.applyTheme()
  },
  methods: {
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'
      this.applyTheme()
      this.saveTheme()
    },
    applyTheme() {
      document.documentElement.setAttribute('data-bs-theme', this.currentTheme)
    },
    saveTheme() {
      localStorage.setItem('theme', this.currentTheme)
    },
  },
  watch: {
    currentTheme() {
      this.applyTheme()
    },
  },
}
</script>
