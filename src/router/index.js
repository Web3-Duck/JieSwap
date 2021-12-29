import Vue from 'vue';
import VueRouter from 'vue-router';
import Swap from '../views/swap/Swap.vue';
import Home from '../views/Home.vue';

Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    redirect: '/swap',
    component: Home,
    children: [
      {
        path: 'swap',
        name: 'Swap',
        component: Swap,
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'hash',
  // mode: 'history',
  // base: './',
  routes,
});

export default router;
