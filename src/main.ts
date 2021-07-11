import Vue from 'vue'
import VueRouter from 'vue-router';

import App from './App.vue'
import { AuthService } from './auth/auth.service';
import routes from './routes'

Vue.use(VueRouter);

Vue.prototype.$AuthService = new AuthService()

Vue.config.productionTip = false

const router = new VueRouter({
  mode: "history",
  routes
});


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
