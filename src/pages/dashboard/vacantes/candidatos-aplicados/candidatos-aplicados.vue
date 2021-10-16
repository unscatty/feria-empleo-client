<template>
  <div class="mt-5">
    <v-card class="card">
      <v-card-text>
        <v-data-table
          ref="table"
          item-class="success"
          :headers="headers"
          :items="candidatesItems"
          :server-items-length="10"
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
              <span class="white--text ">{{ speakerInitials(item.name) }}</span>
            </v-avatar>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
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
  ];
  async mounted() {
    if (!this.$route.params || !this.$route.params.id) {
      this.$router.replace('/dashboard');
    }
    console.log(this.$route.params);

    try {
      const res = await axios.get(`job-posts/${this.$route.params.id}/candidates-applied`);
      console.log(res);
      this.candidatesItems = res.data;
    } catch (error) {
      console.log(error);
    }
  }
  speakerInitials(userName: string) {
    const name = userName.split(' ');
    return `${name[0].charAt(0)}${name[1] ? name[1].charAt(0) : ''}`;
  }
}
</script>

<style></style>
