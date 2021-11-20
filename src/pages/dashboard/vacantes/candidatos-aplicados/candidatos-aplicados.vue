<template>
  <div class="mt-5">
    <div class="text-center" color="primary">
      <h2>Candidatos aplicados</h2>
    </div>
    <v-container>
      <v-btn text :to="`/dashboard`">
        <v-icon>mdi-keyboard-backspace</v-icon>
        <span class="mr-2">Regresar</span>
      </v-btn>
    </v-container>

    <v-card class="card">
      <v-card-text>
        <v-data-table
          ref="table"
          item-class="success"
          :headers="headers"
          :items="candidatesItems"
          :items-per-page="50"
          :options.sync="pagOptions"
          :footer-props="{
            disableItemsPerPage: true,
            itemsPerPageText: '',
          }"
          :loading="false"
          no-data-text="Sin datos para mostrar"
          :mobile-breakpoint="0"
        >
          <template slot="loading">
            <div class="mt-5">
              <p>Cargando...</p>
            </div>
          </template>

          <template v-slot:[`item.avatar`]="{ item }">
            <v-avatar color="primary" size="36">
              <span class="white--text">{{ speakerInitials(item.name) }}</span>
            </v-avatar>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon :href="item.resume" target="_blank">
              <v-icon>mdi-download</v-icon>
            </v-btn>

            <v-btn icon :to="`/profiles/${item.id}`" target="_blank">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { validateUnauthorizedError } from '@/auth/auth.validatod';
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AppliedCandidates extends Vue {
  pagOptions = {};
  candidatesItems: any[] = [];
  headers = [
    {
      text: 'Imagen',
      align: 'center',
      sortable: false,
      value: 'avatar',
    },
    {
      text: 'Nombre',
      align: 'center',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Email',
      align: 'center',
      sortable: false,
      value: 'email',
    },
    {
      text: 'Acciones',
      align: 'center',
      sortable: false,
      value: 'actions',
    },
  ];
  async mounted() {
    if (!this.$route.params || !this.$route.params.id) {
      this.$router.replace('/dashboard');
    }
    try {
      const res = await axios.get(`job-posts/${this.$route.params.id}/candidates-applied`);
      this.candidatesItems = res.data.map((r: any) => ({
        name: r.candidate.user.name,
        email: r.candidate.user.email,
        resume: r.candidate.resume,
        id: r.candidate.id,
      }));
    } catch (error) {
      validateUnauthorizedError(error);
    }
  }
  speakerInitials(userName: string) {
    const name = userName.split(' ');
    return `${name[0].charAt(0)}${name[1] ? name[1].charAt(0) : ''}`;
  }
}
</script>

<style></style>
