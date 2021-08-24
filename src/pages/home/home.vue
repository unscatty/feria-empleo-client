<template>
  <main>
    <div class="main-section">
      <div class="container">
        <div class="main-section-data">
          <div class="row">
            <Filters
                v-on:type="onSelectedType"
                v-on:modality="onModalitySelected"
                v-on:experience="onExperienceSelected"
                v-on:employerId="onEmployerIdSelected"
            />
            <div class="col-lg-6" v-if="component.positions.length > 0">
              <div class="main-ws-sec">
                <div class="posts-section">
                  <Positions
                    v-for="position in component.positions"
                    :key="position.id"
                    :position="position"
                    class="position"
                  />
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
                <!--posts-section end-->
              </div>
              <!-- main-ws-sec end -->
            </div>

            <div v-if="component.positions.length == 0" class="no-vacants">
              Sin vacantes para mostrar
            </div>
            <div class="col-lg-3">
              <div class="right-sidebar">
                <TopChart
                  :endpoint="$router.resolve({ name: 'TopViewed' }).href"
                >
                  Más vistos
                </TopChart>
                <TopChart
                  :endpoint="$router.resolve({ name: 'TopApplied' }).href"
                >
                  Más aplicadas
                </TopChart>
                <TopChart
                  :endpoint="$router.resolve({ name: 'TopNew' }).href"
                >
                  Más Recientes
                </TopChart>
              </div>
              <!--right-sidebar end-->
            </div>
          </div>
        </div>
        <!-- main-section-data end-->
      </div>
    </div>
  </main>
</template>

<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import { HomeComponent } from "./home.component";
import Filters from '../../components/filters/Filters.vue';
import Positions from '../../components/positions/Positions.vue';
import TopChart from '../../components/topchart/TopChart.vue';

@Component({ 
    components: {
        Filters,
        Positions,
        TopChart
    }
    })
export default class Home extends Vue {

    private component: HomeComponent = new HomeComponent();

    public onSelectedType(type: string) {
        this.component.filters.type = type;
        this.component.getFilteredPositions();
    }

    public onModalitySelected(modality: string) {
      this.component.filters.modality = modality;
      this.component.getFilteredPositions();
    }

    public onExperienceSelected(exp: string) {
      this.component.filters.experience = exp;
      this.component.getFilteredPositions();
    }

    public onEmployerIdSelected(employerId: string) {
      this.component.filters.employerId = employerId;
      this.component.getFilteredPositions();
    }

    created() {
        this.component.getPositions();
    }
}
</script>

<style scoped>
@import "./home.css";
</style>
