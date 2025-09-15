<template>
  <BNavbar toggleable="lg" class="shadow-sm py-3">
    <!-- Logo e Navegação -->
    <BNavbarBrand to="/app/meus-alunos" class="d-flex align-items-center me-4">
      <BImg :src="logo" alt="Logotipo" height="40" class="cursor-pointer" />
    </BNavbarBrand>

    <BNavbarToggle target="nav-collapse" />
    <BCollapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <BNavbarNav class="ms-auto mb-2 mb-lg-0">
        <BBadge variant="secondary" class="me-3">
          {{ user.partner }}
        </BBadge>

        <div class="user-info d-none d-lg-flex align-items-center me-3">
          <div class="me-2 text-end">
            <p class="mb-0 fw-bold">{{ user.name }}</p>
            <!-- <small class="text-muted">Minha conta</small> -->
          </div>
          <BAvatar variant="light" :text="user.name.charAt(0)" class="bg-light border" />
        </div>
        <BNavItemDropdown right>
          <template #button-content>
            <em>Perfil</em>
          </template>
          <BDropdownItem href="#" @click="logout">Sair</BDropdownItem>
        </BNavItemDropdown>
      </BNavbarNav>
    </BCollapse>
  </BNavbar>
</template>

<script>
import { mapActions } from 'vuex'
import logo from '@/assets/images/gyro-logo.png'

export default {
  name: 'AppHeader',
  data() {
    return {
      user: {
        name: '-',
        partner: '-',
      },
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
        this.user.name = userData?.user?.username || '-'
        this.user.partner = userData?.user?.partner || '-'
      } catch (e) {
        console.error(e)
        // this.logout()
      }
    },
  },
}
</script>

<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer;
}

.navbar {
  .nav-link {
    position: relative;
    color: var(--bs-dark);

    &.active {
      color: var(--bs-danger);
      font-weight: 600;

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background-color: var(--bs-danger);
      }
    }

    &:hover {
      color: var(--bs-danger);
    }
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

// Ajustes para mobile
@media (max-width: 992px) {
  .navbar {
    padding: 0.5rem 0;
  }
}
</style>
