<template>
  <div>{{ state }}</div>
</template>

<script setup lang="ts">
import AuthStore, { AUTH_STORE_NAME } from "@/store/modules/auth.store";
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

const authStore = namespace(AUTH_STORE_NAME);

@Component
export default class CompanyRegistration extends Vue {
  state: string;

  @authStore.Getter
  responseState : typeof AuthStore.prototype.responseState;

  created() {
    this.state = this.responseState;
  }

}
</script>

<style scoped>
</style>