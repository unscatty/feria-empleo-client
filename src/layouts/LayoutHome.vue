<template>
  <v-app v-scroll="onScroll">
    <v-app-bar ref="appBar" id="app-bar" app color="primary" dark hide-on-scroll :scroll-threshold="50">
      <div class="d-flex align-center">
        <v-img width="70" class="logo-white my-3" src="@/assets/img/escom_logo.png"></v-img>
      </div>
      <v-spacer></v-spacer>

      <v-btn to="/" text>
        <v-icon> mdi-clipboard-list-outline </v-icon>
        <span class="mr-2">Vacantes</span>
      </v-btn>

      <v-btn to="/companies" text>
        <v-icon>mdi-office-building-outline </v-icon>
        <span class="ml-2">Empresas</span>
      </v-btn>

      <v-btn to="/profile" text>
        <v-icon>mdi-account </v-icon>
        <span class="mr-2">Perfil</span>
      </v-btn>

      <v-spacer></v-spacer>

      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item to="/dashboard">
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-card
      v-if="showFilters"
      dark
      color="secondary"
      class="layout-banner"
      :style="'margin-top:' + marginTop + 'px'"
      ref="banner"
    >
      <Filters />
    </v-card>

    <v-main class="pa-0 my-8">
      <slot />
    </v-main>

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
import { Component, Vue, Watch } from 'vue-property-decorator';
import Filters from '../components/filters/Filters.vue';
import { namespace } from 'vuex-class';
const ui = namespace('Ui');
@Component({ components: { Filters } })
export default class LayoutHome extends Vue {
  marginTop = 0;
  showFilters = false;

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
    const { appBar }: any = this.$refs;
    this.marginTop = appBar.$el.clientHeight;
    if (this.$route.name === 'home') {
      this.showFilters = true;
    }
  }

  @Watch('$route', { immediate: true, deep: true })
  onUrlChange(route: any) {
    if (route && route.name === 'home') {
      this.showFilters = true;
    } else {
      this.showFilters = false;
    }
  }

  onScroll() {
    const { appBar }: any = this.$refs;

    if (appBar.isActive && appBar.currentScroll > appBar.$el.clientHeight) {
      appBar.isActive = false;
    }
    if (appBar.currentScroll < appBar.$el.clientHeight) {
      appBar.isActive = true;
    }
  }
}
</script>
<style>
.logo-white {
  filter: brightness(0) invert(1);
}
.layout-banner {
  position: sticky;
  top: -1px;
  z-index: 2;
}
</style>
