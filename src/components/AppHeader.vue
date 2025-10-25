<template>
  <BNavbar toggleable="lg" class="shadow-sm py-3">
    <!-- Logo e Navegação -->
    <BNavbarBrand to="/app/home" class="d-flex align-items-center me-4">
      <BImg :src="logo" alt="Logotipo" height="40" class="cursor-pointer" />
    </BNavbarBrand>

    <!-- Right side controls -->
    <BNavbarNav class="ms-auto mb-2 mb-lg-0 align-items-center">
      <!-- Hamburger menu: routes accessible to the user -->
      <BNavItemDropdown right no-caret menu-class="py-0">
        <template #button-content>
          <IconButton variant="light">
            <IMdiMenu />
          </IconButton>
        </template>
        <BDropdownItem v-for="route in accessibleRoutes" :key="route.name" @click="$router.push({ name: route.name })">
          {{ route.label }}
        </BDropdownItem>
      </BNavItemDropdown>

      <!-- User dropdown: name (desktop) or initials (mobile) -->
      <BNavItemDropdown right class="ms-2">
        <template #button-content>
          <span class="d-none d-lg-inline fw-semibold user-text">{{ userName }}</span>
          <span class="d-inline d-lg-none fw-semibold user-text">{{ userInitials }}</span>
        </template>
        <BDropdownItem @click="$router.push({ name: profile === 'client' ? 'my-profile-client' : 'my-profile' })"
          >Meu perfil</BDropdownItem
        >
        <BDropdownItem @click="logout">Sair</BDropdownItem>
      </BNavItemDropdown>
    </BNavbarNav>
  </BNavbar>
</template>

<script>
import { mapActions } from 'vuex'
import logo from '@/assets/images/gyro-logo.png'
import IconButton from '@/components/form/IconButton.vue'
import IMdiMenu from '~icons/mdi/menu'

export default {
  name: 'AppHeader',
  components: { IconButton, IMdiMenu },
  data() {
    return {
      user: null,
      logo,
    }
  },
  mounted() {
    this.loadUserData()
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout',
    }),
    loadUserData() {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        this.user = userData?.user || userData || { name: '-' }
      } catch (e) {
        console.error(e)
        // this.logout()
      }
    },
  },
  computed: {
    userName() {
      return this.user?.name || '-'
    },
    userInitials() {
      const name = this.user?.name || ''
      const parts = name.trim().split(/\s+/)
      const initials = parts
        .slice(0, 2)
        .map((p) => p.charAt(0).toUpperCase())
        .join('')
      return initials || '-'
    },
    profile() {
      return this.user?.profile
    },
    accessibleRoutes() {
      const profile = this.user?.profile
      if (profile === 'client') {
        return [
          { name: 'client-home', label: 'Início' },
          { name: 'my-profile-client', label: 'Meu perfil' },
        ]
      }
      const routes = [
        { name: 'backoffice-home', label: 'Início' },
        { name: 'students', label: 'Meus alunos' },
        { name: 'anamnese-forms', label: 'Anamneses' },
      ]
      if (profile === 'owner') routes.push({ name: 'teachers', label: 'Professores' })
      return routes
    },
  },
}
</script>

<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer;
}

.navbar {
  /* Use Bootstrap theme variables so it adapts on theme change */
  color: var(--bs-body-color);

  :deep(.navbar-brand),
  :deep(.nav-link),
  :deep(.dropdown-toggle) {
    color: var(--bs-body-color) !important;
  }

  :deep(.nav-link.active) {
    color: var(--bs-danger) !important;
    font-weight: 600;
  }
}

.user-info {
  border-right: 1px solid var(--bs-gray-300);
  padding-right: 1rem;
}

.logout-btn {
  display: flex;
  align-items: center;
}

// Dropdown theming via variables so it works on light/dark
:deep(.dropdown-menu) {
  background-color: var(--bs-body-bg) !important;
  color: var(--bs-body-color) !important;
  border-color: var(--bs-border-color);
}

:deep(.dropdown-item) {
  color: var(--bs-body-color) !important;
}

:deep(.dropdown-item:hover),
:deep(.dropdown-item:focus) {
  color: var(--bs-body-color) !important;
  background-color: var(--bs-btn-hover-bg) !important;
}

// Ajustes para mobile
@media (max-width: 992px) {
  .navbar {
    padding: 0.5rem 0;
  }
}

.hamburger-icon {
  width: 20px;
  height: 2px;
  background: var(--bs-body-color);
  display: inline-block;
  position: relative;
}
.hamburger-icon::before,
.hamburger-icon::after {
  content: '';
  position: absolute;
  left: 0;
  width: 20px;
  height: 2px;
  background: var(--bs-body-color);
}
.hamburger-icon::before {
  top: -6px;
}
.hamburger-icon::after {
  top: 6px;
}
</style>
