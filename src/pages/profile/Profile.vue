<template>
  <div v-if="candidate">
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-card class="mx-auto" max-width="434" tile>
            <v-img
              height="100%"
              src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
            ></v-img>
            <v-col>
              <v-avatar color="primary" size="70" style="position: absolute; top: 130px">
                <span class="white--text text-h5">{{ userInitials }}</span>
              </v-avatar>
            </v-col>
            <v-list-item class="mt-5" color="rgba(0, 0, 0, .4)">
              <v-list-item-content>
                <v-list-item-title class="title"
                  >{{ user.name }} {{ user.lastname }}</v-list-item-title
                >
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>

          <v-card tile class="mt-8">
            <v-toolbar flat>
              <v-toolbar-title>Datos de contacto</v-toolbar-title>
              <v-spacer></v-spacer>

              <v-btn v-if="!addEditContact" text color="primary" @click="onEditContact">
                Cambiar
              </v-btn>
            </v-toolbar>

            <v-list v-if="contact && !addEditContact">
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title>Telefono</v-list-item-title>

                  <v-list-item-subtitle>
                    {{ contact.phone }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title>Direccion</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ contact.address }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-card-text v-if="contact && !addEditContact">
              <v-row>
                <v-col v-if="contact.webSite" class="text-center">
                  <v-btn :href="contact.webSite" target="_blank" fab icon color="primary">
                    <v-icon>mdi-web</v-icon>
                  </v-btn>
                </v-col>
                <v-col v-if="contact.linkedinUrl" class="text-center">
                  <v-btn :href="contact.linkedinUrl" target="_blank" fab icon color="primary">
                    <v-icon>mdi-linkedin</v-icon>
                  </v-btn>
                </v-col>
                <v-col v-if="contact.facebookUrl" class="text-center">
                  <v-btn :href="contact.facebookUrl" target="_blank" fab icon color="primary">
                    <v-icon>mdi-facebook</v-icon>
                  </v-btn>
                </v-col>
                <v-col v-if="contact.githubUrl" class="text-center">
                  <v-btn :href="contact.githubUrl" target="_blank" fab icon color="primary">
                    <v-icon>mdi-github</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text v-if="addEditContact">
              <v-form ref="formContact" lazy-validation>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="contact.phone"
                      :rules="[rules.required]"
                      label="Telefono"
                      type="text"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="contact.address"
                      :rules="[rules.required]"
                      label="Dirección"
                      type="text"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="contact.webSite" label="Web" type="text" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="contact.linkedinUrl" label="Linkedin" type="text" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="contact.facebookUrl" label="Facebook" type="text" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="contact.githubUrl" label="Github" type="text" />
                  </v-col>
                  <v-col cols="12">
                    <v-btn color="danger" @click="addEditContact = false"> Cancelar </v-btn>
                    <v-btn color="primary" text class="ml-2" @click="updateCandidate">
                      Actualizar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
          <v-card class="mt-8">
            <v-toolbar flat>
              <v-toolbar-title>Curriculum</v-toolbar-title>
              <v-spacer></v-spacer>

              <v-btn
                v-if="!addEditResume && candidate.resume"
                text
                color="primary"
                @click="addEditResume = !addEditResume"
              >
                Cambiar
              </v-btn>
            </v-toolbar>
            <v-card-text v-if="candidate.resume && !addEditResume">
              <a :href="candidate.resume" target="_blank"
                ><v-icon>mdi-download</v-icon> Descargar</a
              >
            </v-card-text>
            <v-card-text v-else>
              <v-form ref="formResume" lazy-validation>
                <v-file-input
                  v-model="resume"
                  show-size
                  :loading="loadingResume"
                  :rules="[rules.required]"
                  label="Curriculum"
                  accept="application/pdf"
                ></v-file-input>
                <v-btn :loading="loadingResume" color="danger" @click="addEditResume = false">
                  Cancelar
                </v-btn>
                <v-btn
                  :loading="loadingResume"
                  color="primary"
                  text
                  class="ml-2"
                  @click="updateResume"
                >
                  Actualizar
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="8">
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title>Experiencia profesional</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn
                v-if="!addEditExperience"
                text
                color="primary"
                @click="
                  experienceDetailForm = {};
                  addEditExperience = !addEditExperience;
                "
              >
                Agregar
              </v-btn>
            </v-toolbar>
            <v-divider></v-divider>

            <v-card-text>
              <div v-if="!addEditExperience">
                <v-list-item
                  v-for="experience in candidate.experienceDetails"
                  :key="experience.id"
                  @click="
                    experienceDetailForm = experience;
                    addEditExperience = true;
                  "
                >
                  <v-list-item-content>
                    <v-list-item-title class="title"
                      >{{ experience.jobTitle }} - {{ experience.companyName }}</v-list-item-title
                    >
                    <v-list-item-subtitle
                      >{{ getYear(experience.startDate) }} -
                      {{
                        experience.isCurrentjob ? 'Actualidad' : getYear(experience.endDate)
                      }}</v-list-item-subtitle
                    >

                    <p class="mt-5">{{ experience.jobDescription }}</p>
                  </v-list-item-content>
                </v-list-item>
              </div>

              <ExperienceDetailForm
                v-if="addEditExperience"
                :form="experienceDetailForm"
                @onSubmitForm="updateCandidate"
              >
                <v-col class="text-right" cols="12">
                  <v-btn color="danger" text @click="removeExperienceDetail">
                    <v-icon color="error"> mdi-minus-circle-outline </v-icon>
                  </v-btn>
                </v-col>
                <template slot="footer" slot-scope="{ onSubmit }">
                  <v-btn color="danger" @click="addEditExperience = false"> Cancelar </v-btn>
                  <v-btn text class="ml-2" @click="onSubmit"> Actualizar </v-btn>
                </template>
              </ExperienceDetailForm>
            </v-card-text>
          </v-card>

          <v-card class="mt-8">
            <v-toolbar flat>
              <v-toolbar-title>Habilidades</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn
                text
                color="primary"
                @click="addEditSkillSets ? (addEditSkillSets = false) : onAddSkillSets()"
              >
                {{ addEditSkillSets ? 'Cancelar' : 'Agregar' }}
              </v-btn>
            </v-toolbar>
            <v-divider></v-divider>

            <v-card-text>
              <div v-if="!addEditSkillSets">
                <v-chip v-for="skill in candidate.skillSets" :key="skill.id" class="mr-2">
                  {{ skill.name }}
                </v-chip>
              </div>

              <v-autocomplete
                v-if="addEditSkillSets"
                v-model="skillSetsForm"
                :loading="loadingSkillSets"
                :items="skillSetItems"
                label="Habilidades"
                item-text="name"
                multiple
                chips
                deletable-chips
              ></v-autocomplete>
            </v-card-text>
            <v-card-actions v-if="addEditSkillSets">
              <v-btn
                :loading="loadingSkillSets"
                text
                color="primary"
                class="ml-2"
                @click="updateCandidate"
              >
                Actualizar
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card class="mt-8">
            <v-toolbar flat>
              <v-toolbar-title>Educación</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn
                v-if="!addEditEducation"
                text
                color="primary"
                @click="
                  educationDetailForm = {};
                  addEditEducation = !addEditEducation;
                "
              >
                Agregar
              </v-btn>
            </v-toolbar>
            <v-divider></v-divider>

            <v-card-text>
              <div v-if="!addEditEducation">
                <v-list-item
                  v-for="education in candidate.educationDetails"
                  :key="education.id"
                  @click="
                    educationDetailForm = education;
                    addEditEducation = true;
                  "
                >
                  <v-list-item-content>
                    <v-list-item-title class="title">{{
                      education.institutionName
                    }}</v-list-item-title>
                    <v-list-item-subtitle
                      >{{ getYear(education.startDate) }} -
                      {{
                        education.currentlyInSchool ? 'Actualidad' : getYear(education.endDate)
                      }}</v-list-item-subtitle
                    >

                    <p class="mt-5">{{ getLevel(education.level) }} - {{ education.degree }}</p>
                  </v-list-item-content>
                </v-list-item>
              </div>

              <EducationDetailsForm
                v-if="addEditEducation"
                :form="educationDetailForm"
                @onSubmitForm="updateCandidate"
              >
                <v-col class="text-right" cols="12">
                  <v-btn color="danger" text @click="removeEducationDetail">
                    <v-icon color="error"> mdi-minus-circle-outline </v-icon>
                  </v-btn>
                </v-col>

                <template slot="footer" slot-scope="{ onSubmit }">
                  <v-btn color="danger" @click="addEditEducation = false"> Cancelar </v-btn>
                  <v-btn text class="ml-2" color="primary" @click="onSubmit"> Actualizar </v-btn>
                </template>
              </EducationDetailsForm>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { head, isUndefined } from 'lodash';
