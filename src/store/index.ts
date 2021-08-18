import JobPost from '@/store/modules/job-post';
import Vue from 'vue';
import Vuex from 'vuex';
import Ui from './modules/ui';
import AuthStore from './modules/auth.store';

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    JobPost,
    Ui,
    AuthStore,
  },
});
export default store;
