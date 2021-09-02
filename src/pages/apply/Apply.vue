<template>
  <div v-if="applyComponent.data.position !== null">
    <v-dialog v-model="applyComponent.data.modal" max-width="650">
      <v-card>
        <v-card-title
          style="background: #1a7eba"
          class="headline text-center white--text"
        >
          Aplica a esta vacante
        </v-card-title>
        <v-card-text>
          <v-card-subtitle class="title ">Adjunta tu CV en formato PDF
          </v-card-subtitle>
          <v-form ref="form" lazy-validation>
            <div class="file-content">
              <v-file-input
                v-model="applyComponent.data.file"
                show-size
                :rules="[applyComponent.data.rules.required]"
                label="Curriculum"
              ></v-file-input>
            </div>
          </v-form>
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
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <main>
      <div class="main-section">
        <div class="container">
          <div class="main-section-data">
            <div class="row">
              <div class="col-xl-9 col-lg-9 col-md-12">
                <v-card class="bids-detail">
                  <v-row>
                    <v-col cols="12" class="appliedjob">
                      <ul>
                        <li>
                          <h3>Jornada</h3>
                          <br />
                          <p>{{formatJobType(applyComponent.data.position.jobType) }}</p>
                        </li>
                        <li>
                          <h3>Tipo de trabajo</h3>
                          <br />
                          <p>{{ formatJobMode(applyComponent.data.position.jobMode) }}</p>
                        </li>
                        <li>
                          <div>Salario</div>
                          <br />
                          <p>
                            {{ formatMoney(applyComponent.data.position.salaryMin) }} a
                            {{ formatMoney(applyComponent.data.position.salaryMax) }}
                          </p>
                        </li>
                      </ul>
                    </v-col>
                  </v-row>
                </v-card>
                <div class="main-ws-sec">
                  <Positions
                    :position="applyComponent.data.position"
                    :show-see-more="false"
                    :compacted="true"
                  />
                </div>
              </div>
              <div class="col-xl-3 col-lg-3 col-md-12">
                <div class="right-sidebar">
                  <div class="mb-3">
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
                  </div>
                  <!--widget-about end-->

                  <!--widget-about end-->
                  <div v-if="applyComponent.data.position.company.name" class="widget widget-jobs">
                    <div class="sd-title">
                      <h3>Acerca del empleador</h3>
                    </div>
                    <div class="sd-title paymethd">
                      <img
                        :src="applyComponent.data.position.company.imageUrl"
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
                  </div>
                  <!--widget-jobs end-->
                </div>
                <!--right-sidebar end-->
              </div>
            </div>
            <!-- freelancerbiding -->
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { formatMoney } from '@/utils/format-money';
import Vue from 'vue'
import Component from 'vue-class-component';
import { ApplyComponent } from "./apply.component";
import Positions from "../../components/positions/Positions.vue";
import { JobModalityEnum, JobTypeEnum } from '@/utils/enums';
import { isEqual } from 'lodash';

@Component({
    components: {
        Positions
    }
})
export default class Apply extends Vue {

    public applyComponent: ApplyComponent;
    private id: string;

    constructor() {
        super();
        this.applyComponent = new ApplyComponent();
    }

    async created() {
        this.id = this.$route.params.id;
        this.applyComponent.validateId(this.id, this);
        await this.applyComponent.getPosition(this.id);
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
}

</script>
<style>
@import "./apply.css";
</style>