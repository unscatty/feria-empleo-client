<template>
    <div v-if="data.contact && data.candidate">
        
        <div class="contact-details">

            <v-stepper non-linear>
                <v-stepper-header>
                    <v-stepper-step step="1" editable>
                        Datos de contacto
                    </v-stepper-step>

                    <v-stepper-step step="2" editable>
                        Habilidades
                    </v-stepper-step>

                    <v-stepper-step step="3" editable>
                        Experiencia laboral
                    </v-stepper-step>

                    <v-stepper-step step="4" editable>
                        Curriculum
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                     <v-stepper-content step="1">
                        <v-form>
                            <v-row>
                                <v-col cols="12" class="input_item">
                                    <v-text-field
                                        label="Teléfono"
                                        v-model="data.contact.phone"
                                        prepend-icon="mdi-phone"
                                        type="text"
                                    />
                                </v-col>
                                <v-col cols="12" class="input_item">
                                    <v-text-field
                                        label="Dirección"
                                        v-model="data.contact.address"
                                        prepend-icon="mdi-home"
                                        type="text"
                                    />
                                </v-col>
                                <v-col cols="12" class="input_item">
                                    <v-text-field
                                        label="LinkedIn"
                                        v-model="data.contact.linkedinUrl"
                                        prepend-icon="mdi-linkedin"
                                        type="text"
                                    />
                                </v-col>
                                <v-col cols="12" class="input_item">
                                    <v-text-field
                                        label="Facebook"
                                        v-model="data.contact.facebookUrl"
                                        prepend-icon="mdi-facebook"
                                        type="text"
                                    />
                                </v-col>
                                <v-col cols="12" class="input_item">
                                    <v-text-field
                                        label="Github"
                                        v-model="data.contact.githubUrl"
                                        prepend-icon="mdi-github"
                                        type="text"
                                    />
                                </v-col>
                                <v-col cols="12" class="input_item">
                                    <v-text-field
                                        label="Página web"
                                        v-model="data.contact.webSite"
                                        prepend-icon="mdi-web"
                                        type="text"
                                    />
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <v-row>
                            <v-col>
                                <v-text-field
                                        label="Habilidades"
                                        prepend-icon="mdi-skill"
                                        type="text"
                                        v-on:keyup.enter="saveSkill()"
                                        v-model="data.newSkill"
                                    />
                            </v-col>
                        </v-row>
                        <div class="chips" v-for="skill in data.candidate.skillSets" :key ="skill.id">
                            <span class="chip"><v-chip close @click:close="removeSkill(skill)">{{skill.name}}</v-chip></span>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <v-btn @click="data.candidate.experienceDetails.push({})" color="primary" text
                        class="add">
                            <v-icon color="primary">
                              mdi-plus-circle-outline
                            </v-icon>
                            Agregar
                          </v-btn>
                        <div v-for="job in data.candidate.experienceDetails" :key="job.id">
                            <ExperienceDetailForm :form="job">
                            </ExperienceDetailForm>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <strong>Curriculum activo</strong>
                        <div class="download">
                            <a :href="data.candidate.resume" target="_blank"><v-icon>mdi-download</v-icon> Visualizar</a>
                        </div>
                        <br><br>
                        <strong>Nuevo curriculum</strong>
                        <br><br>
                        <v-file-input
                            v-model="resume"
                            show-size
                            :rules="[]"
                            label="Curriculum"
                        ></v-file-input>

                        <v-btn color="primary" text class="add" v-on:click="saveCandidate()">
                            <v-icon color="primary">
                              mdi-save
                            </v-icon>
                            Guardar
                        </v-btn>
                    </v-stepper-content>
                </v-stepper-items>
                   
            </v-stepper>
           
        </div>
    </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { EditProfileComponent } from './edit-profile.component';
import  ExperienceDetailForm from '../../../components/candidate/ExperienceDetailForm.vue';
import { lazyInject } from '@/app.container';
import { UpdateCandidateService } from './edit-candidate.service';

@Component({
    components: {
        ExperienceDetailForm
    }
})
export default class EditProfile extends EditProfileComponent {
    
    async created() {
        await this.getCandidate();
        await this.getContactDetails();
    }
}
</script>

<style scoped>
@import "./edit-profile.css";
</style>