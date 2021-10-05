<template>
  <v-container>
    <v-row>
      <v-col class="pa-0" cols="9">
        <v-autocomplete
          :items="jobPositionsGlobalSearch"
          :loading="loadingSearch"
          :search-input.sync="localFilters.search"
          color="white"
          clearable
          hide-selected
          item-text="jobTitle"
          item-value="API"
          label="Buscar"
          prepend-icon="mdi-magnify"
          return-object
          @change="searchChange"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                Buscar
                <strong>empleos</strong>
              </v-list-item-title>
            </v-list-item>
          </template>
          <template v-slot:item="data">
            <template :to="`/apply/${data.item.id}`">
              <v-list-item-avatar>
                <v-avatar size="36px">
                  <img v-if="data.item.image" alt="Avatar" :src="data.item.image" />
                  <v-icon v-else color="primary" v-text="data.item.jobTitle"></v-icon>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="data.item.jobTitle"></v-list-item-title>
                <v-list-item-subtitle v-html="data.item.companyName"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col class="pt-0" cols="12">
        <!-- JobType INI -->
        <v-menu
          v-model="menuJobType"
          :close-on-content-click="false"
          transition="scale-transition"
          bottom
          left
        >
          <template v-slot:activator="{ on, attrs }">
            <v-badge
              :value="localFilters.jobType ? localFilters.jobType : false"
              overlap
              icon="mdi-checkbox-marked"
              color="primary"
            >
              <v-btn color="accent" dark v-bind="attrs" v-on="on">
                Tipo
              </v-btn>
            </v-badge>
          </template>
          <v-card>
            <v-divider></v-divider>
            <v-list>
              <v-list-item v-for="(item, index) in jobPostTypes" :key="index">
                <v-list-item-action>
                  <v-switch
                    v-model="localFilters.jobType"
                    :value="item.value"
                    color="primary"
                  ></v-switch>
                </v-list-item-action>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="clearFilter('jobType')">
                Limpiar
              </v-btn>
              <v-btn color="primary" text @click="onFiltersChange">
                Aplicar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <!-- JobType INI -->

        <!-- JobMode INI -->
        <v-menu
          v-model="menuJobMode"
          :close-on-content-click="false"
          transition="scale-transition"
          bottom
          left
        >
          <template v-slot:activator="{ on, attrs }">
            <v-badge
              :value="localFilters.jobMode ? localFilters.jobMode : false"
              overlap
              icon="mdi-checkbox-marked"
              color="primary"
            >
              <v-btn color="accent" dark class="ml-4" v-bind="attrs" v-on="on">
                Modalidad
              </v-btn>
            </v-badge>
          </template>

          <v-card>
            <v-divider></v-divider>
            <v-list>
              <v-list-item v-for="(item, index) in jobPostModes" :key="index">
                <v-list-item-action>
                  <v-switch
                    v-model="localFilters.jobMode"
                    :value="item.value"
                    color="primary"
                  ></v-switch>
                </v-list-item-action>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="clearFilter('jobMode')">
                Limpiar
              </v-btn>
              <v-btn color="primary" text @click="onFiltersChange">
                Aplicar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <!-- JobMode FIN -->

        <!-- Experience INI -->
        <v-menu
          v-model="menuExperience"
          bottom
          left
          :close-on-content-click="false"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-badge
              :value="localFilters.experience ? localFilters.experience : false"
              overlap
              icon="mdi-checkbox-marked"
              color="primary"
            >
              <v-btn color="accent" class="ml-4" dark v-bind="attrs" v-on="on">
                Experiencia
              </v-btn>
            </v-badge>
          </template>

          <v-card>
            <v-divider></v-divider>
            <v-list>
              <v-list-item v-for="(item, index) in experienceItems" :key="index">
                <v-list-item-action>
                  <v-switch
                    v-model="localFilters.experience"
                    :value="item.value"
                    color="primary"
                  ></v-switch>
                </v-list-item-action>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="clearFilter('experience')">
                Limpiar
              </v-btn>
              <v-btn color="primary" text @click="onFiltersChange">
                Aplicar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <!-- Experience FIN -->

        <!-- Salary INI -->
        <v-menu
          v-model="menuSalary"
          bottom
          left
          :close-on-content-click="false"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-badge :value="salary" overlap icon="mdi-checkbox-marked" color="primary">
              <v-btn color="accent" class="ml-4" dark v-bind="attrs" v-on="on">
                Salario
              </v-btn>
            </v-badge>
          </template>

          <v-card>
            <v-divider></v-divider>
            <v-list>
              <v-list-item v-for="(item, index) in salaryItems" :key="index">
                <v-list-item-action>
                  <v-switch v-model="salary" :value="item.value" color="primary"></v-switch>
                </v-list-item-action>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="clearFilter('salary')">
                Limpiar
              </v-btn>
              <v-btn color="primary" text @click="onFiltersChange">
                Aplicar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <!-- Salary FIN -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { jobPostTypes, jobPostModes, experienceItems, salaryItems } from '@/constants/job-post';
