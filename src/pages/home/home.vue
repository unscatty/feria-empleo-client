<template>
    <div>Home Works!!!</div>
</template>

<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import { HomeComponent } from "./home.component";

@Component
export default class Home extends Vue {
    private component: HomeComponent = new HomeComponent();

    created() {
        this.component.showMessage();
    }
}
</script>