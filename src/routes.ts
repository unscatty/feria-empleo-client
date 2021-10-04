import * as dotenv from 'dotenv';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import AuthGuard from './auth/auth.guard';
import CandidateRegistration from './pages/candidate-registration/CandidateRegistration.vue';
import CompanyRegistration from './pages/company/CompanyRegistration.vue';
import InvitationVerification from './pages/company/InvitationVerification.vue';
import AdminCompanies from './pages/dashboard/company/companies.vue';

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
      layout: 'LayoutHome',
    },
  },
  {
    path: '/profile',
    component: () => import('./pages/profile/Profile.vue'),
    beforeEnter: AuthGuard,
    meta: {
      layout: 'LayoutHome'
    }
  },
  {
    path: '/profile/edit',
    component: () => import('./pages/profile/edit/EditProfile.vue'),
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
      layout: 'LayoutHome',
    },
  },
  {
    path: '/apply/:id',
    name: 'vacante',
    component: () => import('./pages/apply/Apply.vue'),
    beforeEnter: AuthGuard,
    meta: {
      layout: 'LayoutHome',
    },
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
    path: '/registro',
    name: 'CandidateRegistration',
    component: CandidateRegistration,
    beforeEnter: AuthGuard,
    meta: {
      layout: 'LayoutVuetifyDefault',
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

export default new VueRouter({
  mode: 'history',
  routes,
});
