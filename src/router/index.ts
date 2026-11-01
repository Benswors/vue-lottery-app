import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'
declare module 'vue-router' {
  interface RouteMeta { title?: string; requiresAuth?: boolean; layout?: 'default' | 'auth' }
}
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: 'Home' } },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue'), meta: { title: 'About author' } },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { title: 'Login', layout: 'auth' } },
    { path: '/users', meta: { requiresAuth: true }, component: () => import('@/views/UsersLayout.vue'), children: [
      { path: '', name: 'users', component: () => import('@/views/UsersView.vue'), meta: { title: 'Users' } },
      { path: 'new', name: 'user-create', component: () => import('@/views/UserCreateView.vue'), meta: { title: 'Новий учасник' } },
      { path: ':id', props: true, component: () => import('@/views/UserDetailView.vue'), meta: { title: 'Профіль учасника' }, children: [
        { path: 'edit', name: 'user-edit', props: true, component: () => import('@/views/UserEditView.vue'), meta: { title: 'Редагування учасника' } },
      ] },
    ] },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFoundView.vue'), meta: { title: '404' } },
  ],
})
router.beforeEach(to => {
  const auth = useAuthStore(pinia)
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'users' }
})
router.afterEach(to => { document.title = `${to.meta.title || 'Lottery'} | Vue Lottery` })
