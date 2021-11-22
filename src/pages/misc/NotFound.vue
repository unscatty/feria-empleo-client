<template>
  <div>
    <div class="hero">
      <img src="@/assets/img/not-found-bg.jpg" alt="" />
    </div>
    <!-- <div class="credits">
      <a class="clickable" href="http://www.freepik.com"></a>
    </div> -->
    <div class="content">
      <v-container>
        <v-row align="center">
          <v-col></v-col>
          <v-col cols="auto" align-self="center">
            <p class="text-hero text-h1 white--text font-weight-medium text-center">OOPS!</p>
            <br />
            <br />
            <p class="text-h5 white--text text-center">La página que estás buscando no existe</p>
            <br />
            <v-row>
              <v-col>
                <v-row class="actions" align="center" justify="space-around">
                  <v-btn rounded large @click="$router.go(-1)">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                    Regresar
                  </v-btn>
                </v-row>
              </v-col>
              <v-col>
                <v-row class="actions" align="center" justify="space-around">
                  <!-- TODO: change to use named route -->
                  <v-btn rounded large @click="$router.push('/')">
                    <v-icon>mdi-home-circle</v-icon>
                    Inicio
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({});
</script>

<style lang="scss" scoped>
$leftHalf: 50%;
$leftPad: 30%;

.hero {
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-color: #1a7eba;
  z-index: 1;

  img {
    position: absolute;
    top: 0;
    left: -($leftHalf - $leftPad);
    right: 0;
    bottom: 0;
    margin: auto;
    min-height: 50%;
    height: 50%;
  }
}

.credits {
  position: absolute;
  left: $leftPad;
  z-index: 2;
  width: 250px;
  height: 26px;
  bottom: 16px;

  .clickable {
    display: block;
    position: relative;

    // border: 2px solid blue;

    width: 100%;
    height: 100%;
    left: -50%;
  }
}

.content {
  margin-top: 12%;
  z-index: 10;

  * {
    z-index: 10;
  }
}

.text-hero {
  text-shadow: 0px 4px 3px rgba(0, 0, 0, 0.4), 0px 8px 13px rgba(0, 0, 0, 0.1),
    0px 18px 23px rgba(0, 0, 0, 0.1);
}
</style>