import { IJobPost } from '@/models/job-post/job-post.interface';
import { IFilters } from '@/store/modules/job-post';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const jobPost = namespace('JobPost');

@Component
export default class Filters extends Vue {
  menuJobType = false;
  menuJobMode = false;
  menuExperience = false;
  menuSalary = false;
  delayTimerSearch: any = null;
  loadingSearch = false;
  searchItems: any[] = [];

  public jobPostTypes = jobPostTypes;
  public jobPostModes = jobPostModes;
  public experienceItems = experienceItems;
  public salaryItems = salaryItems;
  public salary: any = null;

  public localFilters: IFilters = {
    jobType: null,
    jobMode: null,
    experience: null,
    search: null,
  };

  // Store
  @jobPost.State
  public jobPositions!: IJobPost[];

  @jobPost.State
  public jobPositionsGlobalSearch!: any[];

  @jobPost.State
  public jobPostFilters!: IFilters;

  @jobPost.Mutation
  public updateFilters!: (filters: IFilters) => void;

  @jobPost.Action
  public findAllJobPosts!: () => void;

  @jobPost.Action
  public jobPostsGlobalSearch!: (search: string) => void;

  mounted() {
    this.localFilters = { ...this.jobPostFilters };
  }
  @Watch('localFilters.search')
  onSearch(val: string) {
    this.loadingSearch = true;
    clearTimeout(this.delayTimerSearch);
    this.delayTimerSearch = setTimeout(async () => {
      await this.jobPostsGlobalSearch(val);
      this.loadingSearch = false;
    }, 400);
  }

  searchChange(val: any) {
    if (val && val.id) {
      this.$router.push(`/apply/${val.id}`);
    }
  }

  async onFiltersChange() {
    const filters = { ...this.localFilters };
    if (this.salary) {
      if (this.salary.salaryMinGte) {
        filters.salaryMinGte = this.salary.salaryMinGte;
      } else {
        filters.salaryMinGte = null;
      }
      if (this.salary.salaryMaxLte) {
        filters.salaryMaxLte = this.salary.salaryMaxLte;
      } else {
        filters.salaryMaxLte = null;
      }
    } else {
      filters.salaryMinGte = null;
      filters.salaryMaxLte = null;
    }
    this.menuJobType = false;
    this.menuJobMode = false;
    this.menuExperience = false;
    this.menuSalary = false;
    this.updateFilters(filters);
    await this.findAllJobPosts();
  }

  async clearFilter(type: string) {
    if (type === 'experience') {
      this.localFilters.experience = null;
      this.menuExperience = false;
    }
    if (type === 'jobType') {
      this.localFilters.jobType = null;
      this.menuJobType = false;
    }
    if (type === 'jobMode') {
      this.localFilters.jobMode = null;
      this.menuJobMode = false;
    }
    if (type === 'salary') {
      this.localFilters.salaryMinGte = null;
      this.localFilters.salaryMaxLte = null;
      this.salary = null;
      this.menuSalary = false;
    }
    this.updateFilters(this.localFilters);
    await this.findAllJobPosts();
  }
}
</script>

<style>
@import './filters.css';
</style>
