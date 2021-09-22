import 'reflect-metadata';
import { TiptapVuetifyPlugin } from 'tiptap-vuetify';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import './axios';
import vuetify from './plugins/vuetify';
import router from './routes';
import store from './store';

Vue.use(VueRouter);
Vue.use(TiptapVuetifyPlugin, {
  // the next line is important! You need to provide the Vuetify Object to this place.
  vuetify, // same as "vuetify: vuetify"
  // optional, default to 'md' (default vuetify icons before v2.0.0)
  iconsGroup: 'mdi',
});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  vuetify,
  router,
  store,
}).$mount('#app');
