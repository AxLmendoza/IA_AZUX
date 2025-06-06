import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login.vue'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import Home from '@/pages/Home.vue'
import Chat from '@/pages/Chat.vue'
import Training from '@/pages/Training.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/app',
      component: SidebarLayout,
      children: [
        { path: '', name: 'Home', component: Home },
        { path: 'chat/:id', name: 'Chat', component: Chat },
        { path: 'training', name: 'Training', component: Training }
      ]
    }
  ]
})