import moment from 'moment';
import Vue from 'vue';
import Component from 'vue-class-component';
import EducationDetailsForm from '@/components/candidate/EducationDetailsForm.vue';
import ExperienceDetailForm from '@/components/candidate/ExperienceDetailForm.vue';

import { levelItems } from '@/constants/candidate';
import { namespace } from 'vuex-class';
import { JOBPOST_STORE_NAME } from '@/store/modules/job-post';
import { diffObjects, rules } from '@/helpers/form';
import { Ref } from 'vue-property-decorator';
import { VForm } from '@/models/form';

const jobStore = namespace(JOBPOST_STORE_NAME);

const month = 1;
const year = 3;

@Component({
  components: { EducationDetailsForm, ExperienceDetailForm },
})
export default class Profile extends Vue {
  public candidate: any = null;
  public contact: any = null;
  educationDetailForm: any = {};
  experienceDetailForm: any = {};
  skillSetsForm: any[] = [];
  oldContact: any = {};
  resume: any = null;

  addEditContact = false;
  addEditEducation = false;
  addEditExperience = false;
  addEditSkillSets = false;
  addEditResume = false;

  loadingSkillSets = false;
  loadingResume = false;

  details: any;
  levelItems = levelItems;
  @Ref('formContact') readonly formRefContact!: VForm;
  @Ref('formResume') readonly formRefResume!: VForm;

