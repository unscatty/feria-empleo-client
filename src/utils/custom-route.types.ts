import { Component } from 'vue';
import {NavigationGuardNext, Route, RouteConfig, RouteMeta} from 'vue-router';

export interface CustomRouteMeta extends RouteMeta {
  layout?: string | Component;
  isPublic?: boolean;
}

export type CustomRouteConfig = RouteConfig & { meta?: CustomRouteMeta }

export interface CustomRoute extends Route {
  meta?: CustomRouteMeta
}

export type CustomNavGuard<V extends Vue = Vue> = (
  to: CustomRoute,
  from: CustomRoute,
  next: NavigationGuardNext<V>
) => any