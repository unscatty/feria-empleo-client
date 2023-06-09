<template>
  <div v-if="component.data.candidate">
    <div class="edit">
      <router-link :to="'/profile/edit'" v-tooltip="'Editar perfil'" class="router">
        <v-icon color="white">mdi-pencil</v-icon>
      </router-link>
    </div>

    <div class="introduction">
      <div class="profile-info">
        <div class="name">{{ component.data.candidate.name }} {{ component.data.candidate.lastname }}</div>

        <div class="introduction">
          <div class="profile-info">
            <div class="name">
              {{ component.data.candidate.name }} {{ component.data.candidate.lastname }}
            </div>
            <div class="education">
              {{ component.data.candidate.educationDetails[0].institutionName }} <br />
              {{ component.data.candidate.educationDetails[0].degree }} <br />
            </div>
          </div>

          <div class="contact">
            <span class="title"> Contacto </span> <br />
            <br />
            <div v-if="component.data.contact != null">
              <v-icon color="#1976d2">mdi-phone</v-icon> {{ component.data.contact.phone }} <br />
              <br />
              <v-icon color="#1976d2">mdi-mail</v-icon> {{ component.data.contact.address }}
            </div>

            <div class="social-networks" v-if="component.data.contact != null">
              <span v-if="component.data.contact.linkedinUrl">
                <a v-bind:href="component.data.contact.linkedinUrl" target="_blank"
                  ><v-icon color="#1976d2">mdi-linkedin</v-icon></a
                >
              </span>
              <span v-if="component.data.contact.githubUrl">
                <a v-bind:href="component.data.contact.githubUrl" target="_blank"
                  ><v-icon color="#1976d2">mdi-github</v-icon></a
                >
              </span>
              <span v-if="component.data.contact.facebookUrl">
                <a v-bind:href="component.data.contact.facebookUrl" target="_blank"
                  ><v-icon color="#1976d2">mdi-facebook</v-icon></a
                >
              </span>
              <span v-if="component.data.contact.webSite">
                <a v-bind:href="component.data.contact.webSite" target="_blank"
                  ><v-icon color="#1976d2">mdi-web</v-icon></a
                >
              </span>
            </div>
          </div>

          <div class="resume">
            <span class="title"> Curriculum </span> <br />
            <div class="download">
              <a :href="component.data.candidate.resume" target="_blank"
                ><v-icon>mdi-download</v-icon> Descargar</a
              >
            </div>
          </div>
        </div>
      </div>

      <div class="contact">
        <span class="title"> Contacto </span> <br />
        <br />
        <v-icon color="#1976d2">mdi-phone</v-icon>
        {{ component.data.contact ? component.data.contact.phone : '' }} <br />
        <br />
        <v-icon color="#1976d2">mdi-mail</v-icon>
        {{ component.data.contact ? component.data.contact.address : '' }}

        <div class="social-networks">
          <span v-if="component.data.contact ? component.data.contact.linkedinUrl : ''">
            <a v-bind:href="component.data.contact ? component.data.contact.linkedinUrl : ''" target="_blank"
              ><v-icon color="#1976d2">mdi-linkedin</v-icon></a
            >
          </span>
          <span v-if="component.data.contact ? component.data.contact.githubUrl : ''">
            <a v-bind:href="component.data.contact ? component.data.contact.githubUrl : ''" target="_blank"
              ><v-icon color="#1976d2">mdi-github</v-icon></a
            >
          </span>
          <span v-if="component.data.contact ? component.data.contact.facebookUrl : ''">
            <a v-bind:href="component.data.contact ? component.data.contact.facebookUrl : ''" target="_blank"
              ><v-icon color="#1976d2">mdi-facebook</v-icon></a
            >
          </span>
          <span v-if="component.data.contact ? component.data.contact.webSite : ''">
            <a v-bind:href="component.data.contact ? component.data.contact.webSite : ''" target="_blank"
              ><v-icon color="#1976d2">mdi-web</v-icon></a
            >
          </span>
        </div>
      </div>

      <div class="resume">
        <span class="title"> Curriculum </span> <br />
        <div class="download">
          <a href="https://poccompany.blob.core.windows.net/feria/Josue Ruiz resume.pdf" target="_blank"
            ><v-icon>mdi-download</v-icon> Descargar</a
          >
        </div>
      </div>
    </div>

    <div class="skills">
      <span class="title"> Habilidades </span> <br />
      <div class="chips" v-for="skill in component.data.candidate.skillSets" :key="skill.id">
        <span class="chip"
          ><v-chip>{{ skill.name }}</v-chip></span
        >
      </div>
    </div>

    <div class="experience">
      <span class="title"> Experiencia laboral </span> <br />
      <div class="job" v-for="job in component.data.candidate.experienceDetails" :key="job.id">
        <div class="header">
          <span class="name"> {{ job.companyName }}</span> <br />
          <span class="date">{{ getStringDate(job.startDate) }} - {{ getStringDate(job.endDate) }}</span>
          <br />
        </div>
        <span class="description">
          <p>
            {{ job.jobDescription }}
          </p>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { ProfileComponent } from './profile.component';

const month = 1;
const year = 3;

@Component({})
export default class Profile extends Vue {
  public component: ProfileComponent;

  constructor() {
    super();
    this.component = new ProfileComponent();
  }

  created() {
    this.component.getCandidate();
    this.component.getContactDetails();
  }

  getStringDate(date: string) {
    const givenDate = new Date(date).toString().split(' ');
    return `${givenDate[month]} ${givenDate[year]}`;
  }

  get getInsitutionName() {
    const candidate = this.component.data.candidate;
    console.log(candidate);

    return candidate.educationDetails && candidate.educationDetails.length > 0
      ? candidate.educationDetails[0].institutionName
      : '';
  }

  get getDegree() {
    const candidate = this.component.data.candidate;
    return candidate.educationDetails && candidate.educationDetails.length > 0
      ? candidate.educationDetails[0].degree
      : '';
  }
}
</script>

<style scoped>
@import './profile.css';
</style>
