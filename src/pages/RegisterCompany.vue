<template>
  <div>Checando token...</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

@Component
export default class RegisterCompany extends Vue {
  async created() {
    const token = this.$route.query.token;
    try {
      await axios.get("http://localhost:4000/company/validate-invitation-token", {
        params: { token: token },
      });

      console.log("Token válido");
      Vue.prototype.$AuthService.login({ state: token });
    } catch (error) {
      console.log("Token inválido");
    }
  }
}
</script>

<style scoped>
</style>