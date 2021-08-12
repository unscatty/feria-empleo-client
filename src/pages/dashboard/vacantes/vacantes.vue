<template>
  <div>vacantes</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AdminVacantesComponent } from './vacantes.component';

@Component
export default class AdminVacantes extends Vue {
  private component: AdminVacantesComponent = new AdminVacantesComponent();

  created() {
    this.component.showMessage();
  }
}
</script>
<style></style>
