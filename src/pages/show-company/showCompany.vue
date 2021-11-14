<template>
  <div class="main">
    <div class="col-lg-6">
      <input
        type="text"
        placeholder="Buscar vacante"
        class="search"
        v-on:input="showCompanyComponent.filterPosition($event)"
        v-model="showCompanyComponent.data.filterText"
      />
      <div class="main-ws-sec">
        <div class="posts-section" v-if="showCompanyComponent.data.filteredPositions.length !== 0">
          <div
            class="post-bar"
            v-for="position in showCompanyComponent.data.filteredPositions"
            :key="position.id"
          >
            <Positions :position="position" />
          </div>
          <!--post-bar end-->

          <div class="process-comm">
            <div class="spinner">
              <div class="bounce1"></div>
              <div class="bounce2"></div>
              <div class="bounce3"></div>
            </div>
          </div>
          <!--process-comm end-->
        </div>

        <div v-if="showCompanyComponent.data.filteredPositions.length === 0">
          <div class="no-positions">
            <h1>Sin vacantes para mostrar</h1>
          </div>
        </div>
        <!--posts-section end-->
      </div>
      <!--main-ws-sec end-->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Positions from "../../components/positions/Positions.vue";
import Component from 'vue-class-component';
import { ShowCompanyComponent } from "./show-company.component";

@Component({
    components: {
        Positions
    }
})
export default class ShowCompany extends Vue {

    public showCompanyComponent: ShowCompanyComponent;
    public companyId: string;

    constructor() {
        super();
        this.showCompanyComponent = new ShowCompanyComponent();
    }

    async created() {
        this.companyId = this.$route.params.id;
        await this.showCompanyComponent.getEmployerById(this.companyId);
        await this.showCompanyComponent.getPositionsByCompany();
    }
}

</script>

<style scoped>
@import "./show-company.css";
</style>