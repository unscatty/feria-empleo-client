<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="8">
          <p class="text-md-left text-sm-center text-h4 text-md-h4 text-sm-h5 mt-n6">
            Bienvenido {{ companyToUpdate.user.name }} {{ companyToUpdate.user.lastname }}
          </p>
          <p class="text-md-left text-sm-center text-h6 text-md-h6 text-sm-subtitle-1">
            Has sido asignado como responsable de la empresa {{ companyToUpdate.name }}
          </p>
          <p class="text-md-left text-sm-center text-subtitle-1 text-md-subtitle-1 text-sm-caption">
            Por favor proporciona los siguientes datos
          </p>
          <div>
            <template>
              <v-stepper v-model="currentStepCounter">
                <v-stepper-header>
                  <template v-for="(step, index) in steps">
                    <v-stepper-step
                      :key="`${index}-step`"
                      :complete="currentStepIndex > index"
                      :step="index + 1"
                    >
                      {{ step.title }}
                    </v-stepper-step>
                    <v-divider v-if="index + 1 !== steps.length" :key="index"></v-divider>
                  </template>
                </v-stepper-header>

                <v-stepper-items>
                  <v-stepper-content
                    v-for="(step, index) in steps"
                    :key="`${index}-content`"
                    :step="index + 1"
                  >
                    <component :is="step.component" ref="stepRefs"></component>
                  </v-stepper-content>
                  <v-row>
                    <v-col class="text-md-left text-sm-center" cols="6" md="6" sm="12">
                      <v-btn class="ma-2" color="red accent-4" outlined @click="cancel"
                        >Lo haré después</v-btn
                      >
                    </v-col>

                    <v-col class="text-md-right text-sm-center" cols="6" md="6" sm="12">
                      <v-btn
                        class="ma-2"
                        color="secondary"
                        text
                        :disabled="!canGoBack"
                        @click="previousStep"
                      >
                        Regresar
                      </v-btn>
                      <v-btn
                        class="ma-2"
                        color="primary"
                        :disabled="!isCurrentStepValid"
                        @click="nextStep"
                      >
                        {{ nextButtonName }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-stepper-items>
              </v-stepper>
            </template>
          </div>
        </v-col>
        <v-dialog v-model="showConfirmDialog" max-width="290">
          <v-card>
            <v-card-title class="text-h5"> Actualizar datos </v-card-title>

            <v-card-text> ¿Estás seguro que deseas continuar? </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="blue-grey darken-1" text @click="showConfirmDialog = false">
                Cancelar
              </v-btn>

              <v-btn color="primary" :loading="isUpdating" text @click="runUpdate">
                Continuar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Step1 from '@/components/companies/registration/steps/Step1.vue';
import Step2 from '@/components/companies/registration/steps/Step2.vue';
import Actionable from '@/helpers/actionable.interface';
import ValidableForm from '@/helpers/validable-form.interface';
import ICompany from '@/models/company/company.interface';
import { homePath } from '@/routes';
import CompanyStore, { COMPANY_STORE_NAME } from '@/store/modules/company';
import Ui from '@/store/modules/ui';
import { Component, Ref, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const companyStore = namespace(COMPANY_STORE_NAME);
const uiStore = namespace('Ui');

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

type StepType = Actionable & ValidableForm;
type Step = { title: string; component: Type<StepType> };

@Component({})
export default class CompanyRegisration extends Vue {
  steps: Step[] = [
    {
      title: 'Imagen y nombre de la empresa',
      component: Step1,
    },
    {
      title: 'Datos del responsable',
      component: Step2,
    },
  ];

  validations: boolean[] = Array(this.steps.length).fill(false);

  isCurrentStepValid = true;

  currentStepIndex_ = 0;
  showConfirmDialog = false;
  isUpdating = false;

  @Ref()
  stepRefs: StepType[];

  @uiStore.Action
  showToast: typeof Ui.prototype.showToast;

  @companyStore.State('toUpdate')
  readonly companyToUpdate: ICompany;

  @companyStore.Action(CompanyStore.prototype.setCompany.name)
  setCompany: typeof CompanyStore.prototype.setCompany;

  @companyStore.Action(CompanyStore.prototype.updateCurrent.name)
  updateCurrentCompany: typeof CompanyStore.prototype.updateCurrent;

  @companyStore.Action(CompanyStore.prototype.updateImageCurrent.name)
  updateImageCurrentCompany: typeof CompanyStore.prototype.updateImageCurrent;

  get nextButtonName() {
    if (this.currentStepCounter === this.steps.length) {
      return 'Terminar';
    }

    return 'Continuar';
  }

  get currentStepIndex() {
    return this.currentStepIndex_;
  }

  set currentStepIndex(value) {
    this.currentStepIndex_ = value;
  }

  get currentStepCounter() {
    return this.currentStepIndex + 1;
  }

  set currentStepCounter(value) {
    this.currentStepIndex = value - 1;
  }

  get currentStepValid() {
    return this.validations[this.currentStepIndex];
  }

  set currentStepValid(value) {
    this.isCurrentStepValid = value;
  }

  created() {
    // Load company info into store
    this.setCompany();
  }

  mounted() {
    this.validations = this.stepRefs.map((step) => step.isValid);

    this.steps.forEach((_, index) => {
      this.$watch(
        () => {
          return this.stepRefs[index].isValid;
        },
        (val) => {
          this.validations[index] = val;

          if (this.currentStepIndex === index) {
            this.isCurrentStepValid = val;
          }
        }
      );
    });
  }

  nextStep() {
    const validStep = this.validateCurrentStep();

    if (validStep) {
      // Perform action of current step
      this.currentStepPerform();

      // Move to next step
      if (this.currentStepCounter < this.steps.length) {
        this.currentStepCounter += 1;

        this.currentStepValid = this.validations[this.currentStepIndex];
      } else {
        // Open confirm dialog
        this.showConfirmDialog = true;
      }
    }
  }

  previousStep() {
    if (this.currentStepCounter > 1) {
      this.currentStepCounter -= 1;

      this.isCurrentStepValid = this.validations[this.currentStepIndex];
    }
  }

  get canGoBack() {
    return this.currentStepIndex > 0;
  }

  getCurrentStepRef() {
    if (this.stepRefs) {
      return this.stepRefs[this.currentStepIndex];
    }
  }

  currentStepPerform() {
    this.getCurrentStepRef().perform();
  }

  validateCurrentStep(): boolean {
    // Get current step ref
    const currentStepRef = this.getCurrentStepRef();

    this.isCurrentStepValid = currentStepRef.validate() && currentStepRef.isValid;

    return this.isCurrentStepValid;
  }

  cancel() {
    this.$router.push(homePath);
  }

  async runUpdate() {
    this.isUpdating = true;

    try {
      await this.updateImageCurrentCompany();
    } catch (error) {
      console.error(error);
      this.showToast({
        text: 'Ocurrió un error al tratar de actualizar la imagen\nPor favor contacta a un administrador',
        color: 'error',
      });
    }

    try {
      await this.updateCurrentCompany();
    } catch (error) {
      console.error(error);
      this.showToast({
        text: 'Ocurrió un error al tratar de actualizar la información de la empresa\nPor favor contacta a un administrador',
        color: 'error',
      });
    }

    this.isUpdating = false;
    this.showConfirmDialog = false;

    this.showToast({
      text: 'Datos de empresa actualizados',
      color: 'success',
    });

    this.$router.push(homePath);
  }
}
</script>

<style scoped></style>
