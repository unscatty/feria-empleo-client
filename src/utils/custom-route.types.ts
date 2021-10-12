import RoleType from '@/models/role.type';
import { Component } from 'vue';
import { NavigationGuardNext, Route, RouteConfig, RouteMeta } from 'vue-router';

export type RouteWithAccess = {
  access: true;
}

export type RouteWithNoAccess = {
  access: false;
  redirect: Parameters<NavigationGuardNext>[0];
}

export type RoleWithAccess = {
  role: RoleType;
} & RouteWithAccess;

export type RoleWithNoAccess = {
  role: RoleType;
} & RouteWithNoAccess;

export type RouteAccess = RouteWithAccess | RouteWithNoAccess;

export type RoleConfig = RoleWithAccess | RoleWithNoAccess;

export type PermissionsConfig = {
  roles?: RoleConfig[];
  default: RouteAccess;
}
export interface CustomRouteMeta extends RouteMeta {
  layout?: string | Component;
  isPublic?: boolean;
  permissions?: PermissionsConfig;
}

export type CustomRouteConfig = RouteConfig & { meta?: CustomRouteMeta }

export interface CustomRoute extends Route {
  meta?: CustomRouteMeta;
}

export type CustomNavGuard<V extends Vue = Vue> = (
  to: CustomRoute,
  from: CustomRoute,
  next: NavigationGuardNext<V>
) => any