<template>
  <div v-if="applyComponent.data.position !== null && applyComponent.data.candidate != null">
    <v-dialog v-model="applyComponent.data.modal" max-width="650">
      <v-card>
        <v-card-title style="background: #1a7eba" class="headline text-center white--text">
          Aplica a esta vacante
        </v-card-title>
        <v-card-text v-if="applyComponent.data.candidate.resume == null">
          <v-card-subtitle class="title ">Actualiza tu perfil </v-card-subtitle>
          <v-form ref="form" lazy-validation>
            <div class="file-content">
              Parece que no haz actualizado tu perfil, por favor actualizalo y agrega tu CV para que las empresas puedan saber
              mas sobre ti y tus habilidades. <br><br>
              <router-link :to=" '/profile/edit' "  class="router">
                Editar perfil
                <v-icon color="black">mdi-account</v-icon>
              </router-link>
            </div>
          </v-form>
        </v-card-text>
        <v-card-text v-if="applyComponent.data.candidate.resume != null" class="question">
          <div class="file-content">
            ¿Seguro desea aplicar a esta vacante?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="applyComponent.data.modal = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            :disabled="applyComponent.data.loading"
            :loading="applyComponent.data.loading"
            v-on:click="submitFile"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-parallax class="single-position__banner" dark height="350">
      <v-row class="p-5">
        <v-col class="single-position__banner-content" cols="12">
          <h1 class="text-h4  mb-4">
            {{ applyComponent.data.position.jobTitle }}
          </h1>
          <p
            v-if="applyComponent.data.position.salaryMin && applyComponent.data.position.salaryMax"
          >
            <b>
              {{ formatMoney(applyComponent.data.position.salaryMin) }} -
              {{ formatMoney(applyComponent.data.position.salaryMax) }} Mensual
            </b>
          </p>
          <p v-else>Salario no mostrado</p>
          <p>
            <b> Experiencia: {{ getExperienceText(applyComponent.data.position.experience) }} </b>
          </p>
          <div>
            <span class="mr-4"
              >Jornada:
              <b>
                {{ getJobTypeText(applyComponent.data.position.jobType) }}
              </b>
            </span>
            <span
              >Tipo de trabajo:
              <b>
                {{ getJobModeText(applyComponent.data.position.jobMode) }}
              </b>
            </span>
          </div>
        </v-col>
      </v-row>
    </v-parallax>
    <v-container class="pb-10">
      <div class="main-section-data">
        <v-row>
          <v-col lg="9" cols="12">
            <v-card>
              <!-- <span
                      v-if="applyComponent.data.position.createdAt"
                      class="position__creation-date"
                      >{{ timeAgo(new Date(applyComponent.data.position.createdAt)) }}</span
                    > -->
              <v-img
                v-if="applyComponent.data.position.imageURL"
                :src="applyComponent.data.position.imageURL"
                class="main-img"
              ></v-img>
              <v-row>
                <v-col>
                  <v-divider></v-divider>
                  <div class="pa-5 pt-10" v-html="applyComponent.data.position.requirements"></div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col lg="3" cols="12">
            <v-btn
              data-toggle="modal"
              data-target="#mymodal"
              color="primary"
              block
              @click="applyComponent.data.modal = true"
              class="white--text"
              data-whatever="@mdo"
            >
              Aplicar a esta vacante
            </v-btn>

            <v-card class="mt-6" outlined shaped>
              <v-toolbar flat>
                <v-card-title>{{ applyComponent.data.position.company.name }}</v-card-title>
              </v-toolbar>
              <v-divider></v-divider>
              <v-card-text class="widget widget-jobs">
                <div class="sd-title">
                  <h3>Acerca del empleador</h3>
                </div>
                <div class="sd-title paymethd">
                  <img
                    :src="applyComponent.data.position.company.imageURL"
                    class="img-thumbnail"
                  />
                </div>
                <div class="sd-title">
                  <h4>Sobre nosotros</h4>
                  <p>{{ applyComponent.data.position.company.description }}</p>
                  <h4>Dirección</h4>
                  <p>{{ applyComponent.data.position.company.address }}</p>
                  <h4>Trabajadores</h4>
                  <p>{{ applyComponent.data.position.company.staff }}</p>
                </div>
              </v-card-text>
              <!--widget-jobs end-->
            </v-card>
            <!--right-sidebar end-->
          </v-col>
        </v-row>
        <!-- freelancerbiding -->
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { formatMoney } from '@/utils/format-money';
import Vue from 'vue';
import Component from 'vue-class-component';
import { ApplyComponent } from './apply.component';
import Positions from '../../components/positions/Positions.vue';
import { JobModalityEnum, JobTypeEnum } from '@/utils/enums';
import { isEqual } from 'lodash';
import { experienceItems, jobPostModes, jobPostTypes } from '@/constants/job-post';

@Component({
  components: {
    Positions,
  },
})
export default class Apply extends Vue {
  public applyComponent: ApplyComponent;
  private id: string;
  public experienceItems = experienceItems;
  public jobPostModes = jobPostModes;
  public jobPostTypes = jobPostTypes;

  constructor() {
    super();
    this.applyComponent = new ApplyComponent();
  }

  async created() {
    this.id = this.$route.params.id;
    this.applyComponent.validateId(this.id, this);
    await this.applyComponent.getPosition(this.id);
    await this.applyComponent.getCandidate();
  }

  public submitFile() {
    this.applyComponent.submitFile(this);
  }

  public formatMoney(value: number) {
    return formatMoney(value);
  }

  public formatJobType(type: string = 'full_time' || 'part_time ') {
    return isEqual(type, 'full_time') ? JobTypeEnum.full_time : JobTypeEnum.part_time;
  }

  public formatJobMode(mode: string) {
    if (isEqual(mode, 'offie')) return JobModalityEnum.office;
    if (isEqual(mode, 'home_office')) return JobModalityEnum.home_office;
    return JobModalityEnum.hybrid;
  }

  public getExperienceText(value: string) {
    return this.experienceItems.find((e) => e.value === value).text;
  }
  public getJobTypeText(value: string) {
    return this.jobPostTypes.find((e) => e.value === value).text;
  }
  public getJobModeText(value: string) {
    return this.jobPostModes.find((e) => e.value === value).text;
  }
}
</script>
<style>
@import './apply.css';
</style>
