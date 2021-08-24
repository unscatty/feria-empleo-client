<template>
  <v-container>
    <v-row>
      <v-col class="text-center text-md-right mb-3">
        <v-btn
          color="primary"
          @click="
            component.currentPosition = null;
            component.dialog = true;
          "
        >
          <v-icon class="mr-2">mdi-plus-circle</v-icon>
          Agregar vacante
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-card class="card">
          <v-card-text>
            <v-data-table
              ref="table"
              item-class="success"
              :headers="component.headers"
              :items="jobPositions"
              :server-items-length="jobsPaginationData.totalItems"
              :options.sync="pagOptions"
              :footer-props="{
                disableItemsPerPage: true,
                itemsPerPageText: '',
              }"
              :loading="component.loadingTable"
              no-data-text="Sin datos para mostrar"
              :mobile-breakpoint="0"
            >
              <template slot="loading">
                <div class="mt-5">
                  <p>Cargando...</p>
                </div>
              </template>
              <template v-slot:[`item.imageUrl`]="{ item }">
                <v-img max-height="70" aspect-ratio="1" contain :src="item.imageUrl"></v-img>
              </template>
              <template v-slot:[`item.salary`]="{ item }">
                {{ item.salaryMin }} -
                {{ item.salaryMax }}
              </template>
              <template v-slot:[`item.jobType`]="{ value }">
                {{ component.parseJobType(value) }}
              </template>
              <template v-slot:[`item.jobMode`]="{ value }">
                {{ component.parseJobMode(value) }}
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-icon class="mx-2" @click="component.editPosition(item)">
                  mdi-pencil
                </v-icon>
                <v-icon class="mx-2" @click="component.openDeleteDialog(item)">
                  mdi-trash-can-outline
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <AddEditJobPost
      :position="component.currentPosition"
      :dialog="component.dialog"
      :isUpdate="component.updating"
      @close="closeDialog"
    ></AddEditJobPost>

    <v-dialog v-model="component.deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline"> Eliminar vacante </v-card-title>
        <v-card-text> ¿Estas seguro que deseas eliminar esta vacante?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="component.loading"
            color="green darken-1"
            text
            @click="component.deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            :loading="component.loading"
            color="green darken-1"
            text
            @click="onDeleteJobPost()"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import AddEditJobPost from '@/components/job-post/AddEditJobPost.vue';
import { namespace } from 'vuex-class';

import { IJobPost } from '@/models/job-post/job-post.interface';
import { AdminVacantesComponent } from './vacantes.component';
import { IFilters } from '@/store/modules/job-post';

const jobPost = namespace('JobPost');
@Component({
  components: { AddEditJobPost },
})
export default class AdminVacantes extends Vue {
  private component: AdminVacantesComponent = new AdminVacantesComponent();

  // Store
  @jobPost.State
  public jobPositions!: IJobPost[];

  @jobPost.State
  public jobsPaginationData!: any;

  @jobPost.State
  public jobPostFilters!: IFilters;

  @jobPost.Mutation
  public updateFilters!: (filters: IFilters) => void;

  @jobPost.Action
  public findAllJobPosts!: () => void;

  @jobPost.Action
  public findAllSkillSets!: () => void;

  @jobPost.Action
  public deleteJobPost!: (id: number) => void;

  public pagOptions: any = {};

  @Watch('pagOptions')
  async pagOptionsChange() {
    const { page } = this.pagOptions;
    this.updateFilters({ page });
    this.component.loadingTable = true;
    await this.findAllJobPosts();
    this.component.loadingTable = false;
  }

  async created() {
    this.pagOptions = {
      itemsPerPage: this.jobPostFilters.limit,
    };

    this.findAllSkillSets();
  }

  async onDeleteJobPost() {
    this.component.loading = true;
    await this.deleteJobPost(this.component.currentPosition.id);
    this.component.loading = false;
    this.component.deleteDialog = false;
  }

  closeDialog() {
    this.component.dialog = false;
    this.component.updating = false;
  }
}
</script>
<style></style>
