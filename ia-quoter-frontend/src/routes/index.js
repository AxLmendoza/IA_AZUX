import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import Login    from '@/pages/Login.vue';
import SidebarLayout from '@/layouts/SidebarLayout.vue';
import Home     from '@/pages/Home.vue';
import Chat     from '@/pages/Chat.vue';
import Training from '@/pages/Training.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Login', component: Login },
    {
      path: '/',
      component: SidebarLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'home',     name: 'Home',     component: Home },
        { path: 'chat/:id', name: 'Chat',     component: Chat },
        { path: 'training', name: 'Training', component: Training },
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth);
  const loggedIn     = !!store.state.auth.token;
  if (requiresAuth && !loggedIn) return next('/');
  next();
});

export default router;
