<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
      </div>


      <v-spacer></v-spacer>


      <v-btn to="/companies" text>
        <span class="mr-2">Empresas</span>
      </v-btn>

      <v-btn to="/dashboard" text>
        <span class="mr-2">Dashboard</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