  @jobStore.Action
  public findAllSkillSets!: () => void;

  @jobStore.State
  public skillSets!: any[];

  created() {
    this.getCandidate();
    this.getContactDetails();
    this.findAllSkillSets();
  }

  get skillSetItems() {
    if (isUndefined(this.skillSets)) {
      return [];
    }
    return this.skillSets.map((s) => ({ name: s.name, value: s.id }));
  }

  get rules() {
    return rules;
  }

  public async getCandidate() {
    try {
      const res = await axios.get('/candidate');
      this.candidate = head(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  public async getContactDetails() {
    try {
      const res = await axios.get('/candidate/contact');
      this.contact = head(res.data);
      if (this.contact) {
        this.oldContact = { ...this.contact };
      }
    } catch (error) {
      console.log(error);
    }
  }

  getYear(date: Date) {
    if (!date) return '';
    return moment(date).format('MM/YYYY');
  }

  getStringDate(date: string) {
    const givenDate = new Date(date).toString().split(' ');
    return `${givenDate[month]} ${givenDate[year]}`;
  }

  getLevel(level: string) {
    return levelItems.find((v) => (v.value = level)).text;
  }

  get user() {
    return this.candidate.user;
  }

  get userInitials() {
    const fullName = this.user.name + ' ' + this.user.lastname;
    const splitName = fullName.split(' ');

    return `${splitName[0].charAt(0)}${splitName[1] ? splitName[1].charAt(0) : ''}`;
  }

  onAddSkillSets() {
    this.addEditSkillSets = true;
    this.skillSetsForm = !isUndefined(this.candidate.skillSets)
      ? this.candidate.skillSets.map((s: any) => s.id)
      : [];
  }

  onEditContact() {
    if (!this.contact) {
      this.contact = {};
    }
    this.addEditContact = !this.addEditContact;
  }
  async removeExperienceDetail() {
    const id = this.experienceDetailForm.id;
    if (id) {
      try {
        const res = await axios.delete(`/candidate/experience-detail/${id}`);
        if (res.data && res.data.affected) {
          const index = this.candidate.experienceDetails.findIndex((e: any) => e.id === id);
          this.candidate.experienceDetails.splice(index, 1);
          this.addEditExperience = false;
          this.experienceDetailForm = {};
          this.$store.dispatch(
            'Ui/showToast',
            { text: 'Información actualizada con éxito', color: 'success' },
            { root: true }
          );
        }
      } catch (error) {
        this.$store.dispatch(
          'Ui/showToast',
          { text: 'Error al eliminar', color: 'error' },
          { root: true }
        );
      }
    } else {
      this.experienceDetailForm = null;
      this.addEditExperience = false;
    }
  }

  async removeEducationDetail() {
    const id = this.educationDetailForm.id;
    if (id) {
      try {
        const res = await axios.delete(`/candidate/education-detail/${id}`);
        if (res.data && res.data.affected) {
          const index = this.candidate.educationDetails.findIndex((e: any) => e.id === id);
          this.candidate.educationDetails.splice(index, 1);
          this.addEditEducation = false;
          this.educationDetailForm = {};
          this.$store.dispatch(
            'Ui/showToast',
            { text: 'Información actualizada con éxito', color: 'success' },
            { root: true }
          );
        }
      } catch (error) {
        this.$store.dispatch(
          'Ui/showToast',
          { text: 'Error al eliminar', color: 'error' },
          { root: true }
        );
      }
    } else {
      this.educationDetailForm = null;
      this.addEditEducation = false;
    }
  }

  async updateResume() {
    const isValid = this.formRefResume.validate();
    if (!isValid) {
      return;
    }
    this.loadingResume = true;
    const formData = new FormData();
    formData.append('resume', this.resume);
    try {
      const res = await axios.put('/candidate/update/resume', formData, {
        headers: { ContentType: 'multipart/form-data' },
      });
      this.candidate.resume = res.data.url;
      this.addEditResume = false;
      this.$store.dispatch(
        'Ui/showToast',
        { text: 'Información actualizada con éxito', color: 'success' },
        { root: true }
      );
    } catch (error) {
      this.$store.dispatch(
        'Ui/showToast',
        { text: 'Ocurrio un error al subir curriculum', color: 'error' },
        { root: true }
      );
    } finally {
      this.loadingResume = false;
    }
  }

  async updateCandidate() {
    try {
      // contact
      let contactChange = false;
      const diffContact = diffObjects(this.contact, this.oldContact);
      if (
        (diffContact && Object.keys(diffContact).length > 0) ||
        (Object.keys(this.contact || {}).length === 0 && this.addEditContact)
      ) {
        contactChange = true;
        // validate form
        const isValid = this.formRefContact.validate();
        if (!isValid) {
          return;
        }
      }

      //education details
      let educationChange = false;
      let oldEducationDetails = this.candidate.educationDetails || [];
      const newEducationDetails = [...oldEducationDetails];
      if (this.educationDetailForm && Object.keys(this.educationDetailForm).length > 0) {
        if (!this.educationDetailForm.id) {
          newEducationDetails.push(this.educationDetailForm);
        }
        educationChange = true;
      }
      //experience details
      let experienceChange = false;
      const experienceEducationDetails = this.candidate.experienceDetails || [];
      const newExperienceDetails = [...experienceEducationDetails];
      console.log(this.experienceDetailForm);

      if (this.experienceDetailForm && Object.keys(this.experienceDetailForm).length > 0) {
        if (!this.experienceDetailForm.id) {
          newExperienceDetails.push(this.experienceDetailForm);
        }
        experienceChange = true;
      }

      //skill sets
      let skillSetsChange = false;
      const diffSkillSets = this.skillSetsForm.filter(
        (s: any) => !this.candidate.skillSets.some(({ id }: any) => s.id === id)
      );
      if (diffSkillSets.length > 0) {
        skillSetsChange = true;
        this.loadingSkillSets = true;
      }

      await axios.put('/candidate/update', {
        educationDetails: educationChange ? newEducationDetails : null,
        experienceDetails: experienceChange ? newExperienceDetails : null,
        skillSets: skillSetsChange ? this.skillSetsForm : null,
        contactDetails: contactChange ? this.contact : null,
      });
      this.candidate.educationDetails = newEducationDetails;
      this.candidate.experienceDetails = newExperienceDetails;
      if (skillSetsChange) {
        this.candidate.skillSets = this.skillSets.filter((s: any) =>
          this.skillSetsForm.some((value) => s.id === value)
        );
      }
      if (contactChange) {
        this.oldContact = { ...this.contact };
      }
      this.addEditExperience = false;
      this.addEditEducation = false;
      this.addEditSkillSets = false;
      this.loadingSkillSets = false;
      this.addEditContact = false;
      this.$store.dispatch(
        'Ui/showToast',
        { text: 'Información actualizada con éxito', color: 'success' },
        { root: true }
      );
    } catch (error) {
      console.log(error);
      this.$store.dispatch(
        'Ui/showToast',
        { text: 'Ocurrio un error al actualizar', color: 'error' },
        { root: true }
      );
    }
  }
}
</script>
