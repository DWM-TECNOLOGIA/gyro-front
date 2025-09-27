import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
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
        redirect: { name: 'students' }
      },
      {
        path: 'meus-alunos',
        name: 'students',
        component: () => import('@/views/backoffice/StudentsList.vue')
      },
      {
        path: 'meus-alunos/:id',
        name: 'student-details',
        component: () => import('@/views/backoffice/StudentDetails.vue'),
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
  // const isAuthenticated = !!localStorage.getItem('token');
  // const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // // Se a rota requer autenticação e o usuário não está autenticado
  // if (requiresAuth && !isAuthenticated) {
  //   next({ name: 'login' });
  // }
  // // Se o usuário está autenticado e tenta acessar o login
  // else if (isAuthenticated && to.name === 'login') {
  //   next({ name: 'students' });
  // }
  // // Em outros casos, permite a navegação
  // else {
  next();
  // }
});

export default router;
