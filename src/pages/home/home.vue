<template>
  <div>
    <div>Home Works!!!</div>
    <button name="logout" @click="logout">Logout</button>
    <input type="text" v-model="state" />
    <button name="login" @click="login">Login</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { HomeComponent } from "./home.component";
import axios from "axios";

@Component
export default class Home extends Vue {
  private component: HomeComponent = new HomeComponent();
  private state: string = "";

  async created() {
    this.component.showMessage();
    console.log(Vue.prototype.$AuthService.getToken());

    const callbackToken = localStorage.getItem("accountState");

    if (callbackToken && callbackToken !== "") {
      try {
        const { data } = await axios.post(
          "http://localhost:4000/company/register",
          {
            token: localStorage.getItem("accountState"),
          },
          {
            headers: {
              Authorization: `Bearer ${Vue.prototype.$AuthService.getToken()}`,
            },
          }
        );

        console.log(
          `Empresa ${data.company.name} registrada a nombre de ${data.user.email}`
        );

        console.log(data);
      } catch (error) {
        console.log("No se pudo registar la empresa");
      }
    }
  }

  logout() {
    Vue.prototype.$AuthService.logout();
  }

  login() {
    Vue.prototype.$AuthService.login({ state: this.state });
    // axios.post("locahost:4000/check-state", {});
  }
}
</script>