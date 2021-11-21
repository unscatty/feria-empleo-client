<template>
  <v-container v-if="tokenClaims" class="fill-height" fluid>
    <v-row align="start" justify="start">
      <v-col cols="12">
        <v-overlay opacity="1">
          <v-card fluid class="grey lighten-5 fill-height rounded-lg">
            <v-card-title class="primary text-sm-h5 text-md-h4 font-weight-bold">
              ¡Bienvenido a la feria del empleo!
            </v-card-title>
            <v-card-text class="grey--text text--darken-4">
              <v-container fluid class="fill-height">
                <v-row align="center" justify="center">
                  <v-col cols="12">
                    <div class="text-md-h5">
                      <p>Hola {{ name }} {{ lastname }}.</p>
                      <p>Gracias por registrarte en la Feria del empleo ESCOM 2021</p>
                      <br />
                      <p>La feria estará disponible hasta el día {{ formattedDate }}</p>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-overlay>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { lazyInject } from '@/app.container';
import AuthService from '@/auth/auth.service';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ComeBackLater extends Vue {
  @Prop({ type: Date, required: true })
  private readonly releaseDate: Date;

  @Prop({
    type: Object,
    default: () => ({
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  })
  dateFormatOptions: Intl.DateTimeFormatOptions;

  @Prop({ type: String, default: 'es-MX' })
  private readonly locale: string;

  @lazyInject(AuthService)
  private readonly authService: AuthService;

  get name() {
    return this.tokenClaims.given_name;
  }

  get lastname() {
    return this.tokenClaims.family_name;
  }

  get email() {
    return this.tokenClaims.emails[0];
  }

  get tokenClaims() {
    return this.authService.account.idTokenClaims as {
      emails: string[];
      given_name: string;
      family_name: string;
    };
  }

  get formattedDate() {
    return this.releaseDate.toLocaleDateString(this.locale, this.dateFormatOptions);
  }
}
</script>

<style scoped></style>
