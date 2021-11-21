<!-- <template>
  <div>{{ message }}</div>
</template> -->

<script lang="ts">
import { lazyInject } from '@/app.container';
import AuthService from '@/auth/auth.service';
import { homeRoute } from '@/routes';
import { CompanyService } from '@/services/company.service';
import Ui from '@/store/modules/ui';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const uiStore = namespace('Ui');

@Component
export default class InvitationVerification extends Vue {
  @lazyInject(CompanyService)
  protected companyService: CompanyService;

  @lazyInject(AuthService)
  authService: AuthService;

  @uiStore.Action
  showToast: typeof Ui.prototype.showToast;

  message = '';

  async created() {
    await this.authService.handleRedirect();
    const urlToken = this.$route.query.token as string;

    if (!urlToken) {
      this.message = 'Token no presente';
      return;
    }

    const validToken = await this.companyService.verifyInvitationToken(urlToken);

    if (validToken) {
      this.message = 'Token válido';

      await this.authService.handleRedirect();
      await this.authService.registerCompany({ state: urlToken });
    } else {
      this.message = 'Token inválido';

      this.showToast({
        text: 'El token te invitación no es válido o ha caducado. Por favor contacta a un administrador',
        color: 'error',
      });

      this.$router.push(homeRoute);
    }
  }
}
</script>

<style scoped></style>
