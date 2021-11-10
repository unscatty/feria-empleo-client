<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" app>
      <v-list>
        <v-list-item v-for="(item, i) in routesByRole" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="v-navigation-drawer__border"></div>
    </v-navigation-drawer>

    <v-app-bar clipped-left fixed app color="primary" dark>
      <div @click="goToMain" class="d-flex align-center">
        <v-img width="70" class="logo-white my-3" src="@/assets/img/escom_logo.png"></v-img>
      </div>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>

    <v-navigation-drawer v-model="rightDrawer" :right="right" permanent>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

    <!-- Snackbar -->
    <v-snackbar v-model="show" :timeout="toast.time" top right :color="toast.color">
      {{ toast.text }}
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { container } from '@/app.container';
import RoleType from '@/models/role.type';
import { CurrentUserService } from '@/services/current-user.service';
import { Component, Vue } from 'vue-property-decorator';

import { namespace } from 'vuex-class';
const ui = namespace('Ui');
@Component
export default class LayoutDashboard extends Vue {
  clipped = true;
  drawer = true;
  fixed = false;
  items = [
    {
      icon: 'mdi-apps',
      title: 'Vacantes',
      to: '/dashboard',
      roles: ['ADMIN', 'COMPANY'],
    },
    {
      icon: 'mdi-apps',
      title: 'Empresas',
      to: '/dashboard/empresas',
      roles: ['ADMIN'],
    },
  ];
  miniVariant = false;
  right = true;
  rightDrawer = false;
  title = 'Dashboard';
  userRole: RoleType = null;

  // Store
  @ui.State
  public toast!: any;

  @ui.Mutation
  public setToastVisibility!: (visible: boolean) => void;

  get show() {
    return this.toast.show;
  }

  set show(value) {
    this.setToastVisibility(value);
  }

  mounted() {
    const currentUserService = container.get(CurrentUserService);
    this.userRole = currentUserService.role;
  }

  get routesByRole() {
    return this.items.filter((i) => i.roles.some((r) => this.userRole === r));
  }

  goToMain() {
    this.$router.push('/');
  }
}
</script>

<style>
.logo-white {
  filter: brightness(0) invert(1);
}
</style>
