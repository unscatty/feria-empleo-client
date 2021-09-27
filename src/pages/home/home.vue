<template>
  <div>
    <v-container>
      <div class="main-section-data">
        <v-row class="row">
          <v-col md="8" cols="12" v-if="loadingJobPositions">
            <v-skeleton-loader
              v-for="(item, index) in [0, 1]"
              :key="index"
              class="mt-4"
              type="card-avatar, article, actions"
            ></v-skeleton-loader>
          </v-col>
          <v-col md="8" cols="12" v-else-if="jobPositions.length > 0">
            <Positions
              v-for="(position, index) in jobPositions"
              :key="position.id"
              :position="position"
              class="position "
              :class="index !== 0 ? 'mt-5' : ''"
            />
          </v-col>
          <v-col v-else md="8" cols="12" class="d-flex justify-center align-center">
            <h2>
              Sin vacantes para mostrar
            </h2>
          </v-col>
          <v-col md="4" cols="12">
            <TopChart :endpoint="$router.resolve({ name: 'TopViewed' }).href">
              Más vistos
            </TopChart>
            <TopChart :endpoint="$router.resolve({ name: 'TopApplied' }).href">
              Más aplicadas
            </TopChart>
            <TopChart :endpoint="$router.resolve({ name: 'TopNew' }).href">
              Más Recientes
            </TopChart>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { HomeComponent } from './home.component';
import Filters from '../../components/filters/Filters.vue';
import Positions from '../../components/positions/Positions.vue';
import TopChart from '../../components/topchart/TopChart.vue';
import { namespace } from 'vuex-class';
import { IJobPost } from '@/models/job-post/job-post.interface';
const jobPost = namespace('JobPost');

@Component({
  components: {
    Filters,
    Positions,
    TopChart,
  },
})
export default class Home extends Vue {
  private component: HomeComponent = new HomeComponent();
  changeToolbar = false;
  fixedToobar = false;

  // Store
  @jobPost.State
  public jobPositions!: IJobPost[];

  @jobPost.State
  public loadingJobPositions!: boolean;

  @jobPost.Action
  public findAllJobPosts!: () => void;

  created() {
    this.findAllJobPosts();
  }
}
</script>

<style scoped>
@import './home.css';
</style>
