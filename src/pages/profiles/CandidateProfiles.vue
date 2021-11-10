<template>
    <div v-if="component.data.candidate">

        <div class="introduction">
            <div class="profile-info">
                <div class="name">
                    {{ component.data.candidate.user.name }} {{ component.data.candidate.user.lastname }}
                </div>
                <div class="education">
                    {{ component.data.candidate.educationDetails[0].institutionName }} <br>
                    {{ component.data.candidate.educationDetails[0].degree }} <br>
                </div>
            </div>

            <div class="contact">
                <span class="title"> Contacto </span>  <br> <br>
                <v-icon color="#1976d2">mdi-phone</v-icon> {{ component.data.contact.phone}} <br> <br>
                <v-icon color="#1976d2">mdi-mail</v-icon> {{ component.data.contact.address}}

                <div class="social-networks">
                    <span v-if="component.data.contact.linkedinUrl">
                        <a v-bind:href="component.data.contact.linkedinUrl" target="_blank"><v-icon color="#1976d2">mdi-linkedin</v-icon></a>
                    </span>
                    <span v-if="component.data.contact.githubUrl">
                        <a v-bind:href="component.data.contact.githubUrl" target="_blank"><v-icon color="#1976d2">mdi-github</v-icon></a>
                    </span>
                    <span v-if="component.data.contact.facebookUrl">
                        <a v-bind:href="component.data.contact.facebookUrl" target="_blank"><v-icon color="#1976d2">mdi-facebook</v-icon></a>
                    </span>
                    <span v-if="component.data.contact.webSite">
                       <a v-bind:href="component.data.contact.webSite" target="_blank"><v-icon color="#1976d2">mdi-web</v-icon></a>
                    </span>
                </div>
            </div>

            <div class="resume">
                <span class="title"> Curriculum </span> <br>
                <div class="download">
                    <a :href="component.data.candidate.resume" target="_blank"><v-icon>mdi-download</v-icon> Descargar</a>
                </div>
            </div>
        </div>

        <div class="skills">
            <span class="title"> Habilidades </span> <br>
            <div class="chips" v-for="skill in component.data.candidate.skillSets" :key ="skill.id">
                <span class="chip"><v-chip>{{skill.name}}</v-chip></span>
            </div>
        </div>
        
        <div class="experience">
            <span class="title"> Experiencia laboral </span> <br>
            <div class="job" v-for="job in component.data.candidate.experienceDetails" :key="job.id">
                <div class="header">
                    <span class="name"> {{job.companyName }}</span> <br>
                    <span class="date">{{getStringDate(job.startDate) }} - {{getStringDate(job.endDate)}}</span> <br>
                </div>
                <span class="description">
                    <p>
                       {{job.jobDescription}}
                    </p>
                </span>
            </div>
        </div>


    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

import { CandidateProfilesComponent } from './candidateProfiles.component';

const month = 1;
const year = 3;

@Component({})
export default class CandidateProfiles extends Vue {

    public component: CandidateProfilesComponent;
    private id: string;

    constructor() {
        super();
        this.component = new CandidateProfilesComponent();
    }

    created() {
        this.id = this.$route.params.id;
        this.component.getCandidate(this.id);
        this.component.getContactDetails(this.id);
    }

    getStringDate(date: string) {
        const givenDate = new Date(date).toString().split(' ');
        return `${givenDate[month] } ${givenDate[year]}`;
    }
}
</script>

<style scoped>
@import "./candidate-profiles.css";
</style>