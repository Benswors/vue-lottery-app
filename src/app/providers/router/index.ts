import { createRouter, createWebHashHistory } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { pinia } from '../pinia'
declare module 'vue-router' {
  interface RouteMeta { title?: string; requiresAuth?: boolean; layout?: 'default' | 'auth' }
}
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/home').then(module => module.HomePage), meta: { title: 'Home' } },
    { path: '/about', name: 'about', component: () => import('@/pages/about').then(module => module.AboutPage), meta: { title: 'About author' } },
    { path: '/login', name: 'login', component: () => import('@/pages/login').then(module => module.LoginPage), meta: { title: 'Login', layout: 'auth' } },
    { path: '/users', meta: { requiresAuth: true }, component: () => import('@/pages/users').then(module => module.UsersLayout), children: [
      { path: '', name: 'users', component: () => import('@/pages/users').then(module => module.UsersPage), meta: { title: 'Users' } },
      { path: 'new', name: 'user-create', component: () => import('@/pages/user-create').then(module => module.UserCreatePage), meta: { title: 'Новий учасник' } },
      { path: ':id', props: true, component: () => import('@/pages/user-details').then(module => module.UserDetailsPage), meta: { title: 'Профіль учасника' }, children: [
        { path: 'edit', name: 'user-edit', props: true, component: () => import('@/pages/user-edit').then(module => module.UserEditPage), meta: { title: 'Редагування учасника' } },
      ] },
    ] },
    { path: '/:pathMatch(.*)*', component: () => import('@/pages/not-found').then(module => module.NotFoundPage), meta: { title: '404' } },
  ],
})
router.beforeEach(to => {
  const auth = useSessionStore(pinia)
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'users' }
})
router.afterEach(to => { document.title = `${to.meta.title || 'Lottery'} | Vue Lottery` })
