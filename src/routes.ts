import * as dotenv from 'dotenv';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { AuthGuard } from './auth/auth.guard';

dotenv.config();

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/home/home.vue'),
    beforeEnter: AuthGuard.canActivate,
    meta: {
      layout: 'LayoutHome',
    },
  },
  {
    path: '/companies',
    component: () => import('./pages/companies/Companies.vue'),
    beforeEnter: AuthGuard.canActivate,
    meta: {
      layout: 'LayoutHome'
    }
  },
  {
    path: '/showCompany/:id',
    component: () => import('./pages/show-company/showCompany.vue'),
    beforeEnter: AuthGuard.canActivate,
    meta: {
      layout: 'LayoutHome'
    }
  },
  {
    path: '/apply/:id',
    component: () => import('./pages/apply/Apply.vue'),
    beforeEnter: AuthGuard.canActivate,
    meta: {
      layout: 'LayoutHome'
    }
  },
  {
    path: '/dashboard',
    component: () => import('./pages/dashboard/vacantes/vacantes.vue'),
    beforeEnter: AuthGuard.canActivate,
    meta: {
      layout: 'LayoutDashboard',
    },
  },
  {
    path: '/top-job-posts/viewed',
    name: 'TopViewed',
  },
  {
    path: '/top-job-posts/applied',
    name: 'TopApplied',
  },
  {
    path: '/top-job-posts/new',
    name: 'TopNew',
  },
];

export default routes;
