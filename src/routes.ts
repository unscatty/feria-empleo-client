import * as dotenv from 'dotenv';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import AuthGuard from './auth/auth.guard';
import AdminCompanies from './pages/dashboard/company/companies.vue';
import CompanyRegistration from './pages/company/CompanyRegistration.vue';
import InvitationVerification from './pages/company/InvitationVerification.vue';

dotenv.config();

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/home/home.vue'),
    beforeEnter: AuthGuard,
    meta: {
      layout: 'LayoutHome',
    },
  },
  {
    path: '/companies',
    component: () => import('./pages/companies/Companies.vue'),
    beforeEnter: AuthGuard,
    meta: {
      layout: 'LayoutHome'
    }
  },
  {
    path: '/showCompany/:id',
    component: () => import('./pages/show-company/showCompany.vue'),
    beforeEnter: AuthGuard,
    meta: {
      layout: 'LayoutHome'
    }
  },
  {
    path: '/apply/:id',
    component: () => import('./pages/apply/Apply.vue'),
    beforeEnter: AuthGuard,
    meta: {
      layout: 'LayoutHome'
    }
  },
  {
    path: '/dashboard',
    component: () => import('./pages/dashboard/vacantes/vacantes.vue'),
    beforeEnter: AuthGuard,
    meta: {
      layout: 'LayoutDashboard',
    },
  },
  {
    path: '/dashboard/empresas',
    name: 'AdminCompanies',
    component: AdminCompanies,
    beforeEnter: AuthGuard,
    meta: {
      layout: 'LayoutDashboard',
    },
  },
  {
    path: '/empresas/registro',
    name: 'CompanyRegistration',
    component: CompanyRegistration,
    beforeEnter: AuthGuard,
    meta: {
      layout: 'LayoutHome',
    },
  },
  {
    path: '/empresas/verificar-invitacion',
    name: 'InvitationVerification',
    component: InvitationVerification,
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
