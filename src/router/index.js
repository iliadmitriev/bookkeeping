import Vue from 'vue'
import VueRouter from 'vue-router'
import {fbAuth} from '@/utils/firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {layout: 'empty'},
    component: () => import('@/views/Login')
  },
  {
    path: '/register',
    name: 'register',
    meta: {layout: 'empty'},
    component: () => import('@/views/Register')
  },
  {
    path: '/forgot',
    name: 'forgot',
    meta: {layout: 'empty'},
    component: () => import('@/views/ForgotPassword')
  },
  {
    path: '/',
    name: 'home',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/Home')
  },
  {
    path: '/credit-calc',
    name: 'credit-calc',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/CreditCalc')
  },
  {
    path: '/categories',
    name: 'categories',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/Categories')
  },
  {
    path: '/detail/:recordId',
    name: 'detail',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/DetailRecord')
  },
  {
    path: '/planning',
    name: 'planning',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/Planning')
  },
  {
    path: '/history',
    name: 'history',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/History')
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/Profile')
  },
  {
    path: '/record',
    name: 'record',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/Record')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = fbAuth.currentUser
  const requireAuth = to.matched.some(rec => rec.meta.auth)

  if (requireAuth && !currentUser) {
    next({name: 'login', query: {message: 'login'}})
  } else {
    next()
  }
})

export default router
