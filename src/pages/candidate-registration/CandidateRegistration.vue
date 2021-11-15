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
                    <h1 class="text-center display-2" color="primary">Feria del empleo en ESCOM</h1>
                    <h4 class="text-center mt-4">
                      Ingresa tus datos para que las empresas puedan conocerte mejor
                    </h4>
                    <v-form ref="form" :disabled="loading" class="mt-4" lazy-validation>
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
                            v-model="form.name"
                            label="Nombre"
                            :value="getAccount ? getAccount.idTokenClaims.given_name : ''"
                            prepend-icon="mdi-email"
                            type="text"
                            :rules="[rules.required]"
                          />
                        </v-col>
                        <v-col cols="12" class="candidate-registration__input-item">
                          <v-text-field
                            v-model="form.lastname"
                            label="Apellido"
                            :value="getAccount ? getAccount.idTokenClaims.family_name : ''"
                            prepend-icon="mdi-email"
                            type="text"
                            :rules="[rules.required]"
                          />
                        </v-col>
                        <v-col cols="12">
                          <h3 class="mt-2 subtitle">Habilidades</h3>
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
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="6">
                          <h3 class="mt-2 subtitle">Experiencia profesional</h3>
                        </v-col>
                        <v-col class="text-right" cols="6">
                          <v-btn color="primary" text @click="form.experienceDetails.push({})">
                            <v-icon color="primary"> mdi-plus-circle-outline </v-icon>
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
                              <ExperienceDetailForm :form="detail">
                                <v-col class="text-right" cols="12">
                                  <v-btn
                                    color="danger"
                                    text
                                    @click="form.experienceDetails.splice(index, 1)"
                                  >
                                    <v-icon color="error"> mdi-minus-circle-outline </v-icon>
                                  </v-btn>
                                </v-col>
                              </ExperienceDetailForm>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col cols="6">
                          <h3 class="mt-2 subtitle">Educación</h3>
                        </v-col>
                        <v-col class="text-right" cols="6">
                          <v-btn color="primary" text @click="form.educationDetails.push({})">
                            <v-icon color="primary"> mdi-plus-circle-outline </v-icon>
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
                              <EducationDetailsForm :form="detail">
                                <v-col class="text-right" cols="12">
                                  <v-btn
                                    color="danger"
                                    text
                                    @click="form.educationDetails.splice(index, 1)"
                                  >
                                    <v-icon color="error"> mdi-minus-circle-outline </v-icon>
                                  </v-btn>
                                </v-col>
                              </EducationDetailsForm>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                  <div class="text-center mt-3 py-3 pb-5">
                    <v-btn :loading="loading" rounded color="primary" dark @click="save">
                      Guardar
                    </v-btn>
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

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { rules } from '@/helpers/form';
import { VForm } from '@/models/form';
import { namespace } from 'vuex-class';
import EducationDetailsForm from '../../components/candidate/EducationDetailsForm.vue';
import ExperienceDetailForm from '../../components/candidate/ExperienceDetailForm.vue';
import { lazyInject } from '@/app.container';

import { JOBPOST_STORE_NAME } from '@/store/modules/job-post';
import AuthService from '../../auth/auth.service';
import axios from 'axios';
import { isUndefined } from 'lodash';

const jobStore = namespace(JOBPOST_STORE_NAME);
const uiStore = namespace('Ui');

@Component({
  components: {
    EducationDetailsForm,
    ExperienceDetailForm,
  },
})
export default class CandidateRegistration extends Vue {
  form: any = {
    educationDetails: [],
    experienceDetails: [],
  };
  loading = false;

  // Refs
  @Ref('form') readonly formRef!: VForm;

  @jobStore.Action
  public findAllSkillSets!: () => void;

  @jobStore.State
  public skillSets!: any[];

  @uiStore.Action
  public showToast!: (config: any) => void;

  @lazyInject(AuthService)
  authService: AuthService;

  get rules() {
    return rules;
  }

  get skillSetItems() {
    if (isUndefined(this.skillSets)) {
      return [];
    }
    return this.skillSets.map((s) => ({ name: s.name, value: s.id }));
  }

  get getAccount() {
    return this.authService.account;
  }

  get tokenClaims(): any {
    return this.getAccount.idTokenClaims;
  }

  created() {
    this.findAllSkillSets();

    this.form.name = this.tokenClaims.given_name;
    this.form.lastname = this.tokenClaims.family_name;
  }

  async save() {
    const isValid = this.formRef.validate();
    if (!isValid) {
      return;
    }
    this.loading = true;

    try {
      await axios.post('candidate/register', this.form);
      this.$router.replace('/');
    } catch (error) {
      switch (error.response.data.error) {
        case 'USER_ALREADY_EXISTS':
          this.$router.replace('/');
          break;

        default:
          this.showToast({
            text: 'Error en el registro contacta a un administrador',
            color: 'error',
          });
          break;
      }
    } finally {
      this.loading = false;
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
