import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AppLayout from '@/components/layout/AppLayout.vue'

const LoginView = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const ProjectsView = () => import('@/views/ProjectsView.vue')
const ProjectDetailView = () => import('@/views/ProjectDetailView.vue')
const TasksView = () => import('@/views/TasksView.vue')
const TaskDetailView = () => import('@/views/TaskDetailView.vue')
const UsersView = () => import('@/views/UsersView.vue')
const ReportsView = () => import('@/views/ReportsView.vue')
const CalendarView = () => import('@/views/CalendarView.vue')
const SettingsView = () => import('@/views/SettingsView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView
      },
      {
        path: 'projects',
        name: 'Projects',
        component: ProjectsView
      },
      {
        path: 'projects/:id',
        name: 'ProjectDetail',
        component: ProjectDetailView
      },
      {
        path: 'tasks',
        name: 'Tasks',
        component: TasksView
      },
      {
        path: 'tasks/:id',
        name: 'TaskDetail',
        component: TaskDetailView
      },
      {
        path: 'users',
        name: 'Users',
        component: UsersView
      },
      {
        path: 'reports',
        name: 'Reports',
        component: ReportsView
      },
      {
        path: 'calendar',
        name: 'Calendar',
        component: CalendarView
      },
      {
        path: 'settings',
        name: 'Settings',
        component: SettingsView
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.matched.some(record => record.meta.guest) && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
