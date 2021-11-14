<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
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
    },
    {
      icon: 'mdi-apps',
      title: 'Empresas',
      to: '/dashboard/empresas',
    },
  ];
  miniVariant = false;
  right = true;
  rightDrawer = false;
  title = 'Dashboard';

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
}
</script>

<style></style>
