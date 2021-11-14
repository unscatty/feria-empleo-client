<template>
  <div id="app">
    <AppLayout>
      <router-view></router-view>
    </AppLayout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import AppLayout from './layouts/AppLayout.vue';

import Filters from './components/filters/Filters.vue';

@Component({
  components: {
    HelloWorld,
    AppLayout,
    Filters,
  },
})
export default class App extends Vue {}
</script>

<style></style>
