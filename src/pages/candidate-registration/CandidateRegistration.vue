<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="8">
        <v-card class="elevation-12 mt-5">
          <v-window>
            <v-window-item>
              <v-row>
                <v-col cols="12" class="primary d-flex justify-center align-center">
                  <v-img
                    max-height="250"
                    max-width="250"
                    class="candidate-registration__logo-white my-3"
                    src="@/assets/img/escom_logo.png"
                  ></v-img>
                </v-col>
                <v-col cols="12">
                  <v-card-text class="mt-3">
                    <h1 class="text-center display-2 " color="primary">
                      Feria del empleo en ESCOM
                    </h1>
                    <h4 class="text-center mt-4">
                      Ingresa tus datos para que las empresas puedan conocerte mejor
                    </h4>
                    <v-form class="mt-4" ref="form" lazy-validation>
                      <v-row>
                        <v-col cols="12" class="candidate-registration__input-item">
                          <v-text-field
                            label="Email"
                            disabled
                            :value="getAccount ? getAccount.idTokenClaims.emails[0] : ''"
                            prepend-icon="mdi-email"
                            type="text"
                          />
                        </v-col>
                        <v-col cols="12" class="candidate-registration__input-item">
                          <v-text-field
                            label="Nombre"
                            name="name"
                            :value="getAccount ? getAccount.idTokenClaims.name : ''"
                            prepend-icon="mdi-email"
                            type="text"
                            :rules="[rules.required]"
                          />
                        </v-col>
                        <v-col cols="12">
                          <h3 class="mt-2 subtitle ">Habilidades</h3>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            v-model="form.skillSets"
                            :items="skillSetItems"
                            label="Habilidades"
                            item-text="name"
                            multiple
                            chips
                            deletable-chips
                            return-object
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="6">
                          <h3 class="mt-2 subtitle ">Experiencia profesional</h3>
                        </v-col>
                        <v-col class="text-right" cols="6">
                          <v-btn @click="form.experienceDetails.push({})" color="primary" text>
                            <v-icon color="primary">
                              mdi-plus-circle-outline
                            </v-icon>
                            Agregar
                          </v-btn>
                        </v-col>
                        <v-col
                          v-for="(detail, index) in form.experienceDetails"
                          :key="'experience_' + index"
                          cols="12"
                        >
                          <v-card class="elevation-2">
                            <v-card-text>
                              <ExperienceDetailForm :form="detail"></ExperienceDetailForm>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col cols="6">
                          <h3 class="mt-2 subtitle ">Educación</h3>
                        </v-col>
                        <v-col class="text-right" cols="6">
                          <v-btn @click="form.educationDetails.push({})" color="primary" text>
                            <v-icon color="primary">
                              mdi-plus-circle-outline
                            </v-icon>
                            Agregar
                          </v-btn>
                        </v-col>
                        <v-col
                          v-for="(detail, index) in form.educationDetails"
                          :key="'detail_' + index"
                          cols="12"
                        >
                          <v-card class="elevation-2">
                            <v-card-text>
                              <EducationDetailsForm :form="detail"></EducationDetailsForm>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                  <div class="text-center mt-3 py-3 pb-5">
                    <v-btn rounded color="primary" @click="save" dark>Guardar</v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { rules } from '@/helpers/form';
import { VForm } from '@/models/form';
import { namespace } from 'vuex-class';
import AuthStore, { AUTH_STORE_NAME } from '@/store/modules/auth.store';
import EducationDetailsForm from '../../components/candidate/EducationDetailsForm.vue';
import ExperienceDetailForm from '../../components/candidate/ExperienceDetailForm.vue';

import { JOBPOST_STORE_NAME } from '@/store/modules/job-post';

const authStore = namespace(AUTH_STORE_NAME);
const jobStore = namespace(JOBPOST_STORE_NAME);

@Component({
  components: {
    EducationDetailsForm,
    ExperienceDetailForm,
  },
})
export default class CandidateRegistration extends Vue {
  form: any = {
    educationDetails: [{}],
    experienceDetails: [{}],
  };

  @authStore.Getter
  getAccount: typeof AuthStore.prototype.getAccount;

  // Refs
  @Ref('form') readonly formRef!: VForm;

  @jobStore.Action
  public findAllSkillSets!: () => void;

  @jobStore.State
  public skillSets!: any[];

  get rules() {
    return rules;
  }

  get skillSetItems() {
    return this.skillSets.map((s) => ({ name: s.name }));
  }

  created() {
    this.findAllSkillSets();
  }

  save() {
    const isValid = this.formRef.validate();
    if (!isValid) {
      return;
    }
  }
}
</script>

<style>
.candidate-registration__logo-white {
  filter: brightness(0) invert(1);
}

.candidate-registration__input-item {
  padding: 0 12px;
}
</style>
