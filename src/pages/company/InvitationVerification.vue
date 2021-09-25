<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
import { CompanyService } from "@/services/company.service";
import { Component, Vue } from "vue-property-decorator";
import { lazyInject } from "@/app.container";
import AuthService from "@/auth/auth.service";

@Component
export default class InvitationVerification extends Vue {
  @lazyInject(CompanyService)
  protected companyService: CompanyService;

  @lazyInject(AuthService)
  authService: AuthService;

  message = "";

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

      await this.authService.handleRedirect();
      await this.authService.registerCompany({ state: urlToken });
    } else {
      this.message = "Token inválido";
    }
  }
}
</script>

<style scoped>
</style>