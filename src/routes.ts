import * as dotenv from 'dotenv';
import Vue from 'vue';
import VueRouter from 'vue-router';
import AuthGuard from './auth/auth.guard';
import CompanyRegisterGuard from './guards/company-register.guard';
import CurrentUserGuard from './guards/current-user.guard';
import RoleGuard from './guards/role.guard';
import RoleType from './models/role.type';
import CandidateRegistration from './pages/candidate-registration/CandidateRegistration.vue';
import CompanyRegistration from './pages/company/CompanyRegistration.vue';
import InvitationVerification from './pages/company/InvitationVerification.vue';
import AdminCompanies from './pages/dashboard/company/companies.vue';
import { CustomRouteConfig } from './utils/custom-route.types';
import createMultiGuard from './utils/multi-guard';
import { MultiGuard as NoDefaultsMultiGuard } from './utils/multi-guard';

dotenv.config();

Vue.use(VueRouter);

// Default guards to be applied
const MultiGuard = createMultiGuard(AuthGuard, CurrentUserGuard, RoleGuard);

export const homePath: CustomRouteConfig = {
  path: '/',
  name: 'home',
  component: () => import('./pages/home/home.vue'),
  beforeEnter: MultiGuard(),
  meta: {
    title: 'Home',
    layout: 'LayoutHome',
    permissions: {
      default: {
        access: true,
      },
    },
  },
};

const routes: Array<CustomRouteConfig> = [
  homePath,
  {
    path: '/companies',
    component: () => import('./pages/companies/Companies.vue'),
    beforeEnter: MultiGuard(),
    meta: {
      title: 'Empresas',
      layout: 'LayoutHome',
    },
  },
  {
    path: '/profile',
    component: () => import('./pages/profile/Profile.vue'),
    beforeEnter: AuthGuard,
    meta: {
      title: 'Perfil',
      layout: 'LayoutHome',
    },
  },
  {
    path: '/profiles/:id',
    component: () => import('./pages/profiles/CandidateProfiles.vue'),
    beforeEnter: AuthGuard,
    meta: {
      title: 'Perfil',
      layout: 'LayoutHome',
    },
  },
  {
    path: '/showCompany/:id',
    component: () => import('./pages/show-company/showCompany.vue'),
    beforeEnter: MultiGuard(),
    meta: {
      title: 'Empresa',
      layout: 'LayoutHome',
    },
  },
  {
    path: '/apply/:id',
    name: 'vacante',
    component: () => import('./pages/apply/Apply.vue'),
    beforeEnter: MultiGuard(),
    meta: {
      title: 'Aplicar',
      layout: 'LayoutHome',
    },
  },
  {
    path: '/dashboard',
    component: () => import('./pages/dashboard/vacantes/vacantes.vue'),
    beforeEnter: MultiGuard(),
    meta: {
      title: 'Dashboard',
      layout: 'LayoutDashboard',
      permissions: {
        roles: [
          { role: RoleType.COMPANY, access: true },
          { role: RoleType.ADMIN, access: true },
        ],
        default: {
          access: false,
          redirect: { name: 'home' },
        },
      },
    },
  },
  {
    path: '/dashboard/candidatos-aplicados/:id',
    component: () =>
      import('./pages/dashboard/vacantes/candidatos-aplicados/candidatos-aplicados.vue'),
    beforeEnter: AuthGuard,
    meta: {
      layout: 'LayoutDashboard',
    },
  },
  {
    path: '/dashboard/empresas',
    name: 'AdminCompanies',
    component: AdminCompanies,
    beforeEnter: MultiGuard(),
    meta: {
      title: 'Dashboard',
      layout: 'LayoutDashboard',
    },
  },
  {
    path: '/empresas/registro',
    name: 'CompanyRegistration',
    component: CompanyRegistration,
    beforeEnter: NoDefaultsMultiGuard(AuthGuard, CompanyRegisterGuard),
    meta: {
      title: 'Dashboard',
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
    meta: {
      title: 'Registro',
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

const router = new VueRouter({
  mode: 'history',
  routes,
});

const DEFAULT_TITLE = 'Feria empleo IPN';
router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    document.title =
      to.meta && to.meta.title ? `${DEFAULT_TITLE} - ${to.meta.title}` : DEFAULT_TITLE;
  });
});
export default router;
