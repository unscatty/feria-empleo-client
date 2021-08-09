import Vue from 'vue';
import * as dotenv from 'dotenv';
import VueRouter, { RouteConfig } from 'vue-router';
import { AuthGuard } from './auth/auth.guard';

dotenv.config();

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/home/home.vue'),
    // beforeEnter: AuthGuard.canActivate
  },
  {
    path: '/register-company',
    name: 'RegisterCompany',
    component: () => import('./pages/RegisterCompany.vue'),
  },
];

export default routes;
