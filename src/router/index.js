import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/:companyId?",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: { requiresAuth: false }
  },
  {
    path: "/app",
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: { name: 'backoffice-home' }
      },
      {
        path: 'home',
        name: 'backoffice-home',
        component: () => import('@/views/backoffice/Home.vue')
      },
      {
        path: 'meus-alunos',
        name: 'students',
        component: () => import('@/views/backoffice/StudentsList.vue')
      },
      {
        path: 'meu-perfil',
        name: 'my-profile',
        component: () => import('@/views/backoffice/MyProfile.vue')
      },
      {
        path: 'professores',
        name: 'teachers',
        component: () => import('@/views/backoffice/TeachersList.vue'),
        meta: { requiresOwner: true }
      },
      {
        path: 'anamneses',
        name: 'anamnese-forms',
        component: () => import('@/views/backoffice/AnamneseFormsList.vue')
      },
      {
        path: 'treinos',
        name: 'trainings',
        component: () => import('@/views/backoffice/AnamneseFormsList.vue')
      },
      {
        path: 'meus-alunos/:id',
        name: 'student-details',
        component: () => import('@/views/backoffice/StudentDetails.vue'),
      }
    ]
  },
  {
    path: "/int",
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true, requiresClient: true },
    children: [
      {
        path: '',
        redirect: { name: 'client-home' }
      },
      {
        path: 'home',
        name: 'client-home',
        component: () => import('@/views/client-backoffice/Home.vue')
      },
      {
        path: 'meu-perfil',
        name: 'my-profile-client',
        component: () => import('@/views/backoffice/MyProfile.vue')
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guarda de navegação
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
    return;
  }

  if (isAuthenticated && to.name === 'login') {
    next({ name: 'students' });
    return;
  }

  if (to.matched.some(record => record.meta?.requiresOwner)) {
    if (!user || user.profile !== 'owner') {
      next({ name: 'students' });
      return;
    }
  }

  if (to.matched.some(record => record.meta?.requiresClient)) {
    if (!user || user.profile !== 'client') {
      next({ name: 'students' });
      return;
    }
  }

  next();
});

export default router;
