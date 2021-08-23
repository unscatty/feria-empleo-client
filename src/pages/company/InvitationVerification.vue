<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
import { CompanyService } from "@/services/company.service";
import AuthStore, { AUTH_STORE_NAME } from "@/store/modules/auth.store";
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

const authStore = namespace(AUTH_STORE_NAME);

@Component
export default class InvitationVerification extends Vue {
  protected companyService: CompanyService = new CompanyService(
    process.env.VUE_APP_SERVER_HOST,
    "company",
    10_000
  );

  message = "";

  @authStore.Action
  loginCompany: typeof AuthStore.prototype.loginCompany;

  async created() {
    const urlToken = this.$route.query.token as string;

    if (!urlToken) {
      this.message = "Token no presente";
      return;
    }

    const validToken = await this.companyService.verifyInvitationToken(
      urlToken
    );

    if (validToken) {
      this.message = "Token válido";
      this.loginCompany({ state: urlToken });
    } else {
      this.message = "Token inválido";
    }
  }
}
</script>

<style scoped>
</style>