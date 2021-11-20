<template>
  <v-container>
    <v-row>
      <v-col class="text-center text-md-right mb-3">
        <v-btn
          color="primary"
          @click="
            component.currentPosition = null;
            component.dialog = true;
          "
        >
          <v-icon class="mr-2">mdi-plus-circle</v-icon>
          Invitar empresa
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-card class="card">
          <v-card-text>
            <v-data-table
              ref="table"
              item-class="success"
              :headers="component.headers"
              :items="companies"
              :server-items-length="paginationResponse.meta.totalItems"
              :options.sync="pagOptions"
              :footer-props="{
                disableItemsPerPage: true,
                itemsPerPageText: '',
              }"
              :loading="component.loadingTable"
              no-data-text="Sin datos para mostrar"
              :mobile-breakpoint="0"
            >
              <template slot="loading">
                <div class="mt-5">
                  <p>Cargando...</p>
                </div>
              </template>
              <template v-slot:[`item.imageURL`]="{ item }">
                <v-img
                  max-height="70"
                  aspect-ratio="1"
                  contain
                  :src="item.image ? item.image.imageURL : ''"
                  class="rounded-circle"
                ></v-img>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-icon class="mx-2" @click="component.editCompany(item)"> mdi-pencil </v-icon>
                <v-icon class="mx-2" @click="component.openDeleteDialog(item)">
                  mdi-trash-can-outline
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <InviteDialog
      :position="component.currentPosition"
      :dialog="component.dialog"
      :is-update="component.updating"
      :service="companyService"
      @close="closeDialog"
      @invited="invitationSent"
    ></InviteDialog>

    <v-dialog v-model="component.deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline"> Eliminar vacante </v-card-title>
        <v-card-text> ¿Estas seguro que deseas eliminar esta vacante?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="component.loading"
            color="green darken-1"
            text
            @click="component.deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            :loading="component.loading"
            color="green darken-1"
            text
            @click="onDeleteJobPost()"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { CompanyService } from '@/services/company.service';
import { PaginationResponse } from '@/utils/pagination.interface';

import InviteDialog from '@/components/companies/InvitationDialog.vue';

import ICompany from '@/models/company/company.interface';
import { AdminCompaniesComponent } from './companies.component';
import { lazyInject } from '@/app.container';

@Component({
  components: { InviteDialog },
})
export default class AdminCompanies extends Vue {
  @lazyInject(CompanyService)
  protected companyService: CompanyService;
  private component = new AdminCompaniesComponent();

  public paginationResponse: PaginationResponse<ICompany> = {
    items: [],
    meta: {
      itemCount: 0,
      totalItems: 0,
      itemsPerPage: 0,
      totalPages: 0,
      currentPage: 0,
    },
  };

  public companies: ICompany[] = [];

  public pagOptions: any = {};

  @Watch('pagOptions')
  async pagOptionsChange() {
    // const { page } = this.pagOptions;
    this.component.loadingTable = true;
    // Load companies
    await this.getCompanies();
    this.component.loadingTable = false;
  }

  async created() {
    this.pagOptions = {
      page: 1,
      itemsPerPage: 10,
    };

    await this.getCompanies();
  }

  async getCompanies() {
    const { page, itemsPerPage } = this.pagOptions;

    try {
      const response = await this.companyService.getAllPaginated({
        params: { page, limit: itemsPerPage },
      });
      this.paginationResponse = response;

      this.companies = this.paginationResponse.items;
    } catch (error) {
      // console.error(error);
    }
  }

  async onDeleteJobPost() {
    const toDelete = this.component.currentPosition;
    this.component.loading = true;

    // Delete on backend
    await this.companyService.delete(toDelete);
    // Update table
    const index = this.companies.indexOf(toDelete);
    this.companies.splice(index, 1);
    this.pagOptions.itemsPerPage--;

    this.component.loading = false;
    this.component.deleteDialog = false;
  }

  invitationSent(company: ICompany) {
    this.companies.push(company);
    this.$forceUpdate();
    this.$store.dispatch(
      'Ui/showToast',
      { text: 'Invitación enviada con éxito', color: 'success' },
      { root: true }
    );
  }

  closeDialog() {
    this.component.dialog = false;
    this.component.updating = false;
  }
}
</script>
<style></style>
