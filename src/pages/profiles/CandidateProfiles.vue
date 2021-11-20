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
            </v-toolbar>

            <v-list v-if="contact">
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

            <v-card-text v-if="contact">
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
            <v-card-text v-else class="text-center"> Sin datos </v-card-text>
          </v-card>
          <v-card class="mt-8">
            <v-card-title> Curriculum </v-card-title>
            <v-card-text v-if="candidate.resume">
              <a :href="candidate.resume" target="_blank"
                ><v-icon>mdi-download</v-icon> Descargar</a
              >
            </v-card-text>
            <v-card-text v-else class="text-center"> Sin datos </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="8">
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title>Experiencia profesional</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>

            <v-card-text>
              <div>
                <v-list-item v-for="experience in candidate.experienceDetails" :key="experience.id">
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
            </v-card-text>
          </v-card>

          <v-card class="mt-8">
            <v-toolbar flat>
              <v-toolbar-title>Habilidades</v-toolbar-title>

              <v-spacer></v-spacer>
            </v-toolbar>
            <v-divider></v-divider>

            <v-card-text>
              <div>
                <v-chip v-for="skill in candidate.skillSets" :key="skill.id" class="mr-2">
                  {{ skill.name }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <v-card class="mt-8">
            <v-toolbar flat>
              <v-toolbar-title>Educación</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-divider></v-divider>

            <v-card-text>
              <div>
                <v-list-item v-for="education in candidate.educationDetails" :key="education.id">
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
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { head } from 'lodash';
import moment from 'moment';
import Vue from 'vue';
import Component from 'vue-class-component';

import { levelItems } from '@/constants/candidate';

const month = 1;
const year = 3;

@Component
export default class Profile extends Vue {
  public candidate: any = null;
  public contact: any = null;

  created() {
    const id = this.$route.params.id;
    if (!id) {
      this.$router.replace('/');
    }
    this.getCandidate(id);
    this.getContactDetails(id);
  }

  public async getCandidate(id: string) {
    try {
      const res = await axios.get(`/candidate/${id}`);
      this.candidate = res.data;
    } catch (error) {
      this.$router.replace('/');
    }
  }

  public async getContactDetails(id: string) {
    try {
      const res = await axios.get(`/candidate/contact/${id}`);
      this.contact = head(res.data);
    } catch (error) {
      this.$router.replace('/');
    }
  }

  getYear(date: Date) {
    if (!date) return '';
    return moment(date).format('YYYY');
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
}
</script>